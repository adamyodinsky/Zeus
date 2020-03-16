import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments'
import Header from './Components/Header/Header';
import NoMatch from './Components/noMatch/NoMatch';
import Nodes from "./Components/Nodes/Nodes";
import Cluster from './Components/Cluster/Cluster';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Navigation from './Components/Navigation/Navigation';


class App extends React.Component {

  render () {
    return (
        <div className="App">
          <Header/>
          <Router>
            <Navigation/>
            <Switch>
              <Route exact path="/" name="PORUS"  component={Cluster}/>
              <Route exact path="/nodes" name="PORUS" component={Nodes}/>
              <Route exect path="/deployments" name="PORUS" component={Deployments} />
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
