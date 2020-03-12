import React from 'react';
import Chart from 'chart.js';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.myChart.data.labels = this.props.time;
    this.myChart.data.datasets = this.props.datasets.map(dataset => {
      return {
        label: dataset.label,
        backgroundColor: dataset.color,
        borderColor: dataset.color,
        fill: false,
        data: dataset.data.map(data => data),
        pointRadius: 3,
        borderWidth: 1,
        lineTension: 0,

      };
    });
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.chartRef.current, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        // title: {
        //   display: true,
        //   text: this.props.title
        // },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                stepSize: this.props.stepSizeX,
                // unit: 'minute'
              },
              display: true,
              // scaleLabel: {
              //   display: true,
              //   labelString: 'Time'
              // },
              ticks: {
                source: 'auto',
                major: {
                  fontStyle: 'bold',
                  fontColor: '#FF0000',
                },
              },
            }],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.props.title,
              },
              ticks: {
                stepSize: this.props.stepSizeY,
                source: 'auto',
                min: 0,
                max: this.props.capacity,
                beginAtZero: true,
              },
            },
          ],
        },
      },
      data: {
        labels: this.props.time,
        datasets: this.props.datasets.map(dataset => {
          return {
            label: dataset.label,
            backgroundColor: dataset.color,
            borderColor: dataset.color,
            fill: false,
            data: dataset.data.map(data => data),
            pointRadius: 3,
            borderWidth: 1,
            lineTension: 0,

          };
        }),
      },
    });
  }

  render() {
    return <canvas ref={this.chartRef}/>;
  }
}

export default LineChart;
