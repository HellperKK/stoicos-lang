import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import CodeEditor from './editor/CodeEditor';
import './App.global.css';

const Hello = () => {
  return <CodeEditor />;
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
