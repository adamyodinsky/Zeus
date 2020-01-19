import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments'
import axios from 'axios'
import Header from './Components/Header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NoMatch from './Components/noMatch/NoMatch';

class App extends React.Component {
  state = {
    mainState: '',
    quote: {
      quote: '',
      author: ''
    }
  };

  getQuote = async () => {
    const url = 'https://quotes.rest/qod';
    try {
      const response = await axios.get(url);
      this.setState({
        quote: {
          quote: response.data.contents.quotes[0].quote,
          author: response.data.contents.quotes[0].author
        }});
    } catch (e) {
      console.log("ERROR, can't get quote!");
    }
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
    this.getQuote();
  }

    render () {
    return (
        <div className="App">
          <Header/>
          <Router>
            <Switch>
              <Route exact path="/"
                     name="PORUS"
                     render={(props) => (this.state.mainState && <Deployments {...props} state={this.state.mainState} />)
                     }/>
              <Route render={(props) => (<NoMatch {...props} quote={this.state.quote} />)}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
