import React from 'react';
import Container from '../Container/Container';
import deployment from './Controller.module.scss'

const Controller = (props) => {
  const renderedContainers = props.state.containers.map((container, i) => {
    return (
        <Container key={i} container={container}/>
    )
  });

  return(
      <div className={deployment.background}>
        <div className={deployment.deployment}>
          <div className={deployment.info_box}>
            <span className={deployment.spanText}><strong>Deployment:</strong> {props.state.deployment_name} </span>
            <div><strong>Cluster:</strong> {props.state.cluster}</div>
            <div><strong>Namespace:</strong> {props.state.namespace}</div>
            <div><strong>Replicas:</strong> {props.state.replicas}</div>
          </div>
          {renderedContainers}
        </div>
      </div>
  );
};

export default Controller;
