import React from 'react';
import LineChart from '../../LineChart/LineChart';
import areaGraph from './AreaGraphDeployment.module.scss';

const lengthLimit = 200; // TODO make it an external config

const getTitle = (props) => {
  return props.dataType === 'cpu' ? 'CPU' : 'Memory';
};

const getDataLength = (props) => {
  let dataLength;
  if (props.real.length > lengthLimit) {
    dataLength = lengthLimit;
  } else {
    dataLength = min(props.formal.length, props.real.length);
  }

  return dataLength;
};


const min = (a, b) => {
  return a < b ? a : b;
};

const createDataSets = (props) => {
  const usageArr = [];
  const timeArr = [];
  const dataLength = getDataLength(props);

  let request = props.formal.sum.requests[props.dataType];

  for (let i = 0; i < dataLength; i++) {
    const date = new Date(props.real[i].date);
    const usage = props.real[i].sum[props.dataType];

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
        data: [{x: timeArr[0], y: request}, {x: timeArr[timeArr.length - 1], y: request}],
        color: '#66b3ff', // blue
      },
      {
        label: 'Usage',
        data: usageArr,
        color: '#ff6666', // red
      },
    ],
    time: timeArr
  };
};

const AreaGraphDeployment = (props) => {
  let data = createDataSets(props);
  let title = getTitle(props);
  console.log(data);

  return (
      <div className={areaGraph.box}>
        <LineChart
            datasets={data.datasets}
            time={data.time}
            title={title}
            stepSizeY={props.stepSizeY}
            stepSizeX={props.stepSizeX}
        />
      </div>
  );
};

export default AreaGraphDeployment;
