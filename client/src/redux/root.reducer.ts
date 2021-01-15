import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { errorReducer } from './error/error.reducer';
import { taskReducer } from './tasks/tasks.reducer';
import { modalReducer } from './modals/modals.reducer';
import { projectReducer } from './project/project.reducer';
import { userReducer } from './user/user.reducer';
import { loadingReducer } from './loading/loading.reducer';
import { themeReducer } from './theme/theme.reducer';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['modals', 'error', 'loading'],
};

const rootReducer = combineReducers({
	error: errorReducer,
	modals: modalReducer,
	loading: loadingReducer,
	projects: projectReducer,
	tasks: taskReducer,
	user: userReducer,
	theme: themeReducer,
});

export const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedRootReducer>;
