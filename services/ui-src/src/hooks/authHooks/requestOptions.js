import { fetchAuthSession } from "aws-amplify/auth";

async function requestOptions(body = null) {
  try {
    const apiKey = (await fetchAuthSession()).tokens?.idToken?.toString();
    if (apiKey === undefined) {
      throw new Error("Missing API Key from auth session.");
    }
    const options = {
      // headers: { "x-api-key": apiKey },
    };
    if (body) {
      options["body"] = body;
    }
    return options;
  } catch (e) {
    console.log({ e }); // eslint-disable-line no-console
  }
}

export default requestOptions;
