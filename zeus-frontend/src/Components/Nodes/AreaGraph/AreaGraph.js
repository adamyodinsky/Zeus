import React from 'react';
import Chart from 'react-google-charts';
import areaGraph from './AreaGraph.module.scss'

// small helpers functions
const convertToNumber = (str) => {
    return Number(str.replace(/\D/g, ""));
};

const min = (a, b) => {
    return a < b ? a : b;
};

const capacity = 100;
const lengthLimit = 500; // TODO make it an external config
const options = {};

const columns = [
    {
        type: "datetime"
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


    const data = [];
    const usageArr = [];
    const requestArr = [];
    const limitArr = [];
    const dateArray = [];

    data.push(columns);

    for (let i=0; i<dataLength; i++) {
        let tmpFormal  = props.formal[i];

        requestArr.unshift(tmpFormal[props.dataType].request);
        limitArr.unshift(tmpFormal[props.dataType].limit);
        dateArray.unshift(tmpFormal.date);
        usageArr.unshift((props.real[i])[props.dataType]);
    }

    for (let i=0; i<dataLength; i++) {
        data.push([new Date(dateArray.pop()), convertToNumber(requestArr.pop()[1]), capacity, convertToNumber(usageArr.pop()[1]), convertToNumber(limitArr.pop()[1])]);
    }

    return (
        <div className={areaGraph.box}>
            <Chart
                className={areaGraph.chart}
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
