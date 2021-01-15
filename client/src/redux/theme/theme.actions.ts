import { ThemeActionTypes, TOGGLE_THEME } from './theme.types';

export function toggleTheme(): ThemeActionTypes {
	return {
		type: TOGGLE_THEME,
	};
}
