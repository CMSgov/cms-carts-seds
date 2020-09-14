import React, { useState } from "react";
import { Choice } from "@cmsgov/design-system-core";
import Question from "../layout/Question";

const Radio = ({ onChange, question, ...props }) => {
  const [checked, setChecked] = useState(question.answer.entry);

  const onCheck = (e) => {
    setChecked(e.target.value);
    onChange(e);
  };

  const childProps = {};

  if (question.questions && question.questions.length) {
    childProps.checkedChildren = (
      <div className="ds-c-choice__checkedChild">
        {question.questions.map((q, i) => (
          <Question key={q.id || i} question={q} />
        ))}
      </div>
    );
  }

  return question.answer.options.map(({ label, value }) => (
    <Choice
      checked={checked === value}
      type="radio"
      value={value}
      {...childProps}
      {...props}
      onChange={onCheck}
    >
      {label}
    </Choice>
  ));
};

export { Radio };
