import React from 'react';
// import Chart from 'react-google-charts';
import areaGraph from './AreaGraph.module.scss';
import Chart from 'chart.js';

// small helpers functions
const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ''));
};

const computeCapacity = (props) => {
  let usageValue = convertToNumber(props.real[0][props.dataType][0]);
  let usagePercent = convertToNumber(props.real[0][props.dataType][1]);
  return Math.ceil(usageValue * (100 / usagePercent));
};

const min = (a, b) => {
  return a < b ? a : b;
};

const lengthLimit = 500; // TODO make it an external config

const AreaGraph = (props) => {
  let xLabel;
  const data = [];
  const usageArr = [];
  const requestArr = [];
  const dateArray = [];
  const options = {};
  let dataLength;

  if (props.dataType === 'cpu') {
    xLabel = 'CPU (m)';
  } else {
    xLabel = "Memory (Mi)"
  }

  const columns = [
    {
      type: 'datetime',
      label: xLabel,
    },
    {
      label: 'Request',
      type: 'number',
    },
    {
      label: 'Usage',
      type: 'number',
    },
    {
      label: 'Capacity',
      type: 'number',
    },
  ];

  const capacity = computeCapacity(props);

  if (props.formal.length > lengthLimit && props.real.length > lengthLimit) {
    dataLength = lengthLimit;
  } else {
    dataLength = min(props.formal.length, props.real.length);
  }

  data.push(columns);

  for (let i = 0; i < dataLength; i++) {
    let tmpFormal = props.formal[i];
    requestArr.unshift(tmpFormal[props.dataType].request);
    dateArray.unshift(tmpFormal.date);
    usageArr.unshift((props.real[i])[props.dataType]);
  }

  for (let i = 0; i < dataLength; i++) {
    const datetime = new Date(dateArray.pop());
    const usage = convertToNumber(usageArr.pop()[0]);
    let request = convertToNumber(requestArr.pop()[0]);

    if (props.dataType === 'memory') {
      request = Math.ceil(request / Math.pow(2, 20));
    }

    data.push([datetime, request, usage, capacity]);
  }

  return (
      <div className={areaGraph.box}>
        <Chart
            className={areaGraph.chart}
            chartType="Line"
            width={'47vw'}
            height={'25rem'}
            data={data}
            options={options}
            loader={<div>Loading Graph...</div>}
        />
      </div>
  );
};

export default AreaGraph;
