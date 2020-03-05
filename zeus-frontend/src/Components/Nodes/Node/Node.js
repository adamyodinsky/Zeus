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
              />
              <AreaGraph2
                  formal={props.state.node}
                  real={props.state.usage}
                  name={props.state.name}
                  dataType={"memory"}
              />
            </section>
          </div>
        </div>
    )
};

export default Node;
