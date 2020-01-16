import React from 'react';
import container from './Container.module.scss'

const Container = (props) => {
  return(
      <div>
        <span className={container.spanText}> Container: {props.state.name} </span>
      </div>
  );
};

export default Container;
