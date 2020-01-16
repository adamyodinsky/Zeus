import React from 'react';
import container from './Container.module.scss'
import BarGraph from '../../BarGraph/BarGraph';

const Container = (props) => {
  return(
      <div>
        <span className={container.spanText}><strong>Container:</strong> {props.state.name} </span>
        <BarGraph resources={props.state.resources} />
      </div>
  );
};

export default Container;
