import jsonpath from "../util/jsonpath";

import { selectFragment } from "./formData"; // eslint-disable-line
import { shouldDisplay } from "../util/shouldDisplay";
import statesArray from "../components/Utils/statesArray";
import { UserRoles } from "../types";

export const selectById = (state, id) => {
  const jspath = `$..formData[*].contents..*[?(@.id==='${id}')]`;
  const item = jsonpath.query(state, jspath);

  if (item.length) {
    return item[0];
  }
  return null;
};

export const selectSectionTitle = (state, sectionId) => {
  const jspath = `$..formData[*].contents.section[?(@.id=='${sectionId}')].title`;
  const sectionTitles = jsonpath.query(state, jspath);

  if (sectionTitles.length) {
    return sectionTitles[0];
  }
  return null;
};

export const selectSubsectionTitleAndPartIDs = (state, subsectionId) => {
  const subsection = selectFragment(state, subsectionId);

  if (subsection) {
    return {
      parts: subsection.parts.map((part) => part.id),
      title: subsection.title,
      text: subsection.text,
    };
  }
  return null;
};

export const selectPartTitle = (state, partId) => {
  const part = selectFragment(state, partId);

  if (part) {
    return {
      text: part.text,
      title: part.title,
    };
  }
  return null;
};

export const selectQuestion = (state, id) => {
  const jp = `$..[*].contents.section.subsections[*].parts[*]..questions[?(@.id=='${id}')]`;
  const questions = jsonpath.query(state, jp);
  if (questions.length) {
    return questions[0];
  }

  return null;
};

/**
 * This function is a callback for the filter method in selectQuestionsForPart
 * @function filterDisplay
 * @param {object} question - single question from the unfilteredData array in selectQuestionsForPart.
 * @param {object} state - the application state
 * @returns {boolean} - to be evaluated by the filter method
 */
const filterDisplay = (question, state) => {
  if (!shouldDisplay(state, question.context_data)) {
    // If context data and a variation of skip text exists
    if (
      question.context_data &&
      ((question.context_data.conditional_display &&
        question.context_data.conditional_display.skip_text) ||
        question.context_data.skip_text)
    ) {
      // Set skip_text based on location in JSON
      let skipText = "";
      if (
        question.context_data.conditional_display &&
        question.context_data.conditional_display.skip_text
      ) {
        skipText = question.context_data.conditional_display.skip_text;
      } else {
        skipText = question.context_data.skip_text;
      }

      return {
        id: question.id,
        type: "skip_text",
        skip_text: skipText,
      };
    }
    return false; // return false to exclude this question from filtered array
  }

  if (question.questions) {
    // if the current question has subquestions, filter them recursively
    question.questions = question.questions
      .map((singleQuestion) => {
        // reassign question.questions to be a filtered version of itself
        return filterDisplay(singleQuestion, state);
      })
      .filter((q) => q !== false);
  }
  return question; // default for any questions that pass should display
};

// Returns an array of questions for the QuestionComponent to map through
export const selectQuestionsForPart = (state, partId) => {
  const jp = `$..[*].contents.section.subsections[*].parts[?(@.id=='${partId}')].questions[*]`;
  const unfilteredData = JSON.parse(JSON.stringify(jsonpath.query(state, jp)));

  // Filter the array of questions based on conditional logic
  const filteredQuestions = unfilteredData
    .map((question) => {
      return filterDisplay(question, state);
    })
    .filter((q) => q !== false);

  return filteredQuestions;
};

export const selectSectionsForNav = (state) => {
  if (state.formData) {
    const sections = state.formData;
    return sections.map(
      ({
        contents: {
          section: { id, ordinal, subsections, title },
        },
      }) => ({
        id,
        ordinal,
        title,
        subsections: subsections.map(({ id, title }) => ({ id, title })), // eslint-disable-line no-shadow
      })
    );
  }
  return [];
};

export const selectIsFormEditable = (state) => {
  console.log('HELLO IS IT EDITABLE?')
  const { reportStatus, stateUser, global } = state;
  const { role } = stateUser.currentUser;
  console.log(state)
  // get the state status of the current report
  const currentReport = `${stateUser.abbr}${global.currentYear}`
  const status = reportStatus[currentReport].status;

  switch (status) {
    case "not_started":
    case "in_progress":
    case "uncertified":
    case undefined:
      /*
       * Forms can only be edited if the current user is a state user AND the
       * form is in one of the statuses above.
       */
      return role === UserRoles.STATE;
    default:
      return false;
  }
};

export const { selectFormStatus, selectFormStatuses } = (() => {
  return {
    selectFormStatus: (state) => {
      const { status } = state.reportStatus;
      return status;
    },
    selectFormStatuses: (state) => {
      let returnObject = [];

      const allReportStatuses = Object.entries(state.reportStatus);

      // This is the default value so when the page loads before the records are populated, it will crash without this check
      if (
        allReportStatuses.length > 0 &&
        allReportStatuses[0][0] !== "status"
      ) {
        returnObject = Object.entries(state.reportStatus).map(
          // eslint-disable-next-line
          ([{}, { status, year, stateCode, lastChanged, username }]) => ({
            state: statesArray.find(({ value }) => value === stateCode)?.label,
            stateCode,
            status,
            year,
            lastChanged,
            username,
          })
        );
      } else {
        // Need to return something before records are populated so the page doesn't crash
        returnObject = Object.entries(state.reportStatus).map(
          ([stateCode]) => ({
            state: statesArray.find(({ value }) => value === stateCode)?.label,
            stateCode,
          })
        );
      }

      return returnObject;
    },
  };
})();

export const selectYears = () => {
  let yearArray = [];
  for (
    let x = 2020;
    x <= 2022;
    x++ // 2020 is the first year the new CARTS was used so there won't be an < 2020 forms
  ) {
    yearArray.push({ label: x, value: x });
  }
  return yearArray;
};
