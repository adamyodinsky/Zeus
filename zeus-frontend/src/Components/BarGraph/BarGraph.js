import React from "react";
import barGraph from "./BarGraph.module.scss";
import { Chart } from "react-google-charts";

const BarGraph = (props) => {

  const data = [
    ["Container", "Mem Usage", "Mem Request", "CPU Usage", "CPU Request"],
    ["dev-tools-container", 10, 50, 30, 60],
    ["dev-tools-container", 10, 50, 30, 60],
    ["dev-tools-container", 10, 50, 30, 60],
    ["dev-tools-container", 10, 50, 30, 60],
    ["dev-tools-container", 10, 50, 30, 60],
    ["dev-tools-container", 10, 50, 30, 60],
  ];

  return (
    <div className="App">
      <Chart chartType="BarChart" width={"100%"} height={"100rem"} data={data} />
    </div>
  );
};

export default BarGraph;
