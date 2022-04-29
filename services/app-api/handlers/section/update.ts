import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles, StateStatus } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

/**
 * Updates the Sections associated with a given year and state
 */
export const updateSections = handler(async (event, _context) => {
  const { body } = event;
  const reportData = JSON.parse(body || "{}");

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error(
      "Be sure to include state, year in the path" + event.pathParameters
    );
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // only state users can update reports associated with their assigned state
  if (user.role === UserRoles.STATE && user.state === state) {
    // Update each of the Sections for the report associated with the given year and state
    for (let section = 0; section < reportData.length; section++) {
      const params = {
        TableName: process.env.sectionTableName!,
        Key: {
          pk: `${state}-${year}`,
          sectionId: section,
        },
        ...convertToDynamoExpression(
          {
            contents: reportData[section].contents,
          },
          "post"
        ),
      };

      await dynamoDb.update(params);
    }

    const params = {
      TableName: process.env.stateStatusTableName!,
      KeyConditionExpression:
        "stateId = :stateId AND #currentYear = :currentYear",
      ExpressionAttributeValues: {
        ":stateId": state,
        ":currentYear": parseInt(year),
      },
      ExpressionAttributeNames: {
        "#currentYear": "year",
      },
    };

    const queryValue = await dynamoDb.query(params);
    const stateStatus = queryValue.Items![0] as StateStatus;

    if (queryValue.Items && stateStatus.status === "not_started") {
      const params = {
        TableName: process.env.stateStatusTableName!,
        Key: {
          stateId: state,
          year: parseInt(year),
        },
        ...convertToDynamoExpression(
          {
            status: "in_progress",
            lastChanged: new Date().toString(),
          },
          "post"
        ),
      };

      await dynamoDb.update(params);
    }
  }
});
