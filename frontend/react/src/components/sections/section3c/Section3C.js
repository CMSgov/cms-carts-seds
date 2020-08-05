import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Tabs,
  TabPanel,
} from "@cmsgov/design-system-core";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import Questions3C from "./questions/Questions3C";
class Section3c extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: "Section 3C: Eligibility",
    };
  }

  render() {
    return (
      <div className="section-3c ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{this.state.pageTitle}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={this.state.pageTitle}>
                <Questions3C previousYear = "false"/>
                <FormNavigation previousUrl="/section3/3a" />
              </TabPanel>
              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />

                  <h3>{this.state.pageTitle}</h3>
                </div>
                <div disabled>
                  <Questions3C previousYear="true"/>
                </div>
                <FormNavigation previousUrl="/section3/3a" />
              </TabPanel>
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section3c);
