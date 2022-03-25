//  @ts-nocheck

const configToExport = {
  BRANCH_NAME: window.env.BRANCH_NAME,
  MAX_ATTACHMENT_SIZE: 5000000,
  LOCAL_LOGIN: window.env.LOCAL_LOGIN,
  IS_FEATURE_BRANCH: window.env.IS_FEATURE_BRANCH,
  s3: {
    LOCAL_ENDPOINT: window.env.S3_LOCAL_ENDPOINT,
    REGION: window.env.S3_ATTACHMENTS_BUCKET_REGION,
    BUCKET: window.env.S3_ATTACHMENTS_BUCKET_NAME,
  },
  apiGateway: {
    REGION: window.env.API_REGION,
    URL: window.env.API_URL,
  },
  cognito: {
    REGION: window.env.COGNITO_REGION,
    USER_POOL_ID: window.env.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window.env.COGNITO_USER_POOL_CLIENT_ID,
    APP_CLIENT_DOMAIN: window.env.COGNITO_USER_POOL_CLIENT_DOMAIN,
    IDENTITY_POOL_ID: window.env.COGNITO_IDENTITY_POOL_ID,
    REDIRECT_SIGNIN: window.env.COGNITO_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: window.env.COGNITO_REDIRECT_SIGNOUT,
  },
  currentReportingYear: "2021",
};

export default configToExport;
