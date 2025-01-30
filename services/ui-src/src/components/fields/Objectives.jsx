import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem } from "@reach/accordion";

import { Objective } from "./Objective";
import {
  createNewObjective,
  removeRepeatable,
} from "../../actions/repeatables";

const Objectives = ({
  addObjectiveTo,
  disabled,
  question,
  removeObjectiveFrom,
  printView,
}) => {
  const ref = useRef();
  const add = () => {
    addObjectiveTo(question.id);

    /*
     * Do the focus+scroll on the next UI tick so the DOM will have updated
     * before we try to grab DOM elements.
     */
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        ref.current.scrollIntoView();
      }
    }, 10);
  };

  const remove = () => {
    removeObjectiveFrom(question.id);
  };

  return (
    <>
      <Accordion
        collapsible
        multiple
        defaultIndex={[...Array(100)].map((_, i) => i)}
      >
        {question.questions.map((q, i) => (
          <AccordionItem key={q.id}>
            <Objective
              headerRef={ref}
              objective={q}
              objectiveNumber={i + 1}
              printView={printView}
            />
          </AccordionItem>
        ))}

        {question.questions.length > 1 && (
          <button
            disabled={disabled}
            onClick={remove}
            type="button"
            className="add-objective ds-c-button ds-c-button--danger"
          >
            Delete last objective
          </button>
        )}
      </Accordion>

      <div className="section-footer">
        <span className="question-inner-header span-pdf-no-bookmark">
          Do you have another objective in your State Plan?
        </span>

        <div
          className="ds-c-field__hint"
          aria-label="Add another objective Hint"
        >
          Optional
        </div>
        <button
          disabled={disabled}
          onClick={add}
          type="button"
          className="add-objective ds-c-button ds-c-button--solid"
        >
          Add another objective
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </>
  );
};
Objectives.propTypes = {
  addObjectiveTo: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  question: PropTypes.object.isRequired,
  removeObjectiveFrom: PropTypes.func.isRequired,
  printView: PropTypes.bool,
};

const mapDispatchToProps = {
  addObjectiveTo: createNewObjective,
  removeObjectiveFrom: removeRepeatable,
};

const ConnectedObjectives = connect(null, mapDispatchToProps)(Objectives);

export { ConnectedObjectives as Objectives };
export default ConnectedObjectives;
