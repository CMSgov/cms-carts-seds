import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { jwtDecode } from "jwt-decode";
import { IdmRoles, AppRoles, APIGatewayProxyEvent } from "../types";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { logger } from "../libs/debug-lib";

// prettier-ignore
interface DecodedToken {
  "custom:cms_roles": IdmRoles;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  identities?: [{ userId?: string }];
  email?: string
}

export class UserCredentials {
  role?: AppRoles;
  state?: string;
  identities?: [{ userId?: string }];
  email?: string;

  constructor(decoded?: DecodedToken) {
    if (decoded === undefined) return;
    const idmRole = decoded["custom:cms_roles"]
      .split(",")
      .find((r) => r.includes("mdctcarts")) as IdmRoles;
    this.role = mapIdmRoleToAppRole(idmRole);
    this.state = decoded["custom:cms_state"];
    this.identities = decoded.identities;
    this.email = decoded.email;
  }
}

/*
 * Resolving a circular dependency in deployment order
 *   ui-auth requires API-Gateway to be defined from here
 *   app-api requires the Cognito resources to be created
 * Get the cognito info if it hasn't been defined
 */
const loadCognitoValues = async () => {
  if (
    process.env.COGNITO_USER_POOL_ID &&
    process.env.COGNITO_USER_POOL_CLIENT_ID
  ) {
    return {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    };
  } else {
    const ssmClient = new SSMClient({ logger });
    const stage = process.env.stage;
    const getParam = async (identifier: string) => {
      const command = new GetParameterCommand({
        Name: `/${stage}/ui-auth/${identifier}`,
      });
      const result = await ssmClient.send(command);
      return result.Parameter?.Value;
    };

    const userPoolId = await getParam("cognito_user_pool_id");
    const userPoolClientId = await getParam("cognito_user_pool_client_id");
    if (userPoolId && userPoolClientId) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] = userPoolClientId;
      return { userPoolId, userPoolClientId };
    } else {
      throw new Error("cannot load cognito values");
    }
  }
};

export const isAuthorized = async (event: APIGatewayProxyEvent) => {
  if (!event.headers?.["x-api-key"]) return false;

  // Verifier that expects valid access tokens:
  const cognitoValues = await loadCognitoValues();
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoValues.userPoolId,
    tokenUse: "id",
    clientId: cognitoValues.userPoolClientId,
  });
  try {
    await verifier.verify(event.headers["x-api-key"]);
  } catch {
    console.log("Token not valid!"); // eslint-disable-line
    return false;
  }

  // get state and method from the event
  const requestState = event.pathParameters?.state;

  // If a state user, always reject if their state does not match a state query param
  const decoded = jwtDecode(event.headers["x-api-key"]) as DecodedToken;
  const idmRole = decoded["custom:cms_roles"]
    .split(",")
    .find((r) => r.includes("mdctcarts")) as IdmRoles;
  const userState = decoded["custom:cms_state"];
  const appRole = mapIdmRoleToAppRole(idmRole);
  if (appRole === AppRoles.STATE_USER && userState && requestState) {
    return userState.toLowerCase() === requestState.toLowerCase();
  }
  return true;
};

export const getUserNameFromJwt = (event: APIGatewayProxyEvent) => {
  let userName = "branchUser";
  if (!event.headers?.["x-api-key"]) return userName;

  const decoded = jwtDecode(event.headers["x-api-key"]) as DecodedToken;

  if (decoded["given_name"] && decoded["family_name"]) {
    userName = `${decoded["given_name"]} ${decoded["family_name"]}`;
    return userName;
  }

  if (decoded.identities && decoded.identities[0]?.userId) {
    userName = decoded.identities[0].userId;
    return userName;
  }

  return userName;
};

export const getUserCredentialsFromJwt = (event: APIGatewayProxyEvent) => {
  if (!event?.headers || !event.headers?.["x-api-key"])
    return new UserCredentials();
  const decoded = jwtDecode(event.headers["x-api-key"]) as DecodedToken;
  const credentials = new UserCredentials(decoded);
  return credentials;
};

export const mapIdmRoleToAppRole = (idmRole: IdmRoles) => {
  switch (idmRole) {
    case IdmRoles.APPROVER:
      return AppRoles.CMS_APPROVER;
    case IdmRoles.INTERNAL:
      return AppRoles.INTERNAL_USER;
    case IdmRoles.HELP:
      return AppRoles.HELP_DESK;
    case IdmRoles.BUSINESS_OWNER_REP:
      return AppRoles.CMS_USER;
    case IdmRoles.STATE:
      return AppRoles.STATE_USER;
    case IdmRoles.PROJECT_OFFICER:
      return AppRoles.CMS_ADMIN;
    default:
      throw new Error(
        `No App role configured for the provided IDM Role ${idmRole}`
      );
  }
};
