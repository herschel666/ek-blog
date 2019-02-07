import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import { ReducerProvider } from './reduxxx';
import { reducer } from './state';
import { IndexPage } from './pages/index-page/index-page';
import { EditPostPage } from './pages/edit-post-page/edit-post-page';
import { NewPostPage } from './pages/new-post-page/new-post-page';

const mount = document.getElementById(window.__blog__.mountId);

const Admin = () => (
  <HashRouter>
    <ReducerProvider reducer={reducer}>
      <Route path="/" exact={true} component={IndexPage} />
      <Route
        path="/page/:page"
        exact={true}
        strict={true}
        component={IndexPage}
      />
      <Route
        path="/edit/:uid"
        exact={true}
        strict={true}
        component={EditPostPage}
      />
      <Route
        path="/new-post"
        exact={true}
        strict={true}
        component={NewPostPage}
      />
    </ReducerProvider>
  </HashRouter>
);

render(<Admin />, mount);
