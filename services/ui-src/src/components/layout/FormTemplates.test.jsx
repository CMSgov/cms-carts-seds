import React from "react";
import { shallow } from "enzyme";
import FormTemplates from "./FormTemplates";
import { act, render, fireEvent } from "@testing-library/react";
import { apiLib } from "../../util/apiLib";

jest.mock("../../hooks/authHooks");
window.alert = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const formTemplate = <FormTemplates />;
describe("FormTemplates Component", () => {
  beforeEach(() => {
    window.alert.mockClear();
  });

  it("should render correctly", () => {
    expect(shallow(formTemplate).exists()).toBe(true);
  });

  it("fires the generate forms event on button click, then navigates", async () => {
    const apiSpy = jest.spyOn(apiLib, "post");
    const { getByTestId } = render(formTemplate);
    const generateButton = getByTestId("generate-forms-button");
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(apiSpy).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });
});
