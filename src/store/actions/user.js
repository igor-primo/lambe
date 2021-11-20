import {
	USER_LOGGED_IN,
	USER_LOGGED_OUT,
	LOADING_USER,
	USER_LOADED,
} from './actionTypes';
import axios from 'axios';
import {setMessage} from './message';

const authBaseURL =
	'https://identitytoolkit.googleapis.com/v1/accounts';
const API_KEY = '';

export const userLogged = user => {
	return {
		type: USER_LOGGED_IN,
		payload: user,
	};
};

export const logout = _ => {
	return {
		type: USER_LOGGED_OUT,
	};
};

export const createUser = user => {
	console.log(user);
	return dispatch => {
		axios.post(`${authBaseURL}:signUp?key=${API_KEY}`, {
			email: user.email,
			password: user.password,
			returnSecureToken: true,
		})
			.catch(err =>
				dispatch(
					setMessage({
						title: 'error in post create user',
						text: err,
					}),
				),
			)
			.then(res => {
				if (res.data.localId) {
					axios.put(
						`/users/${res.data.localId}.json`,
						{
							name: user.name,
						},
					)
						.catch(err =>
							dispatch(
								setMessage({
									title: 'error in put create user',
									text: err,
								}),
							),
						)
						.then(res => {
							dispatch(login(user));
						});
				}
			});
	};
};

export const loadingUser = _ => {
	return {
		type: LOADING_USER,
	};
};

export const userLoaded = _ => {
	return {
		type: USER_LOADED,
	};
};

export const login = user => {
	return dispatch => {
		dispatch(loadingUser());
		axios.post(`${authBaseURL}:signInWithPassword?key=${API_KEY}`, {
			email: user.email,
			password: user.password,
			returnSecureToken: true,
		})
			.catch(err =>
				dispatch(
					setMessage({
						title: 'error in post login',
						text: err,
					}),
				),
			)
			.then(res => {
				if (res.data.localId) {
					user.token = res.data.idToken;
					axios.get(
						`/users/${res.data.localId}.json`,
					)
						.catch(err =>
							dispatch(
								setMessage({
									title: 'error in get login',
									text: err,
								}),
							),
						)
						.then(res => {
							delete user.password;
							user.name =
								res.data.name;
							dispatch(
								userLogged(
									user,
								),
							);
							dispatch(userLoaded());
						});
				}
			});
	};
};
