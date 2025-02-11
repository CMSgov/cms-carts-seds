import React from "react";
import { Provider } from "react-redux";
import TableOfContents from "./TableOfContents";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import {
  adminUserWithReportInProgress,
  stateUserSimple,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureMockStore();
const formState = {
  formData: [
    {
      pk: "AL-2020",
      sectionId: 0,
      year: 2020,
      contents: {
        section: {
          id: "2020-00",
          ordinal: 0,
          title: "my section",
          subsections: [
            {
              type: "subsection",
              parts: [],
              id: "2020-00-a",
              title: "my title",
            },
          ],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 1,
      year: 2020,
      contents: {
        section: {
          id: "2020-01",
          ordinal: 1,
          title: "my section",
          subsections: [
            {
              type: "subsection",
              parts: [],
              id: "2020-01-a",
              title: "my title",
            },
          ],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 2,
      year: 2020,
      contents: {
        section: {
          id: "2020-02",
          ordinal: 2,
          title: "my section",
          subsections: [
            {
              type: "subsectionA",
              parts: [],
              id: "2020-02-a",
              title: "my title",
            },
            {
              type: "subsectionB",
              parts: [],
              id: "2020-02-b",
              title: "b title",
            },
            {
              type: "subsectionC",
              parts: [],
              id: "2020-02-c",
              title: "c title",
            },
          ],
        },
      },
      stateId: "AL",
    },
  ],
};
const store = mockStore({
  ...stateUserWithReportInProgress,
  ...formState,
});
const memoryRouterRef = React.createRef();
const tableOfContents = (
  <Provider store={store}>
    <MemoryRouter ref={memoryRouterRef}>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const adminStore = mockStore({
  ...adminUserWithReportInProgress,
  ...formState,
});
const adminToc = (
  <Provider store={adminStore}>
    <MemoryRouter initialEntries={["/views/sections/00"]}>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const noFormsStore = mockStore(stateUserSimple);
const noFormsToC = (
  <Provider store={noFormsStore}>
    <MemoryRouter>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const setLocation = (path = "/") => {
  delete window.location;
  window.location = new URL("https://www.example.com" + path);
};

describe("State Header Component", () => {
  beforeEach(() => {
    setLocation();
  });
  it("should render correctly", () => {
    expect(shallow(tableOfContents).exists()).toBe(true);
  });

  it("should render cmsgov vertical nav and pass sections and certify and submit", async () => {
    render(tableOfContents);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).toMatch(/Section 1/);
    expect(toc.outerHTML).toMatch(/Section 2/);
    expect(toc.outerHTML).toMatch(/Certify and Submit/);
  });

  it("should not include certify and submit when a non state user views the ToC", async () => {
    render(adminToc);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).toMatch(/Section 1/);
    expect(toc.outerHTML).toMatch(/Section 2/);
    expect(toc.outerHTML).not.toMatch(/Certify and Submit/);
  });
  it("should handle an active path with /views/sections", async () => {
    setLocation("/views/sections/");
    render(adminToc);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).toMatch(/Section 1/);
    expect(toc.outerHTML).toMatch(/Section 2/);
    expect(toc.outerHTML).not.toMatch(/Certify and Submit/);
  });
  it("should not crash without any form data", async () => {
    setLocation("/views/sections/");
    render(noFormsToC);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).not.toMatch(/Section 1/);
    expect(toc.outerHTML).not.toMatch(/Section 2/);
    expect(toc.outerHTML).not.toMatch(/Certify and Submit/);
  });
  it("should navigate on click", async () => {
    render(tableOfContents);
    const aSection = screen.getByText(/Section 1/);
    fireEvent.click(aSection);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/sections/2020/01");
  });
});
