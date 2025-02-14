import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import { Money } from "./Money";
import { Percentage } from "./Percentage";
import Text from "./Text";

const inputs = new Map([
  ["money", Money],
  ["percentage", Percentage],
  ["text", Text],
]);

const Range = ({
  category,
  id,
  index,
  onChange,
  row,
  type,
  values,
  ...props
}) => {
  const [rangeError, setRangeError] = useState("");
  const [rangeValues, setRangeValues] = useState(values);

  // Trigger validation when page loads so that all error messages show
  useEffect(() => {
    validateInequality();
  }, []);

  // This chooses the appropriate mask for the <Input/>, Money, Percentage or Text
  let Input = Text;
  if (inputs.has(type)) {
    Input = inputs.get(type);
  }

  /*
   * Extract start value from redux's nested array, passed down from <Ranges/>
   * This is an object because of the way it is eventually read by the Textfield component (in Integer.js or Text.js)
   */
  const startQuestion = {
    id: `${id}-row-${row}-${index}-start`,
    answer: {
      entry: values ? values[0] : "",
    },
  };

  /*
   * Extract start value from redux's nested array, passed down from <Ranges/>
   * This is an object because of the way it is eventually read by the Textfield component (in Integer.js or Text.js)
   */
  const endQuestion = {
    id: `${id}-row-${row}-${index}-end`,
    answer: {
      entry: values ? values[1] : "",
    },
  };

  // Validate that the second field is greater than the first field
  const validateInequality = () => {
    if (!values && !rangeValues) {
      return;
    }

    // If the range type is text, skip validation
    if (type === "text") {
      return;
    }

    // Update local state
    setRangeValues([values[0], values[1]]);

    if (values.length === 2 && !values.includes(null)) {
      // Strip both values of commas
      let strippedStart = values[0].replace(/,/g, "");
      let strippedEnd = values[1].replace(/,/g, "");

      const start = parseFloat(strippedStart);
      const end = parseFloat(strippedEnd);

      // If both values are present, compare them and set appropriate error messages to state
      if (start > end) {
        setRangeError("Start value must be less than end value");
      } else {
        setRangeError("");
      }
    }
  };

  const changeStart = ({ target: { value } }) => {
    // Update local state
    setRangeValues([value, rangeValues[1]]);
    // Update <Ranges/>
    onChange(row, index, 0, value);
  };

  const changeEnd = ({ target: { value } }) => {
    // Update local state
    setRangeValues([rangeValues[0], value]);
    // Update <Ranges/>
    onChange(row, index, 1, value);
  };

  return (
    <div className="cmsrange">
      <div className="cmsrange-outer ds-l-container">
        {rangeError ? <div className="errors">{rangeError}</div> : null}
        <div className="ds-l-row">
          <div className="cmsrange-container range-start">
            <Input
              {...props}
              id={`${id}-${row}-${index}-0`}
              label={category[0]}
              className="cmsrange-input"
              question={startQuestion}
              fieldType={type}
              onChange={changeStart}
              onBlur={validateInequality}
              value={rangeValues[0] ? rangeValues[0] : values[0]}
              disabled={props.disabled}
            />
          </div>
          <div className="cmsrange-arrow">
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </div>
          <div className="cmsrange-container cmsrange-end">
            <Input
              {...props}
              id={`${id}-${row}-${index}-1`}
              label={category[1]}
              className="cmsrange-input"
              question={endQuestion}
              fieldType={type}
              onChange={changeEnd}
              onBlur={validateInequality}
              value={rangeValues[1] ? rangeValues[1] : values[1]}
              disabled={props.disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
Range.propTypes = {
  category: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  row: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
};

const Ranges = ({ onChange, question, ...props }) => {
  const {
    answer: {
      entry,
      entry_max: max,
      entry_min: min,
      header,
      range_categories: categories,
      range_type: types,
    },
  } = question;

  const [values, setValues] = useState(() => {
    if (Array.isArray(entry)) {
      return entry;
    }

    const numberToCreate = min > 0 ? min : 1;
    return [...Array(numberToCreate)].map(() =>
      categories.map(() => [null, null])
    );
  });

  const rowChange = (row, category, index, value) => {
    // Set incoming value to <Ranges/> local state
    values[row][category][index] = value;
    setValues(values);
    // Send to redux
    onChange({ target: { name: question.id, value: values } });
  };

  const addRow = () => {
    if (values.length < max || max === 0) {
      setValues([...values, categories.map(() => [null, null])]);
    }
  };

  const removeRow = () => {
    if (values.length) {
      setValues(values.slice(0, values.length - 1));
    }
  };

  return (
    <div className="cmsranges">
      {header && <span className="span-pdf-no-bookmark">{header}</span>}

      {values.map((rowValues, row) =>
        rowValues.map((categoryValues, index) => (
          <Range
            {...props}
            key={`${row}.${index}`}
            category={categories[index]}
            id={question.id}
            index={index}
            onChange={rowChange}
            row={row}
            type={types[index]}
            values={categoryValues}
            disabled={props.disabled}
          />
        ))
      )}

      {values.length < max || max === 0 ? (
        <Button
          onClick={addRow}
          type="button"
          variation="solid"
          disabled={props.disabled}
        >
          Add another? <FontAwesomeIcon icon={faPlus} />
        </Button>
      ) : null}
      {values.length > min || min === 0 ? (
        <Button
          onClick={removeRow}
          type="button"
          variation="solid"
          disabled={props.disabled}
        >
          Remove Last Entry <FontAwesomeIcon icon={faMinusCircle} />
        </Button>
      ) : null}
    </div>
  );
};
Ranges.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Range, Ranges };
