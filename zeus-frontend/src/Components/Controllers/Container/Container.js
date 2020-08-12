import React from 'react';
import container from './Container.module.scss';
import AreaGraphDeployment from '../AreaGraph/AreaGraphDeployment';

const Container = props => {
  // TODO - from here start to parse the new data structure of the container, then continue from  there
  console.log(props);
  return (
      <div className={container.box}>
        <div className={container.requests_txt_block}>
          <div className={container.title_container}>
            <strong>Container:</strong> {props.container.container_name}
          </div>
        </div>
        <section className={container.box_graph}>
        <AreaGraphDeployment
              real={props.container.usage_samples}
              formal={props.container.resources}
              dataType={'cpu'}
              stepSizeY={200}
              stepSizeX={10}
          />
          <div className={container.separator}/>
          <AreaGraphDeployment
              real={props.container.usage_samples}
              formal={props.container.resources}
              dataType={'memory'}
              stepSizeY={200}
              stepSizeX={10}
          />
        </section>
      </div>
  );
};

export default Container;
