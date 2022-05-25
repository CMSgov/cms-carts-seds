import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { UserRoles, RequestMethods } from "../types";

// prettier-ignore
interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  identities?: [{ userId?: string }];
  email?: string
}

class UserCredentials {
  role?: string;
  state?: string;
  identities?: [{ userId?: string }];
  email?: string;

  constructor(decoded?: DecodedToken) {
    if (decoded === undefined) return;
    const role = decoded["custom:cms_roles"]
      .split(",")
      .find((r) => r.includes("mdctcarts"));
    this.role = role;
    this.state = decoded["custom:cms_state"];
    this.identities = decoded.identities;
    this.email = decoded.email;
  }
}

export const isAuthorized = (event: APIGatewayProxyEvent) => {
  if (!event.headers["x-api-key"]) return false;

  // get state and method from the event
  const requestState = event.pathParameters?.state;

  // decode the idToken
  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  // get the role / state from the decoded token
  const userRole = decoded["custom:cms_roles"];
  const userState = decoded["custom:cms_state"];

  // if user is a state user - check they are requesting a resource from their state
  if (userRole === UserRoles.STATE) {
    if (userState && requestState) {
      return userState.toLowerCase() === requestState.toLowerCase();
    }
    if (!requestState && event.httpMethod != RequestMethods.GET) {
      return false;
    }
  }
  return true;
};

export const getUserNameFromJwt = (event: APIGatewayProxyEvent) => {
  let userName = "branchUser";
  if (!event?.headers || !event.headers?.["x-api-key"]) return userName;

  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  if (decoded["given_name"] && decoded["family_name"]) {
    userName = `${decoded["given_name"]} ${decoded["family_name"]}`;
    return userName;
  }

  if (decoded.identities && decoded.identities[0]?.userId) {
    userName = decoded?.identities[0].userId;
    return userName;
  }

  return userName;
};

export const getUserCredentialsFromJwt = (event: APIGatewayProxyEvent) => {
  if (!event?.headers || !event.headers?.["x-api-key"])
    return new UserCredentials();
  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
  const credentials = new UserCredentials(decoded);
  return credentials;
};
