import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import Autosave from "./Autosave";
import { MemoryRouter } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import {
  adminUserWithReportInProgress,
  stateUserNoUsername,
  stateUserSimple,
  stateUserWithReportCertified,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const mockStore = configureMockStore();
const store = mockStore(stateUserSimple);

const noUserNameStore = mockStore(stateUserNoUsername);

const stateUserWithReportInProgressStore = mockStore(
  stateUserWithReportInProgress
);

const stateUserWithReportCertifiedStore = mockStore(
  stateUserWithReportCertified
);

const adminUserWithReportStore = mockStore(adminUserWithReportInProgress);

const header = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerWithNoUsername = (
  <Provider store={noUserNameStore}>
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsStateUserThatsInProgress = (
  <Provider store={stateUserWithReportInProgressStore}>
    <MemoryRouter initialEntries={["/sections/2021/00"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsStateUserThatsCertified = (
  <Provider store={stateUserWithReportCertifiedStore}>
    <MemoryRouter initialEntries={["/sections/2021/00"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsAdminUser = (
  <Provider store={adminUserWithReportStore}>
    <MemoryRouter initialEntries={["views/sections/AL/2021/00/a"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

describe("Test Header", () => {
  it("should render the Header Component correctly", () => {
    expect(shallow(header).exists()).toBe(true);
  });
  it("should have a usaBanner as a child component", () => {
    const wrapper = mount(header);
    expect(wrapper.find({ "data-testid": "usaBanner" }).length).toBe(1);
  });
  it("should not show the autosave component by default ", () => {
    const wrapper = mount(header);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should not show the autosave when user is an admin", () => {
    const wrapper = mount(headerOnReportPageAsAdminUser);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should not show the autosave when user is an state user on a report thats certified", () => {
    const wrapper = mount(headerOnReportPageAsStateUserThatsCertified);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should show autosave component only when user is a state user, is on a report page, and status is in progress", () => {
    const wrapper = mount(headerOnReportPageAsStateUserThatsInProgress);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(true);
  });
  it("should render the dropdownmenu if user is logged in", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    expect(headerDropDownMenuButton).toHaveTextContent("My Account");
  });
  it("should not render the dropdownmenu if user is not logged in", () => {
    const wrapper = mount(headerWithNoUsername);
    expect(
      wrapper.containsMatchingElement(
        <div
          className="nav-user"
          id="nav-user"
          data-testid="headerDropDownMenu"
        />
      )
    ).toEqual(false);
  });
  it("should render the dropdownmenu in a closed initial state with a chevron pointed down", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    const chevDown = screen.getByTestId("headerDropDownChevDown");
    expect(headerDropDownMenuButton).toContainElement(chevDown);
  });

  it("should render the dropdownmenu on click with a chevron pointed up and items underneath", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    fireEvent.click(headerDropDownMenuButton);
    const chevUp = screen.getByTestId("headerDropDownChevUp");
    const headerDropDownMenu = screen.getByTestId("headerDropDownMenu");
    const headerDropDownLinks = screen.getByTestId("headerDropDownLinks");
    expect(headerDropDownMenuButton).toContainElement(chevUp);
    expect(headerDropDownMenu).toContainElement(headerDropDownLinks);
  });

  it("should open and close the dropdown menu on click", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    fireEvent.click(headerDropDownMenuButton);
    const chevUp = screen.getByTestId("headerDropDownChevUp");
    expect(headerDropDownMenuButton).toContainElement(chevUp);
    fireEvent.click(headerDropDownMenuButton);
    const chevDown = screen.getByTestId("headerDropDownChevDown");
    expect(headerDropDownMenuButton).toContainElement(chevDown);
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(header);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
