import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AppRoutes from "./AppRoutes";
import { mockInitialState } from "./util/testing/testUtils";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
const user = { id: "123" }; // just needs an obj
jest.mock("./hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    user: user,
    userRole: "STATE_USER",
    showLocalLogins: false,
    showTimeout: false,
    expiresAt: null,
  })),
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
}));
jest.mock("./components/layout/Home", () => () => {
  const MockName = "default-home";
  return <MockName />;
});
jest.mock("./components/utils/Spinner", () => () => {
  const MockName = "spin-to-win";
  return <MockName />;
});
jest.mock("./components/layout/Header", () => () => {
  const MockName = "default-header";
  return <MockName />;
});

describe("App Router", () => {
  it("should render correctly", () => {
    expect(shallow(<AppRoutes />).exists()).toBe(true);
  });
  it("should contain header and footer", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.containsMatchingElement(<Header currentUser={user} />)
    ).toEqual(true);
    expect(wrapper.containsMatchingElement(<Footer />)).toEqual(true);
  });
});
