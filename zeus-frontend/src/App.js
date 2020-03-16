import React from 'react';
import './App.css';
import Deployments from './Components/Deployments/Deployments';
import Header from './Components/Header/Header';
import NoMatch from './Components/noMatch/NoMatch';
import Nodes from './Components/Nodes/Nodes';
import Cluster from './Components/Cluster/Cluster';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Navigation from './Components/Navigation/Navigation';
import navigation from './Components/Navigation/Navigation.module.scss';

class App extends React.Component {

  render() {
    return (
        <div className="App">
          <Header/>
          <Router>
              <Navigation/>
            <Switch>
              <Route exect path="/" name="PORUS" component={Cluster}/>
              <Route exact path="/deployments" name="PORUS" component={Deployments}/>
              <Route exact path="/nodes" name="PORUS" component={Nodes}/>
              <Route name="PORUS"><NoMatch/></Route>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
