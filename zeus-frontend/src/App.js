import React from 'react';
import './App.css';
import Pods from './Components/Pods/Pods'
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
          {this.state.mainState && <Pods state={ this.state.mainState } />}
        </div>
    );
  }
}

export default App;
