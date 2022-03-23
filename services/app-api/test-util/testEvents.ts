import { APIGatewayProxyEvent } from "aws-lambda";
import { CoreSetAbbr, Measure, MeasureStatus } from "../types";

export const testEvent: APIGatewayProxyEvent = {
  body: "{}",
  headers: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  path: "",
  pathParameters: {},
  resource: "",
  stageVariables: null,
  queryStringParameters: {},
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: () => {},
    httpMethod: "",
    path: "",
    protocol: "",
    requestId: "",
    requestTimeEpoch: 0,
    resourceId: "",
    resourcePath: "",
    stage: "",
    connectedAt: 0,
    connectionId: "",
    domainName: "",
    domainPrefix: "",
    eventType: "",
    extendedRequestId: "",
    messageDirection: "",
    messageId: "",
    requestTime: "",
    routeKey: "",
    identity: {
      accessKey: "",
      accountId: "",
      apiKey: "",
      apiKeyId: "",
      caller: "",
      cognitoAuthenticationProvider: "",
      cognitoAuthenticationType: "",
      cognitoIdentityId: "",
      cognitoIdentityPoolId: "",
      principalOrgId: "",
      sourceIp: "",
      user: "",
      userAgent: "",
      userArn: "",
      clientCert: {
        clientCertPem: "",
        issuerDN: "",
        serialNumber: "",
        subjectDN: "",
        validity: { notAfter: "", notBefore: "" },
      },
    },
  },
};

export const testMeasure: Measure = {
  compoundKey: "",
  coreSet: CoreSetAbbr.ACS,
  createdAt: 0,
  description: "",
  lastAltered: 0,
  measure: "",
  state: "",
  status: MeasureStatus.INCOMPLETE,
  year: 2019,
  lastAlteredBy: "",
};
