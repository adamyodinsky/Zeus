import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments'
import axios from 'axios'

class App extends React.Component {

  state = {
    mainState: ''
  };


  getMainState = async () => {
    const url =  "http://localhost:3001/state";
    try {
      const response = await axios.get(url);
      console.log(response.data);
      this.setState({
        mainState :response.data
      });
    } catch (e) {
      console.log('ERROR: could not get main state object');
      console.log(e)
    }
  };

  componentDidMount() {
    this.getMainState();
  }


    render () {
    return (
        <div className="App">
          <h1>Porus</h1>
          {this.state.mainState && <Deployments state={ this.state.mainState } />}
        </div>
    );
  }
}

export default App;
