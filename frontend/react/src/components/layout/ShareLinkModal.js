import React from 'react'
import { Button, Dialog, TextField } from "@cmsgov/design-system-core"
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

export const ShareLinkModal = ({ hide }) => {
  const [link, linkGenerated] = useState('')
  const copyUrl = "https://cartsdemo.cms.gov/shared/667177b6-f008-4cf1-b728-e52b0cb94920"
  const expires = `7`

  const generateLink = _ => {
    // Hide generate button.
    linkGenerated(true)
    // Get a new uuid and append to copyurl. 
  }

  const revokeLink = _ => {
    // Show generate button.
    linkGenerated(!link)
    // Expire uuid.
  }

  const generateActions = [
    <button
      onClick={generateLink}
      className={`ds-c-button ds-c-button--primary ${link && `ds-u-display--none`}`}
      key="primary">
      Generate
    </button>,
    <button
      onClick={revokeLink}
      className={`ds-c-button ds-c-button--danger ${link || `ds-u-display--none`}`}
      key="primary">
      Revoke
    </button>,
    <button
      className="ds-c-button ds-c-button--transparent"
      key="cancel"
      onClick={hide}
    >
      Cancel
    </button>
  ]

  return (
    <Dialog
      onExit={hide}
      getApplicationNode={() => document.getElementById('App')}
      heading="Share this section"
      actions={generateActions}
    >
      Generate a link to share this section with someone on your team. Once you share the link, they’ll be able to edit the page until the link expires in {expires} days. If you need to edit the page before then, you can cancel the link and revoke their access. You can always generate a new link to share the page again.
      {/* Replace with SharedLinkCopy component */}
      {link &&
        (<form>
          <TextField className="ds-c-field ds-u-display--inline-block ds-u-border--0" name="copyUrl" value={copyUrl} disabled />
          <Button
            className="ds-c-button--transparent ds-c-button--small"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </form>)}
    </Dialog>
  )
}