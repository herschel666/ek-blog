import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import { IndexPage } from './pages/index-page/index-page';
import { EditPostPage } from './pages/edit-post-page/edit-post-page';

const mount = document.getElementById(__blog__.mountId);

const App = () => (
  <HashRouter>
    <>
      <Route path="/" exact={true} component={IndexPage} />
      <Route path="/edit/:uid" exact={true} component={EditPostPage} />
    </>
  </HashRouter>
);

render(<App />, mount);
