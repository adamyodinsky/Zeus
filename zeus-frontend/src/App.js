import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments'
import Header from './Components/Header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from "react-router-dom";
import NoMatch from './Components/noMatch/NoMatch';


class App extends React.Component {

  render () {
    return (
        <div className="App">
          <Header/>
          <Router>
            <Switch>
              <Route exact path="/" name="PORUS"  component={Deployments}/>
              <Route name="PORUS">
                <NoMatch/>
              </Route>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
