import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, isSignedIn} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Feed from './screens/Feed';
import AddPhoto from './screens/AddPhoto';
import Profile from './screens/Profile';
import Login from './screens/Login';
import Register from './screens/Register';
import Splash from './screens/Splash';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import {connect} from 'react-redux';

const MenuNavigator = props => {
	const isSigned = props.isSigned;
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="Feed"
				screenOptions={{tabBarShowLabel: false}}>
				<Tab.Screen
					name="Feed"
					component={Feed}
					options={{
						title: 'Feed',
						tabBarIcon: ({color}) => (
							<Icon
								name="home"
								size={30}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="AddPhoto"
					component={AddPhoto}
					options={{
						title: 'Add Picture',
						tabBarIcon: ({color}) => (
							<Icon
								name="camera"
								size={30}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Profile"
					component={isSigned ? Profile : authRouter}
					options={{
						title: 'Profile',
						tabBarIcon: ({color}) => (
							<Icon
								name="user"
								size={30}
								color={color}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
};

const authRouter = _ => {
	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen
				name="Login"
				component={Login}
				screenOptions={{title: 'Login'}}
			/>
			<Stack.Screen
				name="Register"
				component={Register}
				screenOptions={{title: 'Register'}}
			/>
		</Stack.Navigator>
	);
};

/* USE A STATE REDUX VARIABLE TO  CONDITIONALLY
 * MOUNT SCREENS AS AN AUTHENTICATION FLOW
 */

//export default MenuNavigator;

const mapStateToProps = ({user}) => {
	return {
		isSigned: user.isSigned,
	}
}

export default connect(mapStateToProps, null)(MenuNavigator);
