import axios from "axios";

import { QUESTION_ANSWERED } from "../actions/initial";

const saveMiddleware = () => {
  let isSaving = false;
  const pending = [];
  const queued = [];
  let timer = null;

  const doSave = ({ data, fragmentId = false } = {}) => {
    // If there is a save in progress already, don't start another one because
    // we could end up sending duplicate changes and we don't know how that
    // would pan out, and also because we can't be sure what order the saves
    // will be processed on the server. So... just send one. But queue up
    // another save when this one is finished, so we don't lose track of the
    // intention here.
    if (isSaving) {
      queued.push({ data, fragmentId });
      return;
    }

    if (fragmentId !== false) {
      pending.push({ data, fragmentId });
    }

    // If we are not already saving, clear the save timer, if there is one.
    // This is how we debounce the save so that it only runs after some
    // period of user inactivity.
    clearTimeout(timer);

    // Now set the timer for actually doing the save. It'll run 300 ms after
    // the most recent call to save.
    timer = setTimeout(async () => {
      // We're saving now. Don't allow any more saves to start.
      isSaving = true;

      try {
        await axios.post(`//localhost:8000/api/v1/sections/2020/AK`, pending);

        // If the save is successful, we can clear out the list of pending
        // saves, because they have been persisted on the server.
        pending.length = 0;
      } catch (error) {
        // In the event of an error, we might dispatch some other action here
        // to set a global error state and update the autosave header. TBD.

        if (error.response && error.response.status === 401) {
          // User is not logged in.
        } else if (error.response && error.response.status === 403) {
          // User does not have permission.
        } else {
          // Some other server-side error.
        }
      }

      // When the save is finished, we can clear that flag.
      isSaving = false;

      // If any new saves came in while we were saving, moves those from the
      // queue into the pending list and fire up another save.
      if (queued.length) {
        pending.push(...queued);
        queued.length = 0;
        doSave();
      }
    }, 300);
  };

  return (next, { runSave = doSave } = {}) => (action) => {
    const result = next(action);
    switch (action.type) {
      case QUESTION_ANSWERED:
        runSave(action);
        break;
      default:
        break;
    }
    return result;
  };
};

export default saveMiddleware;
