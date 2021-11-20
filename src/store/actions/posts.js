import {SET_POSTS} from './actionTypes';
import {ADD_COMMENT, CREATING_POST, POST_CREATED} from './actionTypes';
import axios from 'axios';
import {setMessage} from './message';

export const addPost = post => {
	return (dispatch, getState) => {
		dispatch(creatingPost());
		//axios.post(`/posts.json?auth=${getState().user.token}`, {...post})
		axios.post('/posts.json', {...post})
			.catch(err =>
				dispatch(
					setMessage({
						title: 'error in post of posts',
						text: err,
					}),
				),
			)
			.then(res => {
				dispatch(fetchPosts());
				dispatch(postCreated());
			});
	};

	/*return {
		type: ADD_POST,
		payload: post,
	}*/
};

export const addComment = payload => {
	return (dispatch, getState) => {
		axios.get(`/posts/${payload.postId}.json`)
			.catch(err =>
				dispatch(
					setMessage({
						title: 'error in get comment',
						text: err,
					}),
				),
			)
			.then(res => {
				const comments = res.data.comments || [];
				comments.push(payload.comment);
				//axios.patch(`/posts/${payload.postId}.json?auth=${getState().user.token}`, {
				axios.patch(`/posts/${payload.postId}.json`, {
					comments,
				})
					.catch(err =>
						dispatch(
							setMessage({
								title: 'error in patch comment',
								text: err,
							}),
						),
					)
					.then(res => {
						dispatch(fetchPosts());
					});
			});
	};
	/*return {
		type: ADD_COMMENT,
		payload: payload,
	}*/
};

export const setPosts = posts => {
	return {
		type: SET_POSTS,
		payload: posts,
	};
};

export const fetchPosts = _ => {
	return dispatch => {
		axios.get('/posts.json')
			.catch(err =>
				dispatch(
					setMessage({
						title: 'error in get fetch posts',
						text: err,
					}),
				),
			)
			.then(res => {
				//console.log(res.data);
				const rawPosts = res.data;
				const posts = [];
				for (let key in rawPosts) {
					posts.push({
						...rawPosts[key],
						id: key,
					});
				}

				dispatch(setPosts(posts.reverse()));
			});
	};
};

export const creatingPost = _ => {
	return {
		type: CREATING_POST,
	};
};

export const postCreated = _ => {
	return {
		type: POST_CREATED,
	};
};
