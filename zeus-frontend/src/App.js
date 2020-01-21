import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments'
import axios from 'axios'
import Header from './Components/Header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from "react-router-dom";
import NoMatch from './Components/noMatch/NoMatch';


class App extends React.Component {
  state = {
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

  componentDidMount() {
    this.getQuote();
  }

  render () {
    return (
        <div className="App">
          <Header/>
          <Router>
            <Switch>
              <Route exact path="/" name="PORUS"> <Deployments/> </Route>
              <Route render={(props) => (<NoMatch {...props} quote={this.state.quote} />)}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
