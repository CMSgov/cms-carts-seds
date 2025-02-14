import React from "react";
import { shallow } from "enzyme";
import { act, render, fireEvent } from "@testing-library/react";
import { LocalLogins } from "./LocalLogins";

const localLogins = <LocalLogins />;
const mockLoginUser = jest.fn();
jest.mock("../../../util/apiLib", () => ({
  loginUser: (username, password) => mockLoginUser(username, password),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("LocalLogin component", () => {
  it("should render successfully", () => {
    expect(shallow(localLogins).exists()).toBe(true);
  });

  it("should attempt to login and nav the user on click", async () => {
    const { getByTestId } = render(localLogins);
    const generateButton = getByTestId("login-button");
    const emailField = getByTestId("login-email");
    const passwordField = getByTestId("login-password");

    await act(async () => {
      fireEvent.change(emailField, { target: { value: "myEmail@email.com" } });
    });
    await act(async () => {
      fireEvent.change(passwordField, { target: { value: "test" } });
    });
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(mockLoginUser).toHaveBeenCalledWith("myEmail@email.com", "test");
  });
});
