import React from "react";
import { shallow } from "enzyme";
import FormNavigation from "./FormNavigation";
import { stateUserWithReportInProgress } from "../../store/fakeStoreExamples";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";

const mockStore = configureMockStore();
const stateStore = mockStore(stateUserWithReportInProgress);
const middleLocation = "/sections/2020/01";
const firstLocation = "/sections/2020/00";

const stateNavComponent = (
  <Provider store={stateStore}>
    <MemoryRouter initialEntries={[firstLocation]}>
      <FormNavigation />;
    </MemoryRouter>
  </Provider>
);
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
              type: "subsection",
              parts: [],
              id: "2020-02-a",
              title: "my title",
            },
          ],
        },
      },
      stateId: "AL",
    },
  ],
};
const completeStore = mockStore({
  ...stateUserWithReportInProgress,
  ...formState,
});
const completeNavState = (
  <Provider store={completeStore}>
    <MemoryRouter initialEntries={[middleLocation]}>
      <FormNavigation />;
    </MemoryRouter>
  </Provider>
);

const adminStore = mockStore(stateUserWithReportInProgress);
const adminNavComponent = (
  <Provider store={adminStore}>
    <MemoryRouter initialEntries={["/"]}>
      <FormNavigation />;
    </MemoryRouter>
  </Provider>
);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => ({
    push: jest.fn(),
  }),
}));

const setLocation = (path = "/") => {
  delete window.location;
  window.location = new URL("https://www.example.com" + path);
};

describe("Form Navigation component", () => {
  beforeEach(() => {
    setLocation();
  });

  it("should render the Form Nav Component correctly", () => {
    expect(shallow(stateNavComponent).exists()).toBe(true);
    expect(shallow(adminNavComponent).exists()).toBe(true);
  });

  it("should not render previous when it doesn't exist", () => {
    setLocation(firstLocation);
    render(stateNavComponent); // state only has 1 entry
    const nextButton = screen.queryByTestId("next");
    const previousButton = screen.queryByTestId("previous");
    expect(nextButton).not.toBeNull();
    expect(previousButton).toBeNull();
  });

  it("should render next or previous when they exist", () => {
    setLocation(middleLocation); // 2020 section 1
    render(completeNavState); // state has 3 entries and is targetting the second
    const nextButton = screen.queryByTestId("next");
    const previousButton = screen.queryByTestId("previous");
    expect(nextButton).not.toBeNull();
    expect(previousButton).not.toBeNull();
  });
});
