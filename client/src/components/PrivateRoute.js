import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({ children, ...rest }) => {
  let isAuthenticated;
  if(localStorage.getItem("jwt-access-token")){
    isAuthenticated = true;
  }
  
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={
          "/login"
        } />
      )}
    </Route>
  );
}
export default AuthenticatedRoute;