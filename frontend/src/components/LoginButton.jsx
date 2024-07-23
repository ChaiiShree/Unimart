import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ className }) => {
  const { loginWithRedirect, isAuthenticated, error } = useAuth0();

  console.log("isAuthenticated:", isAuthenticated);
  console.log("Error:", error);

  return (
    <button className={className} onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default LoginButton;
