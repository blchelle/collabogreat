import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userReducer } from './user/user.reducer';
import { projectReducer } from './project/project.reducer';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user'],
};

const rootReducer = combineReducers({
	user: userReducer,
	project: projectReducer,
});

export const persistedRootReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof persistedRootReducer>;
