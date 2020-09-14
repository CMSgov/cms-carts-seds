import React from "react";
import { connect } from "react-redux";
import PageInfo from "./PageInfo";
import { selectSectionTitle } from "../../store/selectors";
import { getUserData } from "../../store/stateUser";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

const Section = ({ subsectionId, title }) => {
  console.log(`rendering section with title: ${title}`);
  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2>{title}</h2>
        <Subsection key={subsectionId} subsectionId={subsectionId} />
      </div>
      <div className="form-footer">
        <Autosave />
        <FormNavigation />
        <FormActions />
      </div>
    </div>
  );
};

const mapStateToProps = (state, { sectionId, subsectionId }) => {
  return {
    subsectionId,
    title: selectSectionTitle(state, sectionId),
  };
};

export default connect(mapStateToProps)(Section);
