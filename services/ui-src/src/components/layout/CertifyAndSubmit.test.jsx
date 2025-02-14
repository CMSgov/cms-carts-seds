import React from "react";
import { Provider } from "react-redux";
import { shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import CertifyAndSubmit from "./CertifyAndSubmit";
import { screen, render } from "@testing-library/react";
import { AppRoles } from "../../types";

jest.mock("../../actions/initial", () => ({
  loadForm: () => ({ type: "none" }),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const mockStore = configureMockStore();
const store = mockStore({
  save: { lastSave: new Date() },
  reportStatus: {
    status: "in_progress",
    KY2011: {
      status: "in_progress",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
  stateUser: {
    abbr: "KY",
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 2011,
  },
});
const submittedStore = mockStore({
  save: { lastSave: new Date() },
  reportStatus: {
    status: "certified",
    KY2011: {
      status: "certified",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
  stateUser: {
    abbr: "KY",
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 2011,
  },
});

const submit = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <CertifyAndSubmit />
    </MemoryRouter>
  </Provider>
);
const submitFinished = (
  <Provider store={submittedStore}>
    <CertifyAndSubmit />
  </Provider>
);

describe("CertifyAndSubmit Component", () => {
  it("renders without crashing", () => {
    expect(shallow(submitFinished).exists()).toBe(true);
  });

  it("should display submit button", () => {
    render(submit);
    const thankYouElement = screen.getByTestId("certifySubmit");
    expect(thankYouElement).toHaveTextContent("Certify and Submit");
  });
  it("should display thanks after submit", () => {
    render(submitFinished);
    const thankYouElement = screen.getByTestId("certifyThankYou");
    expect(thankYouElement).toHaveTextContent("Thank you");
  });
});
