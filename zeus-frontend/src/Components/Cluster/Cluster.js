import React from 'react';
import clusterStyle from './Cluster.module.scss';
import ClusterLineChart from './ClusterLineChart/ClusterLineChart';
import axios from 'axios';

class Cluster extends React.Component {
  state = {
    data: {
      usage: null,
      formal: null,
    },
  };

  componentDidMount() {
    this.getClusterData().then((data) => {
      if (data) {
        this.setState({
          data: data,
        }, () => {
          // console.log(this.state);
        });
      }
    });
  }

  computeCostForMonth = (formalArr, usageArr) => {
    let capacityAvg = formalArr.reduce(
        (sum, currObj) => sum + currObj.capacity.cpu, 0) / formalArr.length;
    let avgUsage = usageArr.reduce((sum, currObj) => sum + currObj.cpu, 0) /
        usageArr.length;

    let totalNodes = Math.ceil((capacityAvg / 7200));
    let neededNodes = Math.round((avgUsage / 7200) * 100) / 100;
    let unNeededNodes = Math.round(((capacityAvg - avgUsage) / 7200) * 100) / 100;

    let totalSpent = Math.round(totalNodes * 0.40 * 24 * 30);
    let realNeed = Math.round( neededNodes * 0.40 * 24 * 30);
    let couldBeSaved = Math.round((unNeededNodes* 0.40 * 24 * 30));

    return {
      money: {
        total: totalSpent,
        real: realNeed,
        save: couldBeSaved,
      },
      nodes: {
        total: totalNodes,
        real: neededNodes,
        save: unNeededNodes
      }
    }

  };

  getClusterData = async () => {
    let usageResponse, formalResponse;
    const usageUrl = `http://localhost:3001/clusterUsage?`;
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
    let ClusterLineChartRendered = <div/>;
    let costDiv = <div/>;

    if (this.state.data.formal && this.state.data.usage) {
      ClusterLineChartRendered = (
          <div className={clusterStyle.box + ' ' +  clusterStyle.centerText}>
            <div
                className={clusterStyle.title_node}>{this.state.data.formal[0].cluster}</div>
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
      );

      let cost = this.computeCostForMonth(this.state.data.formal,
          this.state.data.usage);

      costDiv = (
          <div className={clusterStyle.box + ' ' + clusterStyle.costs}>
            <h2>Month Estimations by Average Usage</h2>
            <div className={clusterStyle.cost_innerBox}>
              <h3>Nodes:</h3>
              <section>Total Acquired : {cost.nodes.total}</section>
              <section>Real Need: {cost.nodes.real}</section>
              <section>Could Be Evicted: {cost.nodes.save}</section>
            </div>
            <div className={clusterStyle.cost_innerBox}>
              <h3>Money:</h3>
              <section>Total: ${cost.money.total}</section>
              <section>Could Be: ${cost.money.real}</section>
              <section>You Can Save: ${cost.money.save}</section>
            </div>
          </div>
      );
    }

    return (
        <div>
          {ClusterLineChartRendered}
          {costDiv}
        </div>
    );
  }
};

export default Cluster;
