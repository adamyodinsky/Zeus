import React from 'react';
import Deployment from './Deployment/Deployment'
// import deployments from './Deployments.module.scss'

const Deployments = (props) => {
  const renderedDeployments = props.state.data.map((deployment, i) => {
    return (
        <Deployment key={i} state={deployment}/>
    )
  });

  return(
      <div>
        {renderedDeployments}
      </div>
  );
};

export default Deployments;
