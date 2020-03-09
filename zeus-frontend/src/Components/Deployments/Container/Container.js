import React from 'react';
import container from './Container.module.scss';
import AreaGraphDeployment from '../AreaGraph/AreaGraphDeployment';
import AreaGraph2 from '../../Nodes/AreaGraph/AreaGraph2';
// import BarGraph from '../BarGraph/BarGraph';

const Container = props => {
  return (
      <div className={container.box}>
        <div className={container.requests_txt_block}>
          <div className={container.title_container}>
            <strong>Container:</strong> {props.container.container_name}
          </div>
        </div>
          <AreaGraphDeployment
              real={props.container.usage_samples}
              formal={props.container.resources}
              dataType={'cpu'}
              stepSizeY={200}
              stepSizeX={10}
          />
          <AreaGraphDeployment
              real={props.container.usage_samples}
              formal={props.container.resources}
              dataType={'memory'}
              stepSizeY={200}
              stepSizeX={10}
          />
          {/*<BarGraph state={props.state} />*/}
      </div>
  );
};

export default Container;
