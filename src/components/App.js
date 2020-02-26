import React, { Component } from "react";
import CreateTestCasePage from "./createTestCasePage";
import TestCaseSelectionPage from "./TestCaseSelectionPage";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";

import "../styling/App.css";

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/" exact component={CreateTestCasePage} />
            <Route path="/test" exact component={TestCaseSelectionPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
