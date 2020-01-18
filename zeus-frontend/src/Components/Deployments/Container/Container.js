import React from 'react';
import container from './Container.module.scss'
import BarGraph from '../../BarGraph/BarGraph';

const Container = (props) => {
  return(
      <div>
        <span className={container.spanText}><strong>Container:</strong> {props.state.container_name} </span>
        <BarGraph state={props.state} />
      </div>
  );
};

export default Container;
