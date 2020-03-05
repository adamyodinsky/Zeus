import React from 'react';
import LineChart from '../../LineChart/LineChart';

const lengthLimit = 500; // TODO make it an external config

const computeCapacity = (props) => {
  let usageValue = convertToNumber(props.real[0][props.dataType][0]);
  let usagePercent = convertToNumber(props.real[0][props.dataType][1]);
  return Math.ceil(usageValue * (100 / usagePercent));
};

const getTitle = (props) => {
  return props.dataType === "cpu"? "CPU" : "Memory"
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

  for (let i = 0; i < dataLength; i++) {
    let tmpFormal = props.formal[i];
    let date = new Date(tmpFormal.date);

    requestArr.unshift({
          x: date,
          y: convertToNumber(tmpFormal[props.dataType].request[0]),
        },
    );

    usageArr.unshift({
      x: date,
      y: convertToNumber((props.real[i])[props.dataType][0]),
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
      },
    ],
    time: timeArr,
  };

};

const AreaGraph2 = (props) => {
  let data = createDataSets(props);
  let capacity = computeCapacity(props);
  let title = getTitle(props);

  return (
      <LineChart
          datasets={data.datasets}
          time={data.time}
          capacity={capacity}
          title={title}
      />
  );
};

export default AreaGraph2;
