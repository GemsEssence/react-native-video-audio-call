import {createStore, compose, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reduxThunk from 'redux-thunk';

import rootReducer from './rootReducer';

const enhancer = compose(applyMiddleware(reduxThunk));

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);

export default store;
