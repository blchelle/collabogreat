import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSageMiddleware from 'redux-saga';

import { persistedRootReducer } from './root.reducer';
import { rootSaga } from './root.sagas';

// Setup the middlewares that will be use
const sagaMiddleware = createSageMiddleware();
const middlewares = [sagaMiddleware, logger];

// Create the redux store
export const store = createStore(persistedRootReducer, applyMiddleware(...middlewares));
export const persistor = persistStore(store);

// Initialize the redux saga middlewares
sagaMiddleware.run(rootSaga);
