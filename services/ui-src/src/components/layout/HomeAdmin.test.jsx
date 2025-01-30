import React from "react";
import { mount, shallow } from "enzyme";
import Home from "./Home";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import InvokeSection from "../utils/InvokeSection";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import HomeAdmin from "./HomeAdmin";

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

window.scrollTo = jest.fn();

describe("Home Admin Component", () => {
  it("should render correctly", () => {
    expect(shallow(<Home />).exists()).toBe(true);
  });
  it.each([
    ["/views/sections/pa/2022/3/2", <InvokeSection />],
    ["/views/sections/pa/2022/3", <InvokeSection />],
    ["/", <CMSHomepage />],
  ])(
    "should attempt to load the appropriate components for the path %s",
    (route, component) => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <HomeAdmin />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.containsMatchingElement(component)).toEqual(true);
    }
  );
});
