import React from 'react';
import LineChart from '../../LineChart/LineChart';
import areaGraph from './AreaGraph.module.scss';

const lengthLimit = 500; // TODO make it an external config

const computeCapacity = (props) => {
  let usageValue = convertToNumber(props.real[0][props.dataType][0]);
  let usagePercent = convertToNumber(props.real[0][props.dataType][1]);
  return Math.ceil(usageValue * (100 / usagePercent));
};

const getTitle = (props) => {
  return props.dataType === 'cpu' ? 'CPU' : 'Memory';
};

const getDataLength = (props) => {
  let dataLength;
  if (props.formal.length > lengthLimit || props.real.length > lengthLimit) {
    dataLength = lengthLimit;
  } else {
    dataLength = min(props.formal.length, props.real.length);
  }

  return dataLength;
};

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ''));
};

const min = (a, b) => {
  return a < b ? a : b;
};

const createDataSets = (props) => {
  const requestArr = [];
  const usageArr = [];
  const timeArr = [];
  const dataLength = getDataLength(props);
  const capacity = computeCapacity(props);

  for (let i = 0; i < dataLength; i++) {
    const tmpFormal = props.formal[i];
    const date = new Date(tmpFormal.date);

    let usage = convertToNumber((props.real[i])[props.dataType][0]);
    let request = convertToNumber(tmpFormal.resources[props.dataType].request[0]);

    if (props.dataType === 'memory') {
      request = Math.ceil(request / Math.pow(2, 20));
    }

    requestArr.unshift({
          x: date,
          y: request,
        },
    );

    usageArr.unshift({
      x: date,
      y: usage,
    });

    timeArr.unshift(date);
  }

  return {
    datasets: [
      {
        label: 'Request',
        data: requestArr,
        color: '#66b3ff', // blue
      },
      {
        label: 'Usage',
        data: usageArr,
        color: '#ff6666', // red
      }
    ],
    time: timeArr,
    capacity: capacity
  };
};

const AreaGraph2 = (props) => {
  let data = createDataSets(props);
  let title = getTitle(props);
  // console.log(props);

  return (
      <div className={areaGraph.box}>
        <LineChart
            datasets={data.datasets}
            time={data.time}
            title={title}
            capacity={data.capacity}
            stepSizeY={props.stepSizeY}
            stepSizeX={props.stepSizeX}
        />
      </div>
  );
};

export default AreaGraph2;
