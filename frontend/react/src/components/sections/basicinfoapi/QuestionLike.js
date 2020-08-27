import React from "react";
import { connect } from "react-redux";
import {
  selectFragment,
  winnowProperties,
} from "../../../store/formData";
import { setAnswerEntry } from "../../../actions/initial.js";
import { ChoiceList, TextField } from "@cmsgov/design-system-core";
import { _ } from "underscore";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

const TextFieldBase = ({
  fragment,
  changeFunc,
  multiline = null,
  rows = null,
  ...fieldProps
}) => {
  return (
    <TextField
      name={fragment.id}
      hint={fragment.hint}
      label={getLabelFromFragment(fragment)}
      value={(fragment.answer && fragment.answer.entry) || ""}
      onChange={_.partial(changeFunc, fragment.id)}
      type="text"
      multiline={multiline}
      rows={rows}
      disabled={fragment.answer && fragment.answer.readonly}
      {...fieldProps}
    />
  );
};
/* Question types */
const QuestionText = ({fragment, changeFunc, ...fieldProps}) => {
  const isNotReallyTextQuestion =
    fragment.type === "text" ? "" : `Is actually ${fragment.type}`;
  const key = `qt-${fragment.id}`;
  return (
    <div className="test" key={key}>
      {isNotReallyTextQuestion}
      <TextFieldBase
        fragment={fragment}
        changeFunc={changeFunc}
        {...fieldProps}
      />
    </div>
  );
};

const QuestionTextSmall = ({fragment, changeFunc, ...fieldProps}) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    {...fieldProps}
  />
);

const QuestionTextMedium = ({fragment, changeFunc, ...fieldProps}) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={3}
    {...fieldProps}
  />
);

const QuestionTextMultiline = ({fragment, changeFunc, ...fieldProps}) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={6}
    {...fieldProps}
  />
);

const QuestionTextMailingAddress = ({fragment, changeFunc, ...fieldProps}) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={4}
    {...fieldProps}
  />
);

const QuestionTextEmail = ({fragment, changeFunc, ...fieldProps}) => {
  const valid = validEmailRegex.test(fragment.answer.entry);
  const errorMessage = valid
    ? null
    : "YOUR EMAIL ADDRESS IS AN OFFENSE AGAINST THE INTERNET";
  return (
    <TextFieldBase
      fragment={fragment}
      changeFunc={changeFunc}
      errorMessage={errorMessage}
    {...fieldProps}
    />
  );
};

const QuestionTextPhone = ({fragment, changeFunc, ...fieldProps}) => {
  const valid = validTelephoneRegex.test(fragment.answer.entry);
  const errorMessage = valid
    ? null
    : "WE'RE CALLING YOU RIGHT NOW BUT YOU'RE NOT ANSWERING";
  return (
    <TextFieldBase
      fragment={fragment}
      changeFunc={changeFunc}
      errorMessage={errorMessage}
    {...fieldProps}
    />
);
}

const QuestionChoiceList = ({fragment, changeFunc, ...fieldProps}) => {
  const buildChoice = (entry, options, key) => {
    let choice = {label: key, value: options[key]};
    let isChecked = (choice.value === entry) || (entry && entry.includes && entry.includes(choice.value));
    choice["checked"] = (!_.isUndefined(isChecked) && !_.isNull(isChecked)) ? isChecked : false;
    return choice;
  }
  const choices = Object.keys(fragment.answer.options).map((k) => buildChoice(fragment.answer.entry, fragment.answer.options, k));

  return (
    <ChoiceList
      label={fragment.label}
      hint={fragment.hint}
      name={fragment.id}
      type={fragment.type}
      choices={choices}
      onChange={_.partial(changeFunc, fragment.id)}
      disabled={fragment.answer.readonly}
      {...fieldProps}
    >
    </ChoiceList>
  )
}

const QuestionRadioButtons = ({fragment, changeFunc, ...fieldProps}) => {
  return (
    <QuestionChoiceList
      fragment={fragment}
      changeFunc={changeFunc}
      {...fieldProps}
    />
  )
};

const QuestionCheckboxes = ({fragment, changeFunc, ...fieldProps}) => {
  const handleCheckboxesChange = (fragmentId, eventChange) => {
    const inputs = Array.from(document.querySelectorAll(`[name='${eventChange.target.name}']`));
    const values = inputs.filter(input => input.checked).map(input => input.value);
    return changeFunc(fragmentId, {target: {value: values}});
  }
  return (
    <QuestionChoiceList
      fragment={fragment}
      changeFunc={handleCheckboxesChange}
      {...fieldProps}
    />
  )
};

/* /Question types */

// Map question types to functions:
const QuestionMap = new Map([
  ["checkbox", QuestionCheckboxes],
  ["email", QuestionTextEmail],
  ["mailing_address", QuestionTextMailingAddress],
  ["phone_number", QuestionTextPhone],
  ["radio", QuestionRadioButtons],
  ["text", QuestionText],
  ["text_small", QuestionTextSmall],
  ["text_medium", QuestionTextMedium],
  ["text_multiline", QuestionTextMultiline],
]);

// Connect question types to functions via their types:
const QuestionHolder = ({ fragment, elementid, changeFunc, ...fieldProps}) => {
  const Component = QuestionMap.has(fragment.type)
    ? QuestionMap.get(fragment.type)
    : QuestionMap.get("text");
  return (
    <Component
      fragment={fragment}
      changeFunc={changeFunc}
      elementid={elementid}
      {...fieldProps}
    />
  );
};

/* Helper functions for Questions */
const getQuestionLikeId = (fragment) => {
  if (fragment.id) {
    return fragment.id;
  } else if (
    fragment.type === "fieldset" &&
    fragment.fieldset_type === "marked"
  ) {
    return fragment.fieldset_info.id;
  }
  return null;
};

const getMarkerFromId = (id) => {
  if (id) {
    const last = id.split("-").slice(-1);
    //Return as is if it's a to z, otherwise turn it into a number to strip the leading zero:
    const marker = /^[a-z]{1,2}$/g.test(last) ? last : parseInt(last, 10);
    return marker;
  }
  return null;
};

const getLabelFromFragment = (fragment) => {
  const id = getQuestionLikeId(fragment);
  if (id && fragment.label) {
    const marker = getMarkerFromId(id);
    return `${marker}. ${fragment.label}`;
  } else if (fragment.label) {
    return fragment.label;
  }
  return null;
};

/* /Helper functions for Questions */

// The generic function for questions and question-like constructs:
const QuestionLike = ({ fragment, fragmentkey, setAnswer }) => {
  /* Debugging */
  const label = fragment.label ? <span>{fragment.label}</span> : <span></span>;
  const type = fragment.type ? <strong>{fragment.type}</strong> : <span></span>;
  const hint = fragment.hint ? <em>{fragment.hint}</em> : <span></span>;
  /* /Debugging */

  const fragmentId = getQuestionLikeId(fragment);
  const elementid = fragmentId ? fragmentId : fragmentkey;

  return fragment ? (
    <div id={`div-${elementid}`}>
      {/* Debugging
        I am apparently a question-like thing of type {type} {label} {hint}
     /Debugging */}
      <QuestionHolder
        fragment={fragment}
        elementid={elementid}
        changeFunc={setAnswer}
      />
    </div>
  ) : null;
};

const mapStateToProps = (state, ownProps) => ({
  fragment: winnowProperties(selectFragment(state, null, ownProps.jpexpr)),
  fragmentkey: ownProps.fragmentkey,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionLike);
