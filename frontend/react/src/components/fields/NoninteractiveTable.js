import React from "react";
import PropTypes from "prop-types";

const NoninteractiveTable = ({ question }) => {
  const columnWidth = 100 / question.fieldset_info.headers.length;
  // eslint-disable-next-line
  let percentLocation = [];
  let count = -1;
  return (
    <div className="non-interactive-table ds-u-margin-top--2">
      <table className="ds-c-table" width="100%">
        <thead>
          <tr>
            {question.fieldset_info.headers.map((header) => {
              count += 1;
              // captures the location of a percent element
              if (String(header).toLowerCase().includes("percent")) {
                percentLocation[count] = true;
              } else {
                percentLocation[count] = false;
              }
              return (
                <th width={`${columnWidth}%`} name={`${header}`} key={header}>
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {question.fieldset_info.rows.map((row) => {
            count = -1;
            return (
              <tr key={count}>
                {row.map((value) => {
                  count += 1;
                  // adds % to any element that has percent in the header and adds commas via toLocaleString
                  if (percentLocation[count] === true) {
                    // TODO Remove this custom logic when rewriting backend
                    // This is part of the story to dynamically calculate percent change: OY2-13439 and is the absolute wrong way to do this.
                    if (
                      (row[0] === "Medicaid Expansion CHIP" ||
                        row[0] === "Separate CHIP") &&
                      question.fieldset_info.headers[1]?.includes(
                        "Number of children enrolled in FFY"
                      )
                    ) {
                      // The percent change calculation times 100 to give the percent in the correct format
                      let returnValue = ((row[2] - row[1]) / row[1]) * 100;
                      if (!returnValue) {
                        returnValue = 0;
                      }
                      returnValue = Math.round(returnValue * 1000) / 1000;
                      return (
                        <td width={`${columnWidth}%`}>
                          {returnValue.toLocaleString()}%
                        </td>
                      );
                    }
                    //End of the custom logic, that should really never have been done in the first place
                    return (
                      <td width={`${columnWidth}%`}>
                        {value.toLocaleString()}%
                      </td>
                    );
                    // eslint-disable-next-line
                  } else {
                    return (
                      <td width={`${columnWidth}%`}>
                        {value.toLocaleString()}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
NoninteractiveTable.propTypes = {
  question: PropTypes.object.isRequired,
};
export { NoninteractiveTable };
export default NoninteractiveTable;
