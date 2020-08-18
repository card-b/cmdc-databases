import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Mysql from './components/mysql/mysql';
import Mongo from './components/mongo/mongo';
import Redis from './components/redis/redis';
import './styles.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav>
            <Link to="/">Mysql</Link>
            <Link to="/mongo">MongoDB</Link>
            <Link to="/redis">Redis</Link>
          </nav>
        </header>
        <Switch>
          <Route path="/redis">
            <Redis />
          </Route>
          <Route path="/mongo">
            <Mongo />
          </Route>
          <Route path="/">
            <Mysql />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
