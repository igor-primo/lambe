/**
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import Splash from './src/screens/Splash';

import storeConfig from './src/store/storeConfig';

import axios from 'axios';
axios.defaults.baseURL = 'https://lambe-1e80b-default-rtdb.firebaseio.com/';

		//<App />
const store = storeConfig();
const Redux = _ => (
	<Provider store={store}>
		<App />
	</Provider>
);

AppRegistry.registerComponent(appName, () => Redux);
