import React from 'react';
import Container from '../Container/Container';
import pod from './Pod.module.scss'

const Pod = (props) => {

  const renderedContainers = props.state.containers.map((container, i) => {
    return (
        <Container key={i} state={container}/>
    )
  });

  return(
      <div>
        <div className={pod.pod}>
          <span className={pod.spanText}> Pod: {props.state.name} </span>
            {renderedContainers}
        </div>
      </div>
  );
};

export default Pod;
