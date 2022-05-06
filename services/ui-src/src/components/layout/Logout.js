import React from "react";
import { Button } from "@cmsgov/design-system";
import { useUser } from "../../hooks/authHooks";

// Basic component with logout button
const Logout = () => {
  const { logout } = useUser();

  return (
    <Button type="button" variation="transparent" onClick={logout}>
      Log Out
    </Button>
  );
};
export default Logout;
