import React from "react";
import "../../css/spinner.css";

const Fatal = props => (
  <h2 className="center rojo">
    {props.msg}
  </h2>
);

export default Fatal;
