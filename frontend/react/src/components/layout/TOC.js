import React, { Component } from "react";
import PropTypes from "prop-types";
import { VerticalNav } from "@cmsgov/design-system-core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;
const subsection = (index) => String.fromCharCode("A".charCodeAt(0) + index);

class TOC extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click = (e, _, url) => {
    e.preventDefault();
    e.stopPropagation();

    const { history } = this.props;

    history.push(url);
  };

  render() {
    const { location, sections } = this.props;

    const items = sections
      .map(({ id: sectionId, ordinal, subsections, title: sectionTitle }) => ({
        id: sectionId,
        items:
          subsections.length < 2
            ? null
            : subsections.map(
                ({ id: subsectionId, title: subsectionTitle }, i) => ({
                  label: `Section ${ordinal}${subsection(
                    i
                  )}: ${subsectionTitle}`,
                  onClick: this.click,
                  selected: location.pathname
                    .toLowerCase()
                    .startsWith(idToUrl(subsectionId)),
                  url: idToUrl(subsectionId),
                })
              ),
        label:
          ordinal > 0 ? `Section ${ordinal}: ${sectionTitle}` : sectionTitle,
        onClick: this.click,
        selected: location.pathname
          .toLowerCase()
          .startsWith(idToUrl(sectionId)),
      }))
      .map(({ id, items: childItems, ...rest }) => {
        const updated = { id, items: childItems, ...rest };
        if (childItems == null) {
          updated.url = idToUrl(id);
        }
        return updated;
      });

    return (
      <div className="toc">
        <VerticalNav selectedId="toc" items={items} />
      </div>
    );
  }
}
TOC.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sections: PropTypes.array.isRequired,
};

const sortByOrdinal = (sectionA, sectionB) => {
  const a = sectionA.contents.section.ordinal;
  const b = sectionB.contents.section.ordinal;

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const selectSectionsForNav = (state) => {
  if (state.formData) {
    const sections = state.formData.sort(sortByOrdinal);
    return sections.map(
      ({
        contents: {
          section: { id: sectionId, ordinal, subsections, title: sectionTitle },
        },
      }) => ({
        id: sectionId,
        ordinal,
        title: sectionTitle,
        subsections: subsections.map(
          ({ id: subsectionId, title: subsectionTitle }) => ({
            id: subsectionId,
            title: subsectionTitle,
          })
        ),
      })
    );
  }
  return [];
};

const mapStateToProps = (state) => ({ sections: selectSectionsForNav(state) });

export default connect(mapStateToProps)(withRouter(TOC));
