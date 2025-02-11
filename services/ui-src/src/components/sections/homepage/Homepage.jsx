import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReportItem from "./ReportItem";
import TemplateDownload from "./TemplateDownload";
import { getFiscalYearTemplate } from "../../../actions/download";
import { REPORT_STATUS, STATUS_MAPPING, AppRoles } from "../../../types";

function formatStateStatus(item) {
  if (item) {
    const editable =
      item.status === REPORT_STATUS.not_started ||
      item.status === REPORT_STATUS.in_progress ||
      item.status === REPORT_STATUS.uncertified;
    return (
      <ReportItem
        key={item.stateCode + "-" + item.year}
        name={item.year}
        lastChanged={item.lastChanged}
        link1URL={`/sections/${item.year}/00`}
        link1Text={editable ? "Edit" : "View"}
        statusText={STATUS_MAPPING[item.status]}
        userRole={AppRoles.STATE_USER}
        year={item.year}
      />
    );
  }
}

const Homepage = ({ reportStatus, getFiscalYearTemplateLink }) => {
  return (
    <main className="homepage">
      <div className="ds-l-container ds-content">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Reporting Template System (CARTS)
          </h1>
        </div>
        <TemplateDownload getTemplate={getFiscalYearTemplateLink} />
        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row">
                <h3 className="ds-u-padding--2">All Reports</h3>
              </div>
              <div className="report-header ds-l-row">
                <div className="name ds-l-col--2">Year</div>
                <div className="status ds-l-col--2">Status</div>
                <div className="name ds-l-col--3">Last Edited</div>
                <div className="actions ds-l-col--4">Actions</div>
              </div>

              {Object.keys(reportStatus).map((k) =>
                formatStateStatus(reportStatus[k])
              )}
            </div>
          </div>
        </div>
        <div className="ds-l-row">
          <div className="omb-info ds-l-col--12">
            <p>
              The OMB control number for this information is OMB 0938-1148. The
              time required to complete this information collection is estimated
              to 40 hours per response, including the time to review
              instructions, search existing data resources, gather data, and
              review and submit the information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
Homepage.propTypes = {
  reportStatus: PropTypes.object.isRequired,
  getFiscalYearTemplateLink: PropTypes.func.isRequired,
};

const mapState = (state) => ({
  reportStatus: state.reportStatus,
});

const mapDispatch = {
  getFiscalYearTemplateLink: getFiscalYearTemplate ?? {},
};

export default connect(mapState, mapDispatch)(Homepage);
