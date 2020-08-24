import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { projectReducer } from './project/project.reducer';
import { userReducer } from './user/user.reducer';

const persistConfig = {
	key: 'root',
	storage,
};

const rootReducer = combineReducers({
	user: userReducer,
	projects: projectReducer,
});

export const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedRootReducer>;