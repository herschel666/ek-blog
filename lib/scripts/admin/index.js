import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import { ReducerProvider, combineReducers } from './reduxxx';
import { appReducer } from './state'
import { indexReducer } from './pages/index-page/state';
import { editPostReducer } from './pages/edit-post-page/state';
import { newPostReducer } from './pages/new-post-page/state';
import { IndexPage } from './pages/index-page/index-page';
import { EditPostPage } from './pages/edit-post-page/edit-post-page';
import { NewPostPage } from './pages/new-post-page/new-post-page';

const mount = document.getElementById(window.__blog__.mountId);

const reducer = combineReducers({
  app: appReducer,
  index: indexReducer,
  editPost: editPostReducer,
  newPost: newPostReducer,
});

const Admin = () => (
  <HashRouter>
    <ReducerProvider reducer={reducer}>
      <Route path="/" exact={true} component={IndexPage} />
      <Route path="/page/:page" exact={true} component={IndexPage} />
      <Route path="/edit/:uid" exact={true} component={EditPostPage} />
      <Route path="/new-post" exact={true} component={NewPostPage} />
    </ReducerProvider>
  </HashRouter>
);

render(<Admin />, mount);
