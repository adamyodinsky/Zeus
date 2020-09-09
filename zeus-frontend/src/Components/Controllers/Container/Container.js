import React from 'react';
import container from './Container.module.scss';
import AreaGraphDeployment from '../AreaGraph/AreaGraphDeployment';

const Container = props => {
  const samples = props.data.map((element) => {
    return {
      name: element.containers[props.index].name,
      real: element.containers[props.index].usage,
      formal: element.containers[props.index].resources,
      replicas: element.replicas,
      date: element.date
    }
  });

  return (
      <div className={container.box}>
        <div className={container.requests_txt_block}>
          <div className={container.title_container}>
            <strong>Container:</strong> {props.data[0].containers[props.index].name}
          </div>
        </div>
        <section className={container.box_graph}>
        <AreaGraphDeployment
              samples={samples}
              dataType={'cpu'}
              stepSizeY={200}
              stepSizeX={10}
          />
          <div className={container.separator}/>
          <AreaGraphDeployment
              samples={samples}
              dataType={'memory'}
              stepSizeY={200}
              stepSizeX={10}
          />
        </section>
      </div>
  );
};

export default Container;
