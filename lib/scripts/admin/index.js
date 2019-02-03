import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import { ReducerProvider, combineReducers } from './reducer';
import { appReducer } from './state';
import { editPostReducer } from './pages/edit-post-page/state';
import { App } from './app';
import { IndexPage } from './pages/index-page/index-page';
import { EditPostPage } from './pages/edit-post-page/edit-post-page';

const mount = document.getElementById(__blog__.mountId);

const reducer = combineReducers({
  app: appReducer,
  editPost: editPostReducer,
});

const Admin = () => (
  <HashRouter>
    <ReducerProvider reducer={reducer}>
      <App>
        <Route path="/" exact={true} component={IndexPage} />
        <Route path="/edit/:uid" exact={true} component={EditPostPage} />
      </App>
    </ReducerProvider>
  </HashRouter>
);

render(<Admin />, mount);
