import React from 'react';
import Chart from "react-google-charts";

const convertToNumber = (str) => {
    return Number(str.replace(/\D/g, ""));
};
const capacity = 100;
const dataLength = 419;

const columns = [
    {
        type: "number",
        label: "time"
    },
    {
        label: "request",
        type: "number"
    },
    {
        label: "capacity",
        type: "number"
    },
    {
        label: "usage",
        type: "number"
    },
    {
        label: "limit",
        type: "number"
    }
];

const AreaGraph = (props) => {

    const options = {
        title: `Node: ${props.name}`,
        curveType: "function",
        legend: { position: "bottom" }
    };

    const data = [];
    const usageArr = [];
    const requestArr = [];
    const limitArr = [];

    data.push(columns);
    if(props.formal.length >= dataLength && props.real.length >= dataLength) {
        for (let i=0; i<dataLength; i++) {
            let tmpFormal  = props.formal.pop();
            requestArr.push(tmpFormal.cpu.request);
            limitArr.push(tmpFormal.cpu.limit);
            usageArr.push((props.real.pop()).cpu);
        }
        console.log(limitArr[158]);

        for (let i=0; i<dataLength; i++) {
            data.push([i, convertToNumber(requestArr.pop()[1]), capacity, convertToNumber(usageArr.pop()[1]), convertToNumber(limitArr.pop()[1])]);
        }
    } else {
        return <div> There is not enough data</div>
    }


    return (
        <div>
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
                loader={<div>Loading Graph...</div>}
                />
        </div>
    )
};

export default AreaGraph;