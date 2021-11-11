import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { css } from '@emotion/css';
import './App.global.css';

import CodeEditor from './editor/CodeEditor';

const Hello = () => {
  return (
    <div
      className={css`
        display: grid;
        grid-template-rows: 50px 1fr;
        width: 100vw;
        height: 100vh;
      `}
    >
      <button type="button">Hello</button>
      <CodeEditor />
    </div>
  );
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
