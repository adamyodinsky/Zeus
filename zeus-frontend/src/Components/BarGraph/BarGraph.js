import React from "react";
import { Chart } from "react-google-charts";
import barGraph from './BarGraph.module.scss'

const BarGraph = props => {

  const requestSum  = props.state.resources.sum.requests;
  const usageSum    = props.state.usage_samples[0].sum;

  const data = [
    ['', "Request", "Usage"],
    [
      "CPU",
      requestSum.cpu,
      usageSum.cpu
    ],
    [
      "RAM",
      requestSum.memory,
      usageSum.memory
    ]
  ];
  let opt = {
    bars: 'horizontal'
  };

  return (
    <div className={barGraph.box}>
      <Chart className={barGraph.chart} chartType="Bar" width={"50vw"} height={"8rem"} data={data} options={opt} />
    </div>
  );
};

export default BarGraph;
