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
        label: "Time"
    },
    {
        label: "Request",
        type: "number"
    },
    {
        label: "Capacity",
        type: "number"
    },
    {
        label: "Usage",
        type: "number"
    },
    {
        label: "Limit",
        type: "number"
    }
];

const AreaGraph = (props) => {

    const options = {
        // chart: {
        //     title: `${props.name}`,
        //     subtitle: 'CPU Consumption in Percentage',
        // },
        series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: 'CPU' }
        },
        axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
                CPU: { label: 'CPU %' },
            },
        },
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

        for (let i=0; i<dataLength; i++) {
            data.push([i, convertToNumber(requestArr.pop()[1]), capacity, convertToNumber(usageArr.pop()[1]), convertToNumber(limitArr.pop()[1])]);
        }
    } else {
        return <div> Node: {props.name} - There is not enough data </div>
    }


    return (
        <div>
            <Chart
                chartType="Line"
                width={"40vw"}
                height={"20rem"}
                data={data}
                options={options}
                loader={<div>Loading Graph...</div>}
                />
        </div>
    )
};

export default AreaGraph;