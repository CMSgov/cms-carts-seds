import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import PageInfo from "./PageInfo";
import { selectSectionTitle } from "../../store/selectors";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

const Section = ({ subsectionId, sectionId, printView }) => {
  const formData = useSelector((state) => state.formData);
  const title = selectSectionTitle(formData, sectionId);

  return (
    <div className="section-basic-info ds-l-col--9 content ds-content">
      <main id="main-content" className="main">
        <PageInfo />
        {title && <h2 data-testid="section-title">{title}</h2>}
        <Subsection
          key={subsectionId}
          subsectionId={subsectionId}
          printView={printView}
        />
      </main>
      <div className="form-footer">
        <Autosave />
        <FormNavigation />
        <FormActions />
      </div>
    </div>
  );
};
Section.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  sectionId: PropTypes.number.isRequired,
  printView: PropTypes.bool,
};

export default Section;
