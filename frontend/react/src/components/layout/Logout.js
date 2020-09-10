import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import config from '../../auth-config';

const redirectUri = `${window.location.origin}`;

// Basic component with logout button
const Logout = () => { 
  const { authState, authService } = useOktaAuth();

  const logout = async () => {
    // Read idToken before local session is cleared
    const idToken = authState.idToken;
    await authService.logout('/');

    // Clear remote session
    window.location.href = `${config.oidc.issuer}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
  };

  return (
    <a onClick={logout}>Log out</a>
  );
};

export default Logout;
