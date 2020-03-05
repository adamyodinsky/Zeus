import React from 'react';
import AreaGraph from "../AreaGraph/AreaGraph";
import nodeStyle from './Node.module.scss'
import AreaGraph2 from '../AreaGraph/AreaGraph2';

const Node = (props) => {

    return (
        <div>
          <div className={nodeStyle.box}>
            <div className={nodeStyle.requests_txt_block}>
              <div className={nodeStyle.title_node}>
                <strong>Node:</strong> {props.state.name}
              </div>
            </div>
            <section className={nodeStyle.box_graph}>
              <AreaGraph2
                  formal={props.state.node}
                  real={props.state.usage}
                  name={props.state.name}
                  dataType={"cpu"}
                  stepSizeY={1200}
                  stepSizeX={10}
              />
              <AreaGraph2
                  formal={props.state.node}
                  real={props.state.usage}
                  name={props.state.name}
                  dataType={"memory"}
                  stepSizeY={6000}
                  stepSizeX={10}
              />
            </section>
          </div>
        </div>
    )
};

export default Node;
