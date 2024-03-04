import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";
import { fetch } from "cross-fetch";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("cross-fetch", () => ({
  fetch: jest.fn().mockResolvedValue({
    status: 200,
    headers: {
      get: jest.fn().mockResolvedValue("3"),
    },
    arrayBuffer: jest.fn().mockResolvedValue(
      // An ArrayBuffer containing `%PDF-1.7`
      new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]).buffer
    ),
  }),
}));

const dangerousHtml = "<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>";
const sanitizedHtml = "<p>abc</p>";
const base64EncodedDangerousHtml =
  Buffer.from(dangerousHtml).toString("base64");

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.docraptorApiKey = "mock api key"; // pragma: allowlist secret
  });

  it("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedDangerousHtml}"}`,
    };

    const res = await print(event, null);

    expect(fetch).toHaveBeenCalled();
    const [url, request] = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(request.body);
    expect(url).toBe("https://docraptor.com/docs");
    expect(request).toEqual({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: expect.stringMatching(/^\{.*\}$/),
    });
    expect(body).toEqual({
      user_credentials: "mock api key", // pragma: allowlist secret
      doc: expect.objectContaining({
        document_content: sanitizedHtml,
        type: "pdf",
        tag: "CARTS",
        prince_options: expect.objectContaining({
          profile: "PDF/UA-1",
        }),
      }),
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      // The string `%PDF-1.7`, base64-encoded
      data: "JVBERi0xLjc=",
    });
  });

  it("should throw an error if event body is empty", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  it("should throw an error if API key is missing", async () => {
    delete process.env.docraptorApiKey;
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedDangerousHtml}"}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  it("should handle errors from PDF API", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedDangerousHtml}"}`,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      text: jest.fn().mockResolvedValue("<error>It broke.</error>"),
    });

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    // eslint-disable-next-line no-console
    expect(console.warn).toBeCalledWith(
      expect.any(Date),
      expect.stringContaining("It broke.")
    );
  });
});
