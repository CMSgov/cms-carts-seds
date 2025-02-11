import React, { useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";

const Radio = ({ onChange, onClick, question, ...props }) => {
  const [checked, setChecked] = useState(question.answer.entry);
  const onCheck = (e) => {
    setChecked(e.target.value);
    onChange(e);
  };

  const unCheck = (e) => {
    setChecked("");
    onClick(e);
  };

  let children = <></>;

  if (question.questions && question.questions.length) {
    children = (
      <div className="radio-children">
        {question.questions.map((q, i) => (
          <Question key={q.id || i} question={q} />
        ))}
      </div>
    );
  }

  const radioButttonList = question.answer.options.map(({ label, value }) => {
    const isChecked = checked === value;

    return (
      <div className="radio-container" key={props.name + "-" + value}>
        <input
          key={value}
          checked={isChecked}
          type="radio"
          value={value}
          {...props}
          onChange={onCheck}
          onClick={unCheck}
          id={props.name + "-" + value}
        />
        <label htmlFor={props.name + "-" + value}>{label}</label>
        {isChecked && children}
      </div>
    );
  });

  return <div>{radioButttonList}</div>;
};
Radio.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
};

export { Radio };
export default Radio;
