import React from 'react';
import Container from '../Container/Container';
import controller from './Controller.module.scss'
import axios from 'axios';

const getControllerState = async (controller) => {
  const url = `http://localhost:3001/controllerUsage?name=${controller.name}&namespace=${controller.namespace}&kind=${controller.kind}&cluster=${controller.cluster}`;
  try {
    const response = await axios.get(`${url}`);
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.log('ERROR: could not get deployments state object');
    console.log(e.stack)
  }
};

const Controller = async (props) => {

  const controllerPayload = await getControllerState(props.controller);
  // console.log(controllerPayload);
  const renderedContainers = props.controller.data.containers.map((container, i) => {
    return (
        <Container key={i} container={container}/>
    )
  });

  return(
      <div className={controller.background}>
        <div className={controller.deployment}>
          <div className={controller.info_box}>
            <span className={controller.spanText}><strong>Controller:</strong> {props.controller.name} </span>
            <div><strong>Cluster:</strong> {props.controller.cluster}</div>
            <div><strong>Kind:</strong> {props.controller.replicas}</div>
            <div><strong>Namespace:</strong> {props.controller.namespace}</div>
            <div><strong>Replicas:</strong> {props.controller.replicas}</div>
          </div>
          {renderedContainers}
        </div>
      </div>
  );
};

export default Controller;
