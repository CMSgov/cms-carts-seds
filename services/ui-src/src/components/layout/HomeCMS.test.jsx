import React from "react";
import { mount, shallow } from "enzyme";
import Home from "./Home";
import Unauthorized from "./Unauthorized";
import CMSHome from "./HomeCMS";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import InvokeSection from "../utils/InvokeSection";
import CMSHomepage from "../sections/homepage/CMSHomepage";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/CMSHomepage", () => () => {
  const MockName = "default-cms-home";
  return <MockName />;
});
jest.mock("../utils/InvokeSection", () => () => {
  const MockName = "default-invoke";
  return <MockName />;
});

describe("Home CMS Component", () => {
  it("should render correctly", () => {
    expect(shallow(<Home />).exists()).toBe(true);
  });
  it.each([
    "/role_user_assoc",
    "/state_assoc",
    "/role_jobcode_assoc",
    "/users",
  ])("Home CMS should display Unauthorized for the route %s", (route) => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <CMSHome />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.containsMatchingElement(<Unauthorized />)).toEqual(true);
  });
  it.each([
    ["/views/sections/pa/2022/3/2", <InvokeSection />],
    ["/views/sections/pa/2022/3", <InvokeSection />],
    ["/", <CMSHomepage />],
  ])(
    "Home CMS should attempt to load the appropriate section for the path %s",
    (route, component) => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <CMSHome />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.containsMatchingElement(component)).toEqual(true);
    }
  );
});
