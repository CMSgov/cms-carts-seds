import React from "react";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../../../hooks/useFormFields";
import { loginUser } from "../../../util/apiLib";

const LocalLogin = () => {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  async function handleLogin(event) {
    event.preventDefault();
    try {
      await loginUser(fields.email, fields.password);
      history.push("/");
    } catch (error) {
      console.log("Error while logging in.", error); // eslint-disable-line no-console
    }
  }

  return (
    <div className="login-option">
      <h2>Log In with Cognito</h2>
      <form onSubmit={(event) => handleLogin(event)}>
        <label for="email">
          <p className="ds-c-field__hint">Email:</p>
          <input
            className="ds-c-field"
            type="email"
            id="email"
            name="email"
            value={fields.email}
            data-testid="login-email"
            onChange={handleFieldChange}
          />
        </label>
        <label for="password">
          <p className="ds-c-field__hint">Password:</p>
          <input
            className="ds-c-field"
            type="password"
            id="password"
            name="password"
            value={fields.password}
            data-testid="login-password"
            onChange={handleFieldChange}
          />
        </label>
        <br />
        <button
          className="ds-c-button ds-c-button--solid"
          colorScheme="teal"
          isFullWidth
          type="submit"
          data-testid="login-button"
          data-cy="login-with-cognito-button"
        >
          Log In with Cognito
        </button>
      </form>
    </div>
  );
};

export const LocalLogins = ({ loginWithIDM }) => {
  return (
    <div className="local-login__wrapper .ds-l-col--12 ds-content">
      <div>
        <h1>CARTS Developer Login </h1>
      </div>
      <div className="login-option">
        <h2>Log In with IDM</h2>
        <button
          className="ds-c-button ds-c-button--solid"
          onClick={loginWithIDM}
        >
          Login with IDM
        </button>
      </div>
      <hr />
      <LocalLogin />
    </div>
  );
};
