import React from 'react';
import Container from '../Container/Container';
import deployment from './Deployment.module.scss'

const Deployment = (props) => {
  const renderedContainers = props.state.containers.map((container, i) => {
    return (
        <Container key={i} state={container}/>
    )
  });

  return(
      <div className={deployment.background}>
        <div className={deployment.deployment}>
          <div>
            <span className={deployment.spanText}><strong>Deployment:</strong> {props.state.deployment_name} </span>
          </div>
          <div className={deployment.info_box}>
            <div><strong>Cluster:</strong> {props.state.cluster}</div>
            <div><strong>Namespace:</strong> {props.state.namespace}</div>
            <div><strong>Replicas:</strong> {props.state.replicas}</div>
          </div>
          <div className={deployment.box}></div>
          {renderedContainers}
        </div>
      </div>
  );
};

export default Deployment;
