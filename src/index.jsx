import * as React from "react";
import {render} from "react-dom";
import {AppComponent} from "./components/appComponent";
//import {Slidebar} from "./components/sidebar";

window.React = React;
render(
    <AppComponent/>
  ,document.getElementById("root")
);