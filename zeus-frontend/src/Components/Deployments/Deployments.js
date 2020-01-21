import React from 'react';
import Deployment from './Deployment/Deployment'
import axios from 'axios';
// import deployments from './Deployments.module.scss'

class Deployments extends React.Component {

  state = {};


  getDeploymentsState = async () => {
    const url =  `http://localhost:3001/state`;
    try {
      const response = await axios.get(`${url}`);
      return response.data;
    } catch (e) {
      console.log('ERROR: could not get main state object');
      console.log(e)
    }
  };


  componentDidMount() {
    // get and set deployments state
    this.getDeploymentsState().then((data)=> {
      this.setState(data)
    });
  }

  render() {
    let renderedDeployments = [];
    if(this.state.data) {
      renderedDeployments = this.state.data.map((deployment, i) => {
        return (
            <Deployment key={i} state={deployment}/>
        )
      });
    }

    return(
        <div>
          {renderedDeployments}
        </div>
    );
  }
}

export default Deployments;
