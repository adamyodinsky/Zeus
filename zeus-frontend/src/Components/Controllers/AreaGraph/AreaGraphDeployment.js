import React from 'react';
import LineChart from '../../LineChart/LineChart';
import areaGraph from './AreaGraphDeployment.module.scss';

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

const getTitle = (props) => {
  return props.dataType === 'cpu' ? 'CPU' : 'Memory';
};

const createDataSets = (props) => {
  const usageArr = [];
  const requestArr = [];
  const timeArr = [];
  let request

  for (let i = 0; i < props.samples.length; i++) {
    const date = new Date(props.samples[i].date);
    const usage = props.samples[i].containers[0].usage.sum[props.dataType];

    if (props.samples[i].containers[0].resources) {
       request = convertToNumber(props.samples[i].containers[0].resources.requests[props.dataType]) * props.samples[i].replicas;
    }

    usageArr.unshift({
      x: date,
      y: usage,
    });

    requestArr.unshift({
      x: date,
      y: request,
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
    time: timeArr
  };
};

const AreaGraphDeployment = (props) => {

  let data = createDataSets(props);
  let title = getTitle(props);

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
