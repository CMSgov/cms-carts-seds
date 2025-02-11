import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Alert } from "@cmsgov/design-system";
// components
import Question from "../fields/Question";
import Text from "./Text";
// utils
import { selectFragment } from "../../store/formData";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";

const Part = ({ partId, partNumber, nestedSubsectionTitle, printView }) => {
  const [, section] = partId.split("-");

  const [
    formData,
    currentUserRole,
    reportStatus,
    allStatesData,
    stateUserAbbr,
    chipEnrollments,
  ] = useSelector(
    (state) => [
      state.formData,
      state.stateUser.currentUser.role,
      state.reportStatus,
      state.allStatesData,
      state.stateUser.abbr,
      state.enrollmentCounts.chipEnrollments,
    ],
    shallowEqual
  );

  const part = selectFragment(formData, partId);
  const partContextData = part.context_data;

  const contextData = partContextData;
  const questions = selectQuestionsForPart(
    formData,
    currentUserRole,
    reportStatus,
    allStatesData,
    stateUserAbbr,
    chipEnrollments,
    partId
  );
  const show = shouldDisplay(
    currentUserRole,
    formData,
    reportStatus,
    allStatesData,
    stateUserAbbr,
    chipEnrollments,
    partContextData
  );
  const text = part ? part.text : null;
  const title = part ? part.title : null;

  const getPartContent = () => {
    if (show) {
      return (
        <>
          {text && <Text data-testid="part-text">{text}</Text>}
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              tableTitle={title}
              data-testid="part-question"
              printView={printView}
            />
          ))}
        </>
      );
    } else {
      if (contextData) {
        return <Alert>{contextData.skip_text && contextData.skip_text}</Alert>;
      }
    }
  };

  return (
    <div id={partId} data-testid="part">
      {title &&
        (nestedSubsectionTitle ? (
          <h4 className="h4-pdf-bookmark" data-testid="part-sub-header">
            {+section !== 0 && partNumber && `Part ${partNumber}: `}
            {title}
          </h4>
        ) : (
          <h3 className="h3-pdf-bookmark" data-testid="part-header">
            {+section !== 0 && partNumber && `Part ${partNumber}: `}
            {title}
          </h3>
        ))}
      {getPartContent()}
    </div>
  );
};
export default Part;
