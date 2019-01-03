import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import JobsLoaderContainer from './containers/JobsLoaderContainer';
import ViewJobsContainer from './containers/ViewJobsContainer';
import q8logo from './images/q8-logo.png';

class App extends Component {
  render() {
    return (
      <Router>

        <div className="App">
          <div className="nav-header">
            <img src={q8logo} height="45"/>
          </div>
          <Route exact path="/uploadjobs" component={JobsLoaderContainer} />
          <Route path="/viewjobs" component={ViewJobsContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
