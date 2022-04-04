import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@cmsgov/design-system-core';
import ReactHtmlParser from 'react-html-parser';
import axios from '../../authenticatedAxios';
import { connect } from 'react-redux';

const Text = ({ question, state, ...props }) => {
  const [printValue, setPrintValue] = useState((question.answer && question.answer.entry) || '');
  const [prevYearValue, setPrevYearValue] = useState();
  const [prevYearDisabled, setPrevYearDisabled] = useState();

  const updatePrintHelper = ({ target: { value } }) => {
    const val = value.replace(/\n/g, '<br/>');
    setPrintValue(val);
  };

  useEffect(() => {
    const getPrevYearValue = async () => {
      // Create array from id
      const splitID = question.id.split('-');

      // Even years get inputs, odd years get previous year data
      const shouldGetPriorYear = splitID[0] % 2;

      // If question is Part 6, section 3c, question 9
      if (
        shouldGetPriorYear &&
        splitID[1] === '03' &&
        splitID[2] === 'c' &&
        splitID[3] === '06' &&
        splitID[4] === '09'
      ) {
        // Set year to last year
        const lastYear = parseInt(splitID[0]) - 1;
        splitID[0] = lastYear;
        const fieldsetId = splitID.join('-');

        if (state) {
          try {
            await axios
              .get(`/api/v1/sections/${lastYear}/${state.toUpperCase()}/3`)
              .then((data) => {
                // getDataFromLastYear(fieldsetId);
                if (data) {
                  let value =
                    getValueFromLastYear(data.data, fieldsetId) || 'No Value from Last Year';
                  setPrevYearDisabled(true);
                  setPrevYearValue(value);
                }
              });
          } catch (e) {
            setPrevYearDisabled(true);
            setPrevYearValue(null);
          }
        }
      }
    };

    const getValueFromLastYear = (data, fieldsetId) => {
      let lastYearAnswer;
      // Get questions from last years JSON
      const questions = data.contents.section.subsections[2].parts[5].questions;

      // Derive matching question
      let matchingQuestion = questions.filter((question) => fieldsetId === question?.id);

      // Always use first item in array
      if (matchingQuestion[0]) {
        lastYearAnswer = matchingQuestion[0].answer.entry;
      }

      return lastYearAnswer ?? '';
    };

    getPrevYearValue().then();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="print-helper">{ReactHtmlParser(printValue)}</div>
      <TextField
        value={prevYearValue || (question.answer && question.answer.entry) || ''}
        type="text"
        label=""
        onBlur={updatePrintHelper}
        {...props}
        disabled={prevYearDisabled}
      />
    </>
  );
};
Text.propTypes = {
  question: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
};

const mapState = (state) => ({
  state: state.formData[0].contents?.section?.state,
});

export default connect(mapState)(Text);
