import React from 'react';
import Chart from 'react-google-charts';

// small helpers functions
const convertToNumber = (str) => {
    return Number(str.replace(/\D/g, ""));
};

const min = (a, b) => {
    return a < b ? a : b;
};


const capacity = 100;
const lengthLimit = 500; // TODO make it an external config

const columns = [
    {
        type: "datetime",
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
    let dataLength;

    if(props.formal.length > lengthLimit && props.real.length > lengthLimit) {
        dataLength = lengthLimit;
    } else {
        dataLength = min(props.formal.length, props.real.length);
    }


    const options = {
        chart: {
            title: `${props.name}`,
            subtitle: 'CPU Consumption in Percentage',
        },
        // series: {
        //     // Gives each series an axis name that matches the Y-axis below.
        //     0: { axis: 'CPU' }
        // },
        // axes: {
        //     // Adds labels to each axis; they don't have to match the axis names.
        //     y: {
        //         CPU: { label: 'CPU %' },
        //     },
        // },
    };

    const data = [];
    const usageArr = [];
    const requestArr = [];
    const limitArr = [];
    const dateArray = [];

    data.push(columns);

    for (let i=0; i<dataLength; i++) {
        let tmpFormal  = props.formal.pop();
        requestArr.push(tmpFormal[props.dataType].request);
        limitArr.push(tmpFormal[props.dataType].limit);
        dateArray.push(tmpFormal.date);
        usageArr.push((props.real.pop())[props.dataType]);
    }

    for (let i=0; i<dataLength; i++) {
        data.push([new Date(dateArray.pop()), convertToNumber(requestArr.pop()[1]), capacity, convertToNumber(usageArr.pop()[1]), convertToNumber(limitArr.pop()[1])]);
    }



    return (
        <div>
            <Chart
                chartType="Line"
                width={"40vw"}
                height={"40rem"}
                data={data}
                options={options}
                loader={<div>Loading Graph...</div>}
                />
        </div>
    )
};

export default AreaGraph;
