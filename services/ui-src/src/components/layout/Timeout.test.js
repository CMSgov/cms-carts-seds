import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { screen, render, fireEvent } from "@testing-library/react";
import Timeout from "./Timeout";
import moment from "moment";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    showTimeout: true,
    expiresAt: moment().add(5, "minutes"),
  },
});
const expiredStore = mockStore({
  stateUser: {
    showTimeout: true,
    expiresAt: moment().subtract(5, "minutes"),
  },
});
const hiddenStore = mockStore({
  stateUser: {
    showTimeout: false,
    expiresAt: moment().add(5, "minutes"),
  },
});
const timeout = (
  <Provider store={store}>
    <Timeout />
  </Provider>
);
const expiredTimeout = (
  <Provider store={expiredStore}>
    <Timeout />
  </Provider>
);
const hiddenTimeout = (
  <Provider store={hiddenStore}>
    <Timeout />
  </Provider>
);

const mockLogout = jest.fn();
const mockRefreshCredentials = jest.fn();
jest.mock("../../hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    logout: mockLogout,
  })),
  refreshCredentials: () => mockRefreshCredentials(),
}));

describe("Timeout Component", () => {
  it("should render correctly", () => {
    expect(shallow(timeout).exists()).toBe(true);
  });

  it("should contain a buttons for logging out and staying signed in", () => {
    render(timeout);

    expect(screen.getByTestId("timeout-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("timeout-stay-logged-in")).toBeInTheDocument();
    expect(screen.getByTestId("timeout-log-out")).toBeInTheDocument();
  });

  it("should attempt to log the user out when log out is clicked.", () => {
    render(timeout);

    fireEvent.click(screen.getByTestId("timeout-log-out"));
    expect(mockLogout).toBeCalled();
  });

  it("should not display when display is false", () => {
    render(hiddenTimeout);
    expect(screen.queryByTestId("timeout-dialog")).toBeNull();
  });

  it("should disable stay logged in when expired", () => {
    render(expiredTimeout);
    expect(screen.getByTestId("timeout-stay-logged-in")).toHaveAttribute(
      "disabled"
    );
  });

  it("should try to keep the user logged in when stay logged in is clicked", () => {
    render(timeout);

    fireEvent.click(screen.getByTestId("timeout-stay-logged-in"));
    expect(mockRefreshCredentials).toBeCalled();
  });
});
