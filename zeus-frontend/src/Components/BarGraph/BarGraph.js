import React from "react";
import { Chart } from "react-google-charts";



const BarGraph = (props) => {


  if( props.resources.requests && props.resources.current ) {

    let cpu_request = Number(props.resources.requests.cpu.replace('m', ''));
    let cpu_current = Number(props.resources.current.cpu.replace('m', ''));
    let memory_request = Number(props.resources.requests.memory.replace('Mi', ''));
    let memory_current = Number(props.resources.current.memory.replace('Mi', ''));

    const data = [
      ["Container", "Usage", "Request"],
      ["CPU", cpu_request, cpu_current],
      ["Memory", memory_request, memory_current]
    ];

    return (
        <div className="App">
          <Chart chartType="BarChart" width={"100vw"} height={"10rem"}
                 data={data}/>
        </div>
    );
  } else {
    return <div></div>
  }
};

export default BarGraph;
