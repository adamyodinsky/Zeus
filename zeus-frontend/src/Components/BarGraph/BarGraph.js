import React from "react";
import { Chart } from "react-google-charts";
import barGraph from './BarGraph.module.scss'

const BarGraph = props => {

  const data = [
    ['', "Request", "Usage"],
    [
      "CPU",
      props.state.resources.sum.requests.cpu,
      props.state.usage_samples[0].sum.cpu
    ],
    [
      "RAM",
      props.state.resources.sum.requests.memory,
      props.state.usage_samples[0].sum.memory
    ]
  ];
  let opt = {
    bars: 'horizontal'
  };

  console.log(props.resources);
  return (
    <div className={barGraph.box}>
      <Chart className={barGraph.chart} chartType="Bar" width={"50vw"} height={"8rem"} data={data} options={opt} />
    </div>
  );
};

export default BarGraph;
