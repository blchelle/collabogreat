import { ThemeActionTypes, TOGGLE_THEME } from './theme.types';

export function themeReducer(
	state: 'light' | 'dark' = 'dark',
	action: ThemeActionTypes
): 'light' | 'dark' {
	switch (action.type) {
		case TOGGLE_THEME:
			return state === 'light' ? 'dark' : 'light';
		default:
			return state;
	}
}
