import React from 'react';
import Pod from '../Pods/Pod/Pod'
// import pods from './Pods.module.scss'

const Pods = (props) => {
  const renderedPods = props.state.map((pod, i) => {
    return (
        <Pod key={i} state={pod}/>
    )
  });

  return(
      <div>
        {renderedPods}
      </div>
  );
};

export default Pods;
