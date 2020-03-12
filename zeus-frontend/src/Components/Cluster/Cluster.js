import React from 'react';
import clusterStyle from './Cluster.module.scss';
import ClusterLineChart from './ClusterLineChart/ClusterLineChart';
import axios from 'axios';

class Cluster extends React.Component {
  state = {
    data: {
      usage: null,
      formal: null
    }
  };

  componentDidMount() {
    this.getClusterData().then((data) => {
      if (data) {
        this.setState({
          data: data
        }, () => {
          // console.log(this.state);
        });
      }
    });
  }

  getClusterData = async () => {
    let usageResponse, formalResponse;
    const usageUrl = `http://localhost:3001/clusterUsage`;
    const formalUrl = `http://localhost:3001/clusterRequest`;

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
      console.log('ERROR: could not get cluster state object');
      console.log(e.stack);
    }
    return {
      usage: usageResponse,
      formal: formalResponse,
    };
  };

  render() {
    let ClusterLineChartRendered;
    // data.usage[""0""].cluster
    if (this.state.data.formal && this.state.data.usage) {
      ClusterLineChartRendered =
          <div className={clusterStyle.box}>
            <div className={clusterStyle.title_node}>{this.state.data.formal[0].cluster}</div>
              <section className={clusterStyle.box_graph}>
                <ClusterLineChart
                    formal={this.state.data.formal}
                    real={this.state.data.usage}
                    name={this.state.data.formal[0].cluster}
                    dataType={'cpu'}
                    stepSizeY={36000}
                    stepSizeX={5}
                />
                <div className={clusterStyle.separator}/>
                <ClusterLineChart
                    formal={this.state.data.formal}
                    real={this.state.data.usage}
                    name={this.state.data.formal[0].cluster}
                    dataType={'memory'}
                    stepSizeY={160000}
                    stepSizeX={5}
                />
              </section>
          </div>
    }

    return (
        <div>
          {ClusterLineChartRendered}
        </div>
    )
  }
};

export default Cluster;
