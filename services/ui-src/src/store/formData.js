import _ from "underscore";
import { LOAD_SECTIONS, QUESTION_ANSWERED } from "../actions/initial";
import { SET_FRAGMENT } from "../actions/repeatables";
import jsonpath from "../util/jsonpath";
import { selectQuestion } from "./selectors";
import idLetterMarkers from "../util/idLetterMarkers";

const sortByOrdinal = (sectionA, sectionB) => {
  const a = sectionA.contents.section.ordinal;
  const b = sectionB.contents.section.ordinal;

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
const initialState = [];

export default (state = initialState, action) => {
  let updatedData = undefined;
  switch (action.type) {
    case LOAD_SECTIONS:
      updatedData = action.data.sort(sortByOrdinal);
      if (action.lastYearData && action.lastYearData.length > 0) {
        let lastYearData = action.lastYearData.sort(sortByOrdinal);
        const twoYearCycle = action.lastYearData.year % 2 == 0;
        if (
          !updatedData[0].contents.section.subsections[0].parts[0].questions[0]
            .answer.entry
        ) {
          updatedData[0].contents.section.subsections[0].parts[0].questions[0] =
            lastYearData[0].contents.section.subsections[0].parts[0].questions[0]; // Name
        }
        if (
          !updatedData[0].contents.section.subsections[0].parts[0].questions[1]
            .answer.entry
        ) {
          updatedData[0].contents.section.subsections[0].parts[0].questions[1] =
            lastYearData[0].contents.section.subsections[0].parts[0].questions[1]; // Type
        }
        // Cohort Questions - These should be revolving around a 2 year cycle, but today just pull forward
        if (twoYearCycle) {
          updatedData[3].contents.section.subsections[2].parts[5].questions[1].answer =
            lastYearData[3].contents.section.subsections[2].parts[5].questions[1].answer; // How does your state define “newly enrolled” for this cohort?
          updatedData[3].contents.section.subsections[2].parts[5].questions[2].answer =
            lastYearData[3].contents.section.subsections[2].parts[5].questions[2].answer; // Do you have data for individual age groups?
        }
        // Added mid year as a quick fix for 2021 forms see: https://qmacbis.atlassian.net/browse/OY2-12744 Should be removed ASAP!!
        updatedData[2].contents.section.subsections[0].parts[1].text =
          "This table is pre-filled with data on uninsured children (age 18 and under) who are below 200% of the Federal Poverty Level (FPL) based on annual estimates from the American Community Survey. Due to the impacts of the COVID-19 PHE on collection of ACS data, the 2020 children's uninsurance rates are currently unavailable. Please skip to Question 3.";
      }

      var chgsection1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      for (let x in chgsection1) {
        updatedData[1].contents.section.subsections[0].parts[2].questions[
          x
        ].answer.options = [
          {
            label: "Yes",
            value: "yes",
          },
          { label: "No", value: "no" },
          { label: "N/A", value: "n/a" },
        ];
      }
      updatedData[1].contents.section.subsections[0].parts[2].questions[16].questions[1].answer.options =
        [
          {
            label: "Yes",
            value: "yes",
          },
          { label: "No", value: "no" },
          { label: "N/A", value: "n/a" },
        ];

      var chgsection2 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ];
      for (let x in chgsection2) {
        updatedData[1].contents.section.subsections[0].parts[3].questions[
          x
        ].answer.options = [
          {
            label: "Yes",
            value: "yes",
          },
          { label: "No", value: "no" },
          { label: "N/A", value: "n/a" },
        ];
      }

      return updatedData;
    case QUESTION_ANSWERED: {
      const fragment = selectQuestion({ formData: state }, action.fragmentId);
      if (action.data === "") {
        fragment.answer.entry = "";
      } else {
        fragment.answer.entry = action.data;
      }
      return JSON.parse(JSON.stringify(state));
    }
    case SET_FRAGMENT:
      jsonpath.apply(state, `$..*[?(@.id==='${action.id}')]`, () => {
        return action.value;
      });
      return JSON.parse(JSON.stringify(state));
    default:
      return state;
  }
};

/* Helper functions for getting values from the JSON returned by the API */
export const selectSectionByOrdinal = (state, ordinal) => {
  const section = state.formData.filter(
    (c) => c.contents.section.ordinal === ordinal
  );
  if (section.length > 0) {
    return section[0].contents.section;
  }
  return null;
};

export const extractSectionOrdinalFromId = (id) => {
  const chunks = id.split("-");
  const sectionOrdinal = parseInt(chunks[1], 10);
  return sectionOrdinal;
};

export const extractSectionOrdinalFromJPExpr = (jpexpr) => {
  const id = jpexpr.split("id=='")[1].split("'")[0];
  return extractSectionOrdinalFromId(id);
};

/**
 * @param {int} year: full four-digit year.
 * @param {int} sectionOrdinal: just the digit; we don't expect it to have a leading zero here.
 * @param {string} subsectionMarker: a–z or aa–zz. Should be lowercase by the time it gets here.
 * @returns {string} e.g. 2020-01-a.
 */
export const constructIdFromYearSectionAndSubsection = (
  year,
  sectionOrdinal,
  subsectionMarker
) => {
  const sectionChunk = sectionOrdinal.toString().padStart(2, "0");
  if (subsectionMarker) {
    return [year, sectionChunk, subsectionMarker].join("-");
  }
  return [year, sectionChunk].join("-");
};

export const extractJsonPathExpressionFromQuestionLike = (
  questionLikeId,
  parentId,
  index
) => {
  if (questionLikeId) {
    return `$..*[?(@.id=='${questionLikeId}')]`;
  }
  return `$..*[?(@.id=='${parentId}')].questions[${index}]`;
};

export const selectFragmentByJsonPath = (
  state,
  expr,
  sectionOrdinal = false
) => {
  const sectionNumber = sectionOrdinal || extractSectionOrdinalFromJPExpr(expr);

  const section = selectSectionByOrdinal(state, sectionNumber);
  // Note that the following assumes that there's only one matching result.
  const fragment = jsonpath.query(section, expr)[0];
  return fragment;
};

export const selectFragmentById = (state, id) => {
  const sectionOrdinal = extractSectionOrdinalFromId(id);
  const jpexpr = `$..*[?(@.id=='${id}')]`;
  return selectFragmentByJsonPath(state, jpexpr, sectionOrdinal);
};

/**
 * Selects a fragment from a given object using the jsonpath expression passed in.
 * Assumes there's only one matching result and returns it.
 * @param {Object} target - the data structure to be searched.
 * @param {strign} expr - the JSONPath expression to be used to search.
 */
export const selectFragmentFromTarget = (target, expr) => {
  const results = jsonpath.query(target, expr);
  return results.length ? results[0] : null;
};

/**
 * Selects a fragment from state if given an id or a JSONPath expression.  Does
 * this more efficiently than selectFragmentById or selectFragmentByJsonPath,
 * by using knowledge of how this particular JSON is structured to take a lot
 * of shortcuts.
 * If id isn't supplied, jp must contain an id lookup in it, as this function
 * depends on being able to use knowledge of how ids correspond to the data
 * structure.
 * @param {Object} state - the overall state object. If this doesn't have the formData property, or it's an empty array, returns null.
 * @param {string} id - The id of what we're looking for, e.g. 2020-01-a-01-01-a-01.
 * @param {string} jp - JSONPath expression, although if id is not supplied it must be a JSONPath expression with an id lookup in it.
 */
export const selectFragment = (state, id = null, jp = null) => {
  if (!state.formData || state.formData.length === 0) {
    return null;
  }
  if (!id && !jp) {
    return null;
  }
  const idValue = id ?? jp.split("id=='")[1].split("'")[0];
  const sectionOrdinal = extractSectionOrdinalFromId(idValue);
  const section = selectSectionByOrdinal(state, sectionOrdinal);
  let targetObject = section;
  const chunks = idValue.split("-").slice(2); // Year is irrelevant so we skip it; same for section since we just got it above.
  if (chunks.length >= 2) {
    // id of e.g. (2020-01-)a-01 means our target is the fragment's parent, subsection a:
    targetObject = targetObject.subsections[idLetterMarkers.indexOf(chunks[0])];
  } else {
    // if it's just one chunk, it's a subsection, so:
    return targetObject.subsections[idLetterMarkers.indexOf(chunks[0])];
  }
  if (chunks.length >= 3) {
    // id of e.g. (2020-01-)a-01-01 means our target is the fragment's parent, part 01:
    targetObject = targetObject.parts[Number(chunks[1]) - 1];
  } else {
    // if it's just two chunks it's a part, so:
    return targetObject.parts[Number(chunks[1]) - 1];
  }
  if (chunks.length >= 4) {
    // id of e.g. (2020-01-)a-01-01-a means our target is the fragment's parent, question 01 (although it could also be an objective, etc.):
    targetObject = targetObject.questions[Number(chunks[2]) - 1];
  } else {
    // if it's just three chunks it's a question, so:
    return targetObject.questions[Number(chunks[2]) - 1];
  }
  if (chunks.length >= 5 && idLetterMarkers.includes(chunks[3])) {
    // id of e.g. (2020-01-)a-01-01-a-01 means our target is the fragment's parent, question a:
    targetObject = targetObject.questions[idLetterMarkers.indexOf(chunks[3])];
  }
  // TODO: account for objectives/repeatables here.

  const path = jp || `$..*[?(@.id=='${idValue}')]`;
  return selectFragmentFromTarget(targetObject, path);
};

/* /Helper functions for getting values from the JSON returned by the API */

/**
 * @param {Object} fragment: the fragment we want to turn into a shallower tree.
 * @returns {Object} The shallower-tree version of the fragment.
 */
export const winnowProperties = (fragment) => {
  if (!fragment) {
    return null;
  }

  // Remove the property named key, then replace it with a list of objects containing only the ids of the original objects in the list.
  const winnow = (orig, key) => {
    const copy = _.omit(orig, [key]);
    copy[key] = orig[key].map((item) => (item.id ? { id: item.id } : {}));
    return copy;
  };

  // Check for subsections, parts, and questions, in that order.
  const props = ["subsections", "parts", "questions"];
  for (let i = 0; i < props.length; i += 1) {
    const prop = props[i];
    if (prop in fragment) {
      return winnow(fragment, prop);
    }
  }

  return fragment;
};

// Generate subsection label including letter, ie: 'Section 3F'
export const generateSubsectionLabel = (str) => {
  const idArray = str.split("-");
  const sectionNumber = Number(idArray[1]);
  return `Section ${sectionNumber}${idArray[2]}`;
};
