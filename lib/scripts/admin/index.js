import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import { ApolloProvider } from './apollo';
import { MainHeader } from './components/main-header/main-header';
import { IndexPage } from './pages/index-page/index-page';
import { EditPostPage } from './pages/edit-post-page/edit-post-page';

const mount = document.getElementById(window.__blog__.mountId);

const Admin = () => (
  <HashRouter>
    <ApolloProvider>
      <MainHeader />
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
        component={EditPostPage}
      />
    </ApolloProvider>
  </HashRouter>
);

render(<Admin />, mount);
