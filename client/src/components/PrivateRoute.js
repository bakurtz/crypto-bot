import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
const AppContext = React.createContext({})

//import { useAppContext } from "../libs/contextLib";

const AuthenticatedRoute = ({ children, ...rest }) => {
  const { pathname, search } = useLocation();
  //const { isAuthenticated } = useAppContext();
  console.log(rest)
  return (
    <Route {...rest}>
      {rest.isAuthenticated ? (
        children
      ) : (
        <Redirect to={
          `/login?redirect=${pathname}${search}`
        } />
      )}
    </Route>
  );
}
export default AuthenticatedRoute;