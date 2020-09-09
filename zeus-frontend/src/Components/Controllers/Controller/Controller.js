import React from 'react';
import Container from '../Container/Container';
import controller from './Controller.module.scss'
import axios from 'axios';

class Controller extends React.Component {

  state = {
    data: null
  };

  componentDidMount() {
    this.getControllerState(this.props.controller).then((data) => {
      if (data) {
        this.setState({
          data: data.data
        }, () => {
        });
      }
    });
  }

    getControllerState = async (controller) => {
      const url = `http://localhost:3001/controllerUsage?name=${controller.name}&namespace=${controller.namespace}&kind=${controller.kind}&cluster=${controller.cluster}`;
    try {
      const response = await axios.get(`${url}`);
      return response.data;
    } catch (e) {
      console.log('ERROR: could not get deployments state object');
      console.log(e.stack)
    }
    };

  render() {
    let renderedContainers = [];

    if (this.state.data) {
      // console.log(this.state.data);
      renderedContainers = this.state.data[0].containers.map((container, i) => {
        return (
            <Container key={i} data={this.state.data} index={i}/>
        )
      });
    }

    return(
      <div className={controller.background}>
        <div className={controller.deployment}>
          <div className={controller.info_box}>
            <span className={controller.spanText}><strong>Controller:</strong> {this.props.controller.name} </span>
            <div><strong>Cluster:</strong> {this.props.controller.cluster}</div>
            <div><strong>Kind:</strong> {this.props.controller.kind}</div>
            <div><strong>Namespace:</strong> {this.props.controller.namespace}</div>
            <div><strong>Replicas:</strong> {this.props.controller.replicas}</div>
          </div>
          {renderedContainers}
        </div>
      </div>
  );
  }



};

export default Controller;
