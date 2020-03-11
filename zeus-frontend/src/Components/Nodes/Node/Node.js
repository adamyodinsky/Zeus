import React from 'react';
import nodeStyle from './Node.module.scss';
import AreaGraph2 from '../AreaGraph/AreaGraph2';
import axios from 'axios';

class Node extends React.Component {

  state = {};

  componentDidMount() {
    this.getNodeData(this.props).then((data) => {
      if (data) {
        this.setState({
          real: data.usage,
          formal: data.formal,
        }, () => {
          // console.log(this.state);
        });
      }
    });
  }

  getNodeData = async (props) => {
    let usageResponse, formalResponse;
    const usageUrl = `http://localhost:3001/nodesUsage?name=${props.state.name}&cluster=${props.state.cluster}&page=page=0`;
    const formalUrl = `http://localhost:3001/nodesRequest?name=${props.state.name}&cluster=${props.state.cluster}&page=page=0`;

    try {
      usageResponse = axios.get(`${usageUrl}`);
      formalResponse = axios.get(`${formalUrl}`);

      // eslint-disable-next-line
      await Promise.allSettled([usageResponse, formalResponse]).
          then((result) => {
            usageResponse = result[0].value.data.data;
            formalResponse = result[1].value.data.data;
          });
    } catch (e) {
      console.log('ERROR: could not get nodes state object');
      console.log(e.stack);
    }

    return {
      usage: usageResponse,
      formal: formalResponse,
    };
  };

  render() {
    let areaGraph;

    if (this.state.formal && this.state.real) {
      areaGraph =
          <section className={nodeStyle.box_graph}>
            <AreaGraph2
                formal={this.state.formal}
                real={this.state.real}
                name={this.props.state.name}
                dataType={'cpu'}
                stepSizeY={3600}
                stepSizeX={5}
            />
            <div className={nodeStyle.separator}/>
            <AreaGraph2
                formal={this.state.formal}
                real={this.state.real}
                name={this.props.state.name}
                dataType={'memory'}
                stepSizeY={16000}
                stepSizeX={5}
            />
          </section>;
    }

    return (

        <div>
          <div className={nodeStyle.box}>
            <div className={nodeStyle.title_node}>{this.props.state.name}</div>
            <section className={nodeStyle.box_graph}>
              {areaGraph}
            </section>
          </div>
        </div>
    )
        ;
  }
};

export default Node;
