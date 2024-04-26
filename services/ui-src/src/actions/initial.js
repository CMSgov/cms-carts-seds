/* eslint-disable no-underscore-dangle, no-console */
import requestOptions from "../hooks/authHooks/requestOptions";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";
import { apiLib } from "../util/apiLib";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const SET_STATE_STATUS = "SET_STATE_STATUS";
export const SET_STATE_STATUSES = "SET_STATE_STATUSES";
export const SET_ENROLLMENT_COUNTS = "SET_ENROLLMENT_COUNTS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";
export const LOAD_LASTYEAR_SECTIONS = "LOAD_LASTYEAR_SECTIONS";

export const getAllStatesData = () => {
  return async (dispatch) => {
    try {
      const opts = await requestOptions();
      const data = await apiLib.get(`/state`, opts);

      dispatch({ type: GET_ALL_STATES_DATA, data });
    } catch (err) {
      console.log("error:", err);
      console.dir(err);
    }
  };
};

export const getAllStateStatuses = () => async (dispatch) => {
  const opts = await requestOptions();
  const results = await apiLib.get(`/state_status`, opts);
  const data = results.Items;

  const payload = data
    .sort((a, b) => {
      const dateA = new Date(a.lastChanged);
      const dateB = new Date(b.lastChanged);

      if (dateA > dateB) {
        return 1;
      }
      if (dateA < dateB) {
        return -1;
      }
      return 0;
    })
    .filter(
      (status, index, original) =>
        original
          .slice(index + 1)
          .findIndex(
            (el) => el.stateId === status.stateId && el.year === status.year
          ) < 0
    )
    .reduce(
      (out, record) => ({
        ...out,
        [record.stateId + record.year]: {
          status: record.status,
          year: record.year,
          stateCode: record.stateId,
          lastChanged: record.lastChanged,
          username: record.username,
          programType: record.programType,
        },
      }),
      {}
    );
  dispatch({ type: SET_STATE_STATUSES, payload });
};

export const getStateAllStatuses =
  (selectedYears = [], selectedStates = [], selectedStatus = []) =>
  async (dispatch) => {
    const opts = await requestOptions();
    const results = await apiLib.get(`/state_status`, opts);
    const data = results.Items;
    let yearFilter = () => {};
    let stateFilter = () => {};
    let statusFilter = () => {};

    selectedYears.length > 0
      ? (yearFilter = (record) => selectedYears.includes(record.year))
      : (yearFilter = () => true);

    selectedStates.length > 0
      ? (stateFilter = (record) => selectedStates.includes(record.stateId))
      : (stateFilter = () => true);

    selectedStatus.length > 0
      ? (statusFilter = (record) => selectedStatus.includes(record.status))
      : (statusFilter = () => true);

    const payload = data
      .filter(yearFilter)
      .filter(stateFilter)
      .filter(statusFilter)
      .sort((a, b) => (a.year < b.year ? 1 : -1))
      .filter(
        (status, index, original) =>
          original
            .slice(index + 1)
            .findIndex(
              (el) => el.stateId === status.stateId && el.year === status.year
            ) < 0
      )
      .reduce(
        (out, record) => ({
          ...out,
          [record.stateId + record.year]: {
            status: record.status,
            year: record.year,
            stateCode: record.stateId,
            lastChanged: record.lastChanged,
            username: record.username,
            programType: record.programType,
          },
        }),
        {}
      );
    dispatch({ type: SET_STATE_STATUSES, payload });
  };

export const loadSections = ({ stateCode, selectedYear }) => {
  return async (dispatch) => {
    const opts = await requestOptions();
    const data = await apiLib.get(
      `/section/${selectedYear}/${stateCode}`,
      opts
    );

    const lastYear = parseInt(selectedYear) - 1;
    let lastYearData = undefined;
    const priorData = await apiLib
      .get(`/section/${lastYear}/${stateCode}`, opts)
      .catch((err) => {
        console.log("--- ERROR PRIOR YEAR SECTIONS ---");
        console.log(err);
        /*
         * Without the following too many things break, because the
         * entire app is too dependent on section data being present.
         */
        dispatch({ type: LOAD_SECTIONS, data, lastYearData });
        throw err;
      });
    if (data.length > 0) {
      lastYearData = priorData;
      dispatch({ type: LOAD_LASTYEAR_SECTIONS, data: priorData });
    }
    dispatch({ type: LOAD_SECTIONS, data, lastYearData });
  };
};

export const loadEnrollmentCounts = ({ stateCode, selectedYear }) => {
  return async (dispatch) => {
    const opts = await requestOptions();
    const data = await apiLib.get(
      `/enrollment_counts/${selectedYear}/${stateCode}`,
      opts
    );

    dispatch({ type: SET_ENROLLMENT_COUNTS, data });
  };
};

export const loadUser = (user) => async (dispatch) => {
  const { email, given_name, family_name, userRole, state } = user;
  const flattenedUser = {
    username: email,
    state: {
      id: state,
    },
    role: userRole,
    lastname: family_name,
    firstname: given_name,
    email: email,
  };
  await Promise.all([
    dispatch(getUserData(flattenedUser)),
    dispatch(getStateData(flattenedUser)),
    dispatch(getProgramData(user)),
    dispatch(getAllStatesData()),
    dispatch(getStateAllStatuses({ stateCode: state })),
  ]);
};

export const loadForm = (state) => async (dispatch, getState) => {
  const { stateUser } = getState();
  const stateCode = state ?? stateUser.currentUser.state.id;
  let selectedYear = window.location.pathname.split("/")[2];
  if (window.location.pathname.includes("views")) {
    selectedYear = window.location.pathname.split("/")[4];
  }

  // Start isFetching for spinner
  dispatch({ type: "CONTENT_FETCHING_STARTED" });

  try {
    await dispatch(loadSections({ stateCode, selectedYear }));
    await dispatch(loadEnrollmentCounts({ stateCode, selectedYear }));
  } finally {
    // End isFetching for spinner
    dispatch({ type: "CONTENT_FETCHING_FINISHED" });
  }
};

// Move this to where actions should go when we know where that is.
export const setAnswerEntry = (fragmentId, something) => {
  const value =
    something.target && something.target.value
      ? something.target.value
      : something;
  return {
    type: QUESTION_ANSWERED,
    fragmentId,
    data: value,
  };
};
