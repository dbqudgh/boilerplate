import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import auth from './hoc/auth'

function App() {
  return (
    <Router>
    <div>
      
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>

        <Route exact path="/" component={auth(LandingPage,null)}/>
          

        <Route exact path="/login" component={auth(LoginPage,false)}/>

        <Route exact path="/register" component={auth(RegisterPage,false)}/>
      </Switch>
    </div>
  </Router>
  );
}


export default App;