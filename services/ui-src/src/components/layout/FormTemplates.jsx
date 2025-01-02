import React, { useState } from "react";
import { Button } from "@cmsgov/design-system";
import { useHistory } from "react-router-dom";
import { apiLib } from "../../util/apiLib";
import { useFlags } from "launchdarkly-react-client-sdk";

const FormTemplates = () => {
  const history = useHistory();
  const [inProgress, setInprogress] = useState(false);

  const handleUpdateTemplates = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    setInprogress(true);

    try {
      const opts = {
        body: { year: selectedYear },
      };
      await apiLib.post("/formTemplates", opts);
      window.alert("Request Completed");
      history.push("/");
    } catch (e) {
      window.alert("Error - Contact Support");
    }
    setInprogress(false);
  };

  const release2024 = useFlags().release2024;
  const defaultYear = release2024 ? "2024" : "2023";

  return (
    <>
      <div>
        <h1>Generate Form Base Templates</h1>
        <h3>Select Year</h3>
        <select
          className="ds-c-field"
          name="selectedYear"
          id="selectedYear"
          data-testid="generate-forms-options"
          defaultValue={defaultYear}
        >
          {release2024 && <option value="2024">2024</option>}
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <Button
          type="button"
          className="ds-c-button ds-c-button--primary"
          onClick={handleUpdateTemplates}
          disabled={inProgress}
          data-testid="generate-forms-button"
        >
          Generate New Section Forms
        </Button>
        {inProgress && (
          <div style={{ color: "red" }}>Running Please wait ....</div>
        )}
      </div>
    </>
  );
};

export default FormTemplates;
