import React from "react";
import { mount, shallow } from "enzyme";
import Home from "./Home";
import Unauthorized from "./Unauthorized";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import InvokeSection from "../utils/InvokeSection";
import StateHome from "./HomeState";
import CertifyAndSubmit from "./CertifyAndSubmit";
import Homepage from "../sections/homepage/Homepage";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/Homepage", () => () => {
  const MockName = "default-cms-home";
  return <MockName />;
});
jest.mock("./CertifyAndSubmit", () => () => {
  const MockName = "default-cert";
  return <MockName />;
});
jest.mock("../utils/InvokeSection", () => () => {
  const MockName = "default-invoke";
  return <MockName />;
});

window.scrollTo = jest.fn();

describe("Home State Component", () => {
  it("should render correctly", () => {
    expect(shallow(<Home />).exists()).toBe(true);
  });
  it.each([
    "/role_user_assoc",
    "/state_assoc",
    "/role_jobcode_assoc",
    "/users",
  ])("should display Unauthorized for the route %s", (route) => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <StateHome />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.containsMatchingElement(Unauthorized)).toEqual(true);
  });
  it.each([
    ["/sections/2022/3/2", <InvokeSection />],
    ["/sections/2022/3", <InvokeSection />],
    ["/sections/2022/certify-and-submit", <CertifyAndSubmit />],
    ["/", <Homepage />],
  ])(
    "Home CMS should attempt to load the appropriate components for the path %s",
    (route, component) => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <StateHome />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.containsMatchingElement(component)).toEqual(true);
    }
  );
});
