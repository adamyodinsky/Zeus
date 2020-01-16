import React from "react";
import { Chart } from "react-google-charts";



const BarGraph = (props) => {
  if( props.resources.requests && props.resources.current ) {
    const data = [
      ["Container", "Request", "Usage"],
      ["CPU", props.resources.requests.cpu, props.resources.current.cpu],
      ["Memory", props.resources.requests.memory, props.resources.current.memory]
    ];

    return (
        <div className="App">
          <Chart chartType="BarChart" width={"95vw"} height={"12rem"}
                 data={data}/>
        </div>
    );
  } else {
    return <div></div>
  }
};

export default BarGraph;
