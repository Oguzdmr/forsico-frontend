import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    const tokenExpiration = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    const isTokenExpired = Date.now() > tokenExpiration;

    if (isTokenExpired) {
      localStorage.removeItem("token");
      window.location.href = "/"; 
      return Promise.reject(new Error("Token expired"));
    }
  }

  return originalFetch(...args);
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
