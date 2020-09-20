import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { errorReducer } from './error/error.reducer';
import { modalReducer } from './modals/modals.reducer';
import { projectReducer } from './project/project.reducer';
import { userReducer } from './user/user.reducer';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['modals', 'error'],
};

const rootReducer = combineReducers({
	error: errorReducer,
	modals: modalReducer,
	projects: projectReducer,
	user: userReducer,
});

export const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedRootReducer>;
