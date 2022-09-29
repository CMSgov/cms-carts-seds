import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import s3 from "../../libs/s3-lib";
import { NotFoundError } from "../../libs/httpErrors";

/**
 * Returns the report Sections associated with a given year and state
 */
export const getSignedFileUrl = handler(async (event, _context) => {
  const state = event.pathParameters ? event.pathParameters["state"] : "";
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.fileId) {
    throw new NotFoundError("Unable to find info");
  }

  // Get file, check aws filename before deleting
  const documentParams = {
    TableName: process.env.uploadsTableName!,
    KeyConditionExpression:
      "uploadedState = :uploadedState AND fileId = :fileId",
    ExpressionAttributeValues: {
      ":uploadedState": state,
      ":fileId": body.fileId,
    },
  };
  const results = await dynamoDb.query(documentParams);
  if (!results.Items || results.Items.length === 0) {
    throw new NotFoundError("No such item exists");
  }
  const document = results.Items[0];
  // Pre-sign url
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.uploadS3BucketName ?? "local-uploads",
    Key: document.awsFilename,
    ResponseContentDisposition: `attachment; filename = ${document.filename}`,
    Expires: 3600,
  });
  return {
    psurl: url,
  };
});
