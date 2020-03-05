import React from 'react';
import nodeStyle from './Node.module.scss'
import AreaGraph2 from '../AreaGraph/AreaGraph2';

const Node = (props) => {

    return (
        <div>
          <div className={nodeStyle.box}>
            <div className={nodeStyle.title_node}>{props.state.name}</div>
            <section className={nodeStyle.box_graph}>
              <AreaGraph2
                  formal={props.state.node}
                  real={props.state.usage}
                  name={props.state.name}
                  dataType={"cpu"}
                  stepSizeY={3600}
                  stepSizeX={30}
              />
              <div className={nodeStyle.separator}/>
              <AreaGraph2
                  formal={props.state.node}
                  real={props.state.usage}
                  name={props.state.name}
                  dataType={"memory"}
                  stepSizeY={16000}
                  stepSizeX={30}
              />
            </section>
          </div>
        </div>
    )
};

export default Node;
