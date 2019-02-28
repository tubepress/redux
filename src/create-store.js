import thunkMiddleware                  from 'redux-thunk';
import { middleware as packMiddleware } from 'redux-pack';
import { composeWithDevTools }          from 'redux-devtools-extension';
import dynostore, { dynamicReducers }   from '@redux-dynostore/core';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';

const reduxStoreFactory = (isDebugging, isProduction) => {

  const middleWares = [
      thunkMiddleware,
      packMiddleware,
    ],

    finalCompose       = isDebugging || !isProduction ? composeWithDevTools : compose,
    middlewareEnhancer = applyMiddleware(...middleWares),
    storeEnhancers     = [middlewareEnhancer, dynostore(dynamicReducers())],
    storeEnhancer      = finalCompose(...storeEnhancers),
    initialReducer     = (state) => state;

  return createStore(initialReducer, undefined, storeEnhancer);
};

export default (isDebugging, isProduction) => {

  const reduxStore = reduxStoreFactory(isDebugging, isProduction),

    getState = () => reduxStore.getState(),

    dispatch = (action) => reduxStore.dispatch(action),

    subscribe = (listener) => reduxStore.subscribe(listener),

    addReducers = (...reducers) => reduxStore.attachReducers(...reducers),

    removeReducers = (...reducers) => reduxStore.detatchReducers(...reducers);

  return {

    addReducer: addReducers,
    addReducers,
    dispatch,
    getState,
    removeReducer : removeReducers,
    removeReducers,
    subscribe,
  };
};
