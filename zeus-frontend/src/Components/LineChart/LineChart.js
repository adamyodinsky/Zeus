import React from 'react';
import Chart from 'chart.js';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.myChart.data.labels = this.props.data.map(d => d.time);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.chartRef.current, {
      type: 'line',
      options: {
        responsive: true,
        title: {
          display: true,
          text: this.props.title
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'value'
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: this.props.capacity
              }
            }
          ]
        }
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
