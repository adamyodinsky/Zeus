import React from 'react';
import LineChart from '../../LineChart/LineChart';
import areaGraph from './ClusterLineChart.module.scss';

const lengthLimit = 100; // TODO make it an external config

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


const min = (a, b) => {
  return a < b ? a : b;
};

const createDataSets = (props) => {
  const requestArr = [];
  const usageArr = [];
  const timeArr = [];
  const dataLength = getDataLength(props);
  const capacity = props.formal[0].capacity[props.dataType];

  for (let i = 0; i < dataLength; i++) {
    const tmpFormal = props.formal[i];
    const date = new Date(tmpFormal.date);

    let usage = (props.real[i])[props.dataType];
    let request = tmpFormal.resources[props.dataType].request;

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

const ClusterLineChart = (props) => {
  let data = createDataSets(props);
  let title = getTitle(props);

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

export default ClusterLineChart;
