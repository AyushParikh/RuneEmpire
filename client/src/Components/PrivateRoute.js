import React from "react";
import { Route, Redirect } from "react-router-dom";

export async function PrivateRoute(levelRequired) {
  await fetch(
    `${window.baseURL}/checkAdmin/` + window.localStorage.getItem("token")
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.level < levelRequired) {
        // not logged in so redirect to login page with the return url
        return false;
      } else {
        // authorised so return true
        return true;
      }
    });
}
