import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars

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
