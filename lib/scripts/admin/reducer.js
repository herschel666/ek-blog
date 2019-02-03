import React from 'react';

export const ReducerContext = React.createContext({});

export const combineReducers = (reducers) => (state, action) =>
  Object.entries(reducers).reduce(
    (acc, [scope, reducer]) => ({
      ...acc,
      [scope]: reducer(state && state[scope], action),
    }),
    {}
  );

export class ReducerProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.reducer(undefined, {});
  }

  dispatch = async (action) => {
    if (typeof action === 'function') {
      action = await action(
        this.dispatch,
        () => this.state,
        this.props.fetch || window.fetch
      );
      if (!action || !action.type) {
        return;
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('action', action);
    }
    this.setState((state) => this.props.reducer(state, action));
  };

  render() {
    const value = {
      dispatch: this.dispatch,
      state: this.state,
    };

    return (
      <ReducerContext.Provider value={value}>
        {this.props.children}
      </ReducerContext.Provider>
    );
  }
}
