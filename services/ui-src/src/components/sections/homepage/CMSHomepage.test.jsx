import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
// components
import CMSHomepage from "./CMSHomepage";
// mocks
import { helpdeskUserWithMultipleReports } from "../../../store/fakeStoreExamples";

const mockStore = configureMockStore([thunk]);
const adminUser = mockStore(helpdeskUserWithMultipleReports);

jest.mock("../../../actions/initial", () => ({
  getAllStateStatuses: jest.fn().mockReturnValue(() => async () => {}),
}));

const CmsHomepageComponent = (
  <Provider store={adminUser}>
    <MemoryRouter path={[]}>
      <CMSHomepage></CMSHomepage>
    </MemoryRouter>
  </Provider>
);

describe("test CMSHomepage", () => {
  it("should render", () => {
    render(CmsHomepageComponent);
    expect(screen.queryAllByText("Alabama").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Alaska").length).toBeGreaterThan(0);
    expect(
      screen.queryAllByText("Certified and Submitted").length
    ).toBeGreaterThan(0);
  });

  it("can be filtered by state", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.queryAllByText("Alabama").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Alaska").length).toBeGreaterThan(0);
    expect(screen.queryByText("California")).not.toBeInTheDocument();

    const stateFilterDropdown = screen.getByText("State", {
      selector: "span",
    });
    await user.click(stateFilterDropdown);
    const alabamaDropdownOption = screen.queryByText("Alabama", {
      selector: "span",
    });
    await user.click(alabamaDropdownOption);
    await user.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.queryAllByText("Alabama").length).toBeGreaterThan(0);
    expect(screen.queryByText("Alaska")).not.toBeInTheDocument();
  });

  it("can be filtered by year", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.queryAllByText("2021").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("2020").length).toBeGreaterThan(0);

    const yearFilterDropdown = screen.getByText("Year", {
      selector: "span",
    });
    await user.click(yearFilterDropdown);
    const year2021DropdownOption = screen.queryByText("2021", {
      selector: "span",
    });
    await user.click(year2021DropdownOption);
    await user.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.queryAllByText("2021").length).toBeGreaterThan(0);
    expect(screen.queryByText("2020")).not.toBeInTheDocument();
  });

  it("can be filtered by status", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.queryByText("Not Started")).not.toBeInTheDocument();
    expect(screen.queryAllByText("In Progress").length).toBeGreaterThan(0);

    const yearFilterDropdown = screen.getByText("Status", {
      selector: "span",
    });
    await user.click(yearFilterDropdown);
    await user.click(screen.queryByText("Not Started"));
    await user.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
  });

  it("can clear filters", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.queryByText("Not Started")).not.toBeInTheDocument();
    expect(screen.queryAllByText("In Progress").length).toBeGreaterThan(0);

    const yearFilterDropdown = screen.getByText("Status", {
      selector: "span",
    });
    await user.click(yearFilterDropdown);
    await user.click(screen.queryByText("Not Started"));
    await user.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.queryByText("In Progress")).not.toBeInTheDocument();

    await user.click(screen.getByText("Clear", { selector: "button" }));

    expect(screen.queryByText("Not Started")).not.toBeInTheDocument();
    expect(screen.queryAllByText("In Progress").length).toBeGreaterThan(0);
  });
});
