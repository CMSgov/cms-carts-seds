import React from "react";
import { Button } from "@cmsgov/design-system";

const Autosave = () => (
  <div className="autosave">
    <div className="ds-l-row">
      <div className="ds-l-col">
        <Button
          className="ds-c-button--ghost"
          title="Last edited 3 minutes ago"
          disabled
        >
          All changes auto-saved
        </Button>
      </div>
    </div>
  </div>
);

export default Autosave;
