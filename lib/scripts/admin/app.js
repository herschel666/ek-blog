import React from 'react';
import { ReducerContext } from './reduxxx';
import { loadCategories, loadBlogposts } from './state';

export class App extends React.Component {
  static contextType = ReducerContext;

  componentDidMount() {
    this.context.dispatch(loadCategories());
    this.context.dispatch(loadBlogposts());
  }

  render() {
    return this.props.children;
  }
}
