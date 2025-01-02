import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Print from "./Print";
import { mockInitialState } from "../../util/testing/testUtils";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import thunk from "redux-thunk";

jest.mock("../layout/Section", () => () => {
  const MockName = "default-section";
  return <MockName data-testid="print-section" />;
});
jest.mock("../../actions/initial", () => ({
  loadSections: () => ({ type: "none" }),
  loadEnrollmentCounts: () => ({ type: "none" }),
}));

const mockStore = configureMockStore([thunk]);
const formState = {
  formData: [
    {
      pk: "AL-2020",
      sectionId: 0,
      year: 2020,
      contents: {
        section: {
          subsections: [{ type: "subsection", parts: [], id: "2020-00-a" }],
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
          subsections: [{ type: "subsection", parts: [], id: "2020-01-a" }],
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
          subsections: [{ type: "subsection", parts: [], id: "2020-02-a" }],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 3,
      year: 2020,
      contents: {
        section: {
          subsections: [
            { type: "subsection", parts: [], id: "2020-03-a" },
            { type: "subsection", parts: [], id: "2020-03-b" },
          ],
        },
      },
      stateId: "AL",
    },
  ],
};
const store = mockStore({ ...mockInitialState, ...formState });
const setup = (path) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[path]}>
      <Print />
    </MemoryRouter>
  </Provider>
);

describe("Print", () => {
  it("should render the Print Component correctly", () => {
    const path = "/print?year=2020&state=AL";
    const printComponent = setup(path);
    expect(shallow(printComponent).exists()).toBe(true);
  });

  it("should render for full form", () => {
    const path = "/print?year=2020&state=AL";
    render(setup(path));
    const sections = screen.getAllByTestId("print-section");
    expect(sections.length).toBe(5);
  });

  it("should render for a subsection when provided the subsection query param", () => {
    const path =
      "print?year=2020&state=AL&sectionId=2020-03&subsectionId=2020-03-b";
    render(setup(path));
    const sections = screen.getAllByTestId("print-section");
    expect(sections.length).toBe(1);
  });
});
