import React from "react";
import Autosave from "./Autosave";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { mount, shallow } from "enzyme";
import SaveMessage from "./SaveMessage";

const mockStore = configureMockStore();
const lastSaved = "01/01/2002";
const store = mockStore({
  save: {
    error: false,
    saving: false,
    lastSave: lastSaved,
  },
});
const savingStore = mockStore({
  save: {
    error: false,
    saving: true,
    lastSave: lastSaved,
  },
});

const autoSave = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <Autosave />
    </MemoryRouter>
  </Provider>
);
const autoSaveSaving = (
  <Provider store={savingStore}>
    <Autosave />
  </Provider>
);

describe("AutoSave Component", () => {
  it("should render correctly", () => {
    expect(shallow(autoSave).exists()).toBe(true);
  });
  it("should display saving when waiting", () => {
    const wrapper = mount(autoSaveSaving);
    expect(wrapper.text().includes("Saving")).toBe(true);
    expect(
      wrapper.containsMatchingElement(<SaveMessage lastSaved={lastSaved} />)
    ).toBe(false);
  });
  it("should display save message when saved", () => {
    const wrapper = mount(autoSave);
    expect(
      wrapper.containsMatchingElement(<SaveMessage lastSaved={lastSaved} />)
    ).toBe(true);
    expect(wrapper.text().includes("Saving")).toBe(false);
  });
});
