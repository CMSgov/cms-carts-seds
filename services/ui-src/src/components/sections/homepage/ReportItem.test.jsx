import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import ReportItem from "./ReportItem";
import { Provider } from "react-redux";
import {
  adminUserWithMultipleReports,
  approverUserWithMultipleReports,
  cmsUserWithMultipleReports,
  helpdeskUserWithMultipleReports,
  stateUserWithMultipleReports,
} from "../../../store/fakeStoreExamples";
import { axe } from "jest-axe";

const mockStore = configureMockStore();

/**
 *********************
 *State User (stateuser2@test.com)
 *********************
 */

// As of 2022-06-27, only State users can access the homepage view
const stateUser = mockStore(stateUserWithMultipleReports);
const HomepageStateUserInProgProps = {
  name: 2021,
  lastChanged: "2021-01-04 18:28:18.524133+00",
  link1URL: "/sections/2021/00",
  link1Text: "Edit",
  statusText: "In Progress",
  userRole: "STATE_USER",
  year: 2021,
  timeZone: "America/New_York",
};

const HomepageStateUserCertProps = {
  name: 2020,
  lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
  link1URL: "/sections/2020/00",
  link1Text: "View",
  statusText: "Certified and Submitted",
  userRole: "STATE_USER",
  year: 2020,
  timeZone: "America/New_York",
};

describe("ReportItem viewed by a State User", () => {
  const stateUserInProgWrapper = (
    <Provider store={stateUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...HomepageStateUserInProgProps} />
      </MemoryRouter>
    </Provider>
  );

  const stateUserCertWrapper = (
    <Provider store={stateUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...HomepageStateUserCertProps} />
      </MemoryRouter>
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(stateUserInProgWrapper).exists()).toBe(true);
  });

  it("should render report other statuses correctly", () => {
    expect(shallow(stateUserCertWrapper).exists()).toBe(true);
  });

  it("should render an In Progress report with passed props", () => {
    const report = mount(stateUserInProgWrapper);
    expect(report.find("div.name.ds-l-col--2").text()).toBe("2021");
    expect(report.find("div.status.ds-l-col--2").text()).toBe("In Progress");
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2021-01-04 at 1:28:18 p.m."
    );
    expect(report.find("div.actions.ds-l-col--1").find("a").text()).toBe(
      "Edit"
    );
    expect(report.find("div.actions.ds-l-col--1").find("a").prop("href")).toBe(
      "/sections/2021/00"
    );
  });

  it("should render other reports statuses and time staps properly", () => {
    const report = mount(stateUserCertWrapper);
    expect(report.find("div.name.ds-l-col--2").text()).toBe("2020");
    expect(report.find("div.status.ds-l-col--2").text()).toBe(
      "Certified and Submitted"
    );
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2022-06-27 at 2:43:08 p.m."
    );
    expect(report.find("div.actions.ds-l-col--1").find("a").text()).toBe(
      "View"
    );
    expect(report.find("div.actions.ds-l-col--1").find("a").prop("href")).toBe(
      "/sections/2020/00"
    );
  });

  test("In Progress report items should not have basic accessibility issues", async () => {
    const { container } = render(stateUserInProgWrapper);
    const stateInProgResults = await axe(container);
    expect(stateInProgResults).toHaveNoViolations();
  });

  test("Certified report items  should not have basic accessibility issues", async () => {
    const { container } = render(stateUserCertWrapper);
    const stateCertResults = await axe(container);
    expect(stateCertResults).toHaveNoViolations();
  });
});

/**
 *********************
 *CMS User (cms.user@test.com)
 *********************
 */

const cmsUser = mockStore(cmsUserWithMultipleReports);
const CMSHomepageCMSUserAl2020Props = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "Certified and Submitted",
  userRole: "CMS_USER",
  username: "Frank States",
  lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
  timeZone: "America/New_York",
};

const CMSHomepageCMSUserAL2021Props = {
  link1URL: "/views/sections/AL/2021/00/a",
  name: "Alabama",
  year: 2021,
  statusText: "In Progress",
  userRole: "CMS_USER",
  username: "al@test.com",
  lastChanged: "2021-01-04 18:28:18.524133+00",
  timeZone: "America/New_York",
};

describe("ReportItem viewed by a CMS User", () => {
  const cmsUserInProgWrapper = (
    <Provider store={cmsUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageCMSUserAL2021Props} />
      </MemoryRouter>
    </Provider>
  );

  const cmsUserCertWrapper = (
    <Provider store={cmsUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageCMSUserAl2020Props} />
      </MemoryRouter>
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(cmsUserInProgWrapper).exists()).toBe(true);
  });

  it("should render report other statuses correctly", () => {
    expect(shallow(cmsUserCertWrapper).exists()).toBe(true);
  });

  it("should render an In Progress report with passed props", () => {
    const report = mount(cmsUserInProgWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2021");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe("In Progress");
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2021-01-04 at 1:28:18 p.m. by al@test.com"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2021/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).not.toContain(
      "Uncertify"
    );
  });

  it("should render other reports statuses and time staps properly", () => {
    const report = mount(cmsUserCertWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2020");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe(
      "Certified and Submitted"
    );
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2022-06-27 at 2:43:08 p.m. by Frank States"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2020/00/a");
    expect(
      report.find("div.actions.ds-l-col--auto").find("button").text()
    ).toBe("Uncertify");
  });

  it("should handle uncertify being clicked and show new modal", () => {
    render(cmsUserCertWrapper);
    const uncertifyButton = screen.getByTestId("uncertifyButton");
    fireEvent.click(uncertifyButton);
    const uncertifyModal = screen.getByTestId("uncertifyModal");
    expect(uncertifyModal).toHaveTextContent("Yes, Uncertify");
  });

  test("In Progress report items should not have basic accessibility issues", async () => {
    const { container } = render(cmsUserCertWrapper);
    const stateInProgResults = await axe(container);
    expect(stateInProgResults).toHaveNoViolations();
  });

  test("Certified report items  should not have basic accessibility issues", async () => {
    const { container } = render(cmsUserCertWrapper);
    const stateCertResults = await axe(container);
    expect(stateCertResults).toHaveNoViolations();
  });
});

/**
 *********************
 *Admin User (adminuser@test.com)
 *********************
 */

const adminUser = mockStore(adminUserWithMultipleReports);
const CMSHomepageAdminAl2020Props = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "Certified and Submitted",
  userRole: "CMS_ADMIN",
  username: "Frank States",
  lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
  timeZone: "America/New_York",
};

const CMSHomepageAdminAL2021Props = {
  link1URL: "/views/sections/AL/2021/00/a",
  name: "Alabama",
  year: 2021,
  statusText: "In Progress",
  userRole: "CMS_ADMIN",
  username: "al@test.com",
  lastChanged: "2021-01-04 18:28:18.524133+00",
  timeZone: "America/New_York",
};

describe("ReportItem viewed by an Admin User", () => {
  const adminUserInProgWrapper = (
    <Provider store={adminUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageAdminAL2021Props} />
      </MemoryRouter>
    </Provider>
  );

  const adminUserCertWrapper = (
    <Provider store={adminUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageAdminAl2020Props} />
      </MemoryRouter>
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(adminUserInProgWrapper).exists()).toBe(true);
  });

  it("should render report other statuses correctly", () => {
    expect(shallow(adminUserCertWrapper).exists()).toBe(true);
  });

  it("should render an In Progress report with passed props", () => {
    const report = mount(adminUserInProgWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2021");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe("In Progress");
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2021-01-04 at 1:28:18 p.m. by al@test.com"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2021/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).not.toContain(
      "Uncertify"
    );
  });

  it("should render other reports statuses and time staps properly", () => {
    const report = mount(adminUserCertWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2020");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe(
      "Certified and Submitted"
    );
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2022-06-27 at 2:43:08 p.m. by Frank States"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2020/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).toContain(
      "Uncertify"
    );
  });

  test("In Progress report items should not have basic accessibility issues", async () => {
    const { container } = render(adminUserInProgWrapper);
    const stateInProgResults = await axe(container);
    expect(stateInProgResults).toHaveNoViolations();
  });

  test("Certified report items  should not have basic accessibility issues", async () => {
    const { container } = render(adminUserCertWrapper);
    const stateCertResults = await axe(container);
    expect(stateCertResults).toHaveNoViolations();
  });
});

/**
 *********************
 *Help Desk User (help.desk@test.com)
 *********************
 */

const helpdeskUser = mockStore(helpdeskUserWithMultipleReports);
const CMSHomepageHelpdeskAl2020Props = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "Certified and Submitted",
  userRole: "HELP_DESK",
  username: "Frank States",
  lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
  timeZone: "America/New_York",
};

const CMSHomepageHelpdeskAL2021Props = {
  link1URL: "/views/sections/AL/2021/00/a",
  name: "Alabama",
  year: 2021,
  statusText: "In Progress",
  userRole: "HELP_DESK",
  username: "al@test.com",
  lastChanged: "2021-01-04 18:28:18.524133+00",
  timeZone: "America/New_York",
};

describe("ReportItem viewed by an Help Desk User", () => {
  const helpdeskUserInProgWrapper = (
    <Provider store={helpdeskUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageHelpdeskAL2021Props} />
      </MemoryRouter>
    </Provider>
  );

  const helpdeskUserCertWrapper = (
    <Provider store={helpdeskUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageHelpdeskAl2020Props} />
      </MemoryRouter>
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(helpdeskUserInProgWrapper).exists()).toBe(true);
  });

  it("should render report other statuses correctly", () => {
    expect(shallow(helpdeskUserCertWrapper).exists()).toBe(true);
  });

  it("should render an In Progress report with passed props", () => {
    const report = mount(helpdeskUserInProgWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2021");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe("In Progress");
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2021-01-04 at 1:28:18 p.m. by al@test.com"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2021/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).not.toContain(
      "Uncertify"
    );
  });

  it("should render other reports statuses and time staps properly", () => {
    const report = mount(helpdeskUserCertWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2020");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe(
      "Certified and Submitted"
    );
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2022-06-27 at 2:43:08 p.m. by Frank States"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2020/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).not.toContain(
      "Uncertify"
    );
  });

  test("In Progress report items should not have basic accessibility issues", async () => {
    const { container } = render(helpdeskUserInProgWrapper);
    const stateInProgResults = await axe(container);
    expect(stateInProgResults).toHaveNoViolations();
  });

  test("Certified report items  should not have basic accessibility issues", async () => {
    const { container } = render(helpdeskUserCertWrapper);
    const stateCertResults = await axe(container);
    expect(stateCertResults).toHaveNoViolations();
  });
});

/**
 *********************
 *Approver User (help.approver@test.com)
 *********************
 */

const approverUser = mockStore(approverUserWithMultipleReports);
const CMSHomepageApproverAl2020Props = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "Certified and Submitted",
  userRole: "CMS_APPROVER",
  username: "Frank States",
  lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
  timeZone: "America/New_York",
};

const CMSHomepageApproverAL2021Props = {
  link1URL: "/views/sections/AL/2021/00/a",
  name: "Alabama",
  year: 2021,
  statusText: "In Progress",
  userRole: "CMS_APPROVER",
  username: "al@test.com",
  lastChanged: "2021-01-04 18:28:18.524133+00",
  timeZone: "America/New_York",
};

describe("ReportItem viewed by an Admin User", () => {
  const approverUserInProgWrapper = (
    <Provider store={approverUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageApproverAL2021Props} />
      </MemoryRouter>
    </Provider>
  );

  const approverUserCertWrapper = (
    <Provider store={approverUser}>
      <MemoryRouter initialEntries={["/"]}>
        <ReportItem {...CMSHomepageApproverAl2020Props} />
      </MemoryRouter>
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(approverUserInProgWrapper).exists()).toBe(true);
  });

  it("should render report other statuses correctly", () => {
    expect(shallow(approverUserCertWrapper).exists()).toBe(true);
  });

  it("should render an In Progress report with passed props", () => {
    const report = mount(approverUserInProgWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2021");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe("In Progress");
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2021-01-04 at 1:28:18 p.m. by al@test.com"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2021/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).not.toContain(
      "Uncertify"
    );
  });

  it("should render other reports statuses and time staps properly", () => {
    const report = mount(approverUserCertWrapper);
    expect(report.find("div.name.ds-l-col--1").text()).toBe("2020");
    expect(report.find("div.name.ds-l-col--2").text()).toBe("Alabama");
    expect(report.find("div.status.ds-l-col--2").text()).toBe(
      "Certified and Submitted"
    );
    expect(report.find("div.actions.ds-l-col--3").text()).toBe(
      "2022-06-27 at 2:43:08 p.m. by Frank States"
    );
    expect(report.find("div.actions.ds-l-col--auto").find("a").text()).toBe(
      "View"
    );
    expect(
      report.find("div.actions.ds-l-col--auto").find("a").prop("href")
    ).toBe("/views/sections/AL/2020/00/a");
    expect(report.find("div.actions.ds-l-col--auto").text()).toContain(
      "Uncertify"
    );
  });

  test("In Progress report items should not have basic accessibility issues", async () => {
    const { container } = render(approverUserCertWrapper);
    const stateInProgResults = await axe(container);
    expect(stateInProgResults).toHaveNoViolations();
  });

  test("Certified report items  should not have basic accessibility issues", async () => {
    const { container } = render(approverUserCertWrapper);
    const stateCertResults = await axe(container);
    expect(stateCertResults).toHaveNoViolations();
  });
});
