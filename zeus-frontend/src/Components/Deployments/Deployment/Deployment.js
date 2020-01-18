import React from 'react';
import Container from '../Container/Container';
import pod from './Deployment.module.scss'

const Deployment = (props) => {
  const renderedContainers = props.state.containers.map((container, i) => {
    return (
        <Container key={i} state={container}/>
    )
  });

  return(
      <div>
        <div className={pod.pod}>
          <span className={pod.spanText}><strong>Deployment:</strong> {props.state.deployment_name} </span>
            {renderedContainers}
        </div>
      </div>
  );
};

export default Deployment;
