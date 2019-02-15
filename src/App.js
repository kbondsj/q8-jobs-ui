import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import './App.css';
import JobsLoaderContainer from './containers/JobsLoaderContainer';
import ViewJobsContainer from './containers/ViewJobsContainer';
import LoginContainer from './containers/LoginContainer';
import JobDetailView from './containers/JobDetailView';
import q8logo from './images/q8-logo.png';
import history from './utils/history';

class App extends Component {
  render() {
    return (
      <Router history={history}>

        <div className="App">
          <div className="nav-header">
            <img src={q8logo} height="45" alt="logo"/>
          </div>
          <Route exact path="/" component={LoginContainer} />
          <Route exact path="/uploadjobs" component={JobsLoaderContainer} />
          <Route exact path="/viewjobs" component={ViewJobsContainer} />
          <Route path="/viewjobs/job/:jobId" render={ (props) => 
            <JobDetailView jobId={props.match.params.jobId}/>
          }/>
        </div>
      </Router>
    );
  }
}

export default App;
