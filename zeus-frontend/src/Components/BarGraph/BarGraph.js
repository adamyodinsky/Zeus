import React from "react";
import { Chart } from "react-google-charts";
// import barGraph from './BarGraph.module.scss'


const BarGraph = (props) => {
    const data = [
      ["Container", "Request", "Usage"],
      ["CPU", props.state.resources.sum.requests.cpu, props.state.usage_samples[0].sum.cpu],
      ["Memory", props.state.resources.sum.requests.memory, props.state.usage_samples[0].sum.memory]
    ];

    console.log(props.resources);
    return (
        <div className="App">
          <Chart chartType="BarChart" width={"95vw"} height={"12rem"}
                 data={data}/>
        </div>
    );

  // } else {
  //
  //   return <div>{props.resources.sum.requests.cpu + props.usage.usage_samples[0].sum.cpu}</div>
  // }
};

export default BarGraph;
