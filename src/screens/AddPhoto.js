import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addPost} from '../store/actions/posts';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Image,
	Dimensions,
	Platform,
	ScrollView,
	Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';

const noUser = 'voce precisa estar logado para adicionar imagens';

class AddPhoto extends Component {
	state = {
		image: null,
		comment: '',
	};

	componentDidUpdate = prevProps => {
		if(prevProps.loading && !this.props.loading){
			this.setState({
				image: null,
				comment: '',
			});

			this.props.navigation.navigate('Feed');
		}
	}

	pickImage = async _ => {

		if(!this.props.name){
			Alert.alert('Falha!', noUser);
			return;
		}

		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.CAMERA,
			);

			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				ImagePicker.launchCamera(
					{
						title: 'Escolha a imagem',
						maxHeight: 600,
						maxWidth: 800,
						includeBase64: true,
					},
					res => {
						if (!res.didCancel) {
							this.setState({
								image: {
									uri: res.assets[0].uri,
									base64: res.assets[0].base64,
								},
							});
						}
					},
				);
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	save = async _ => {

		if(!this.props.name){
			Alert.alert('Falha!', noUser);
			return;
		}

		this.props.onAddPost({
			id: Math.random(),
			nickname: this.props.name,
			email: this.props.email,
			image: this.state.image,
			comments: [
				{
					nickname: this.props.name,
					comment: this.state.comment,
				},
			],
		});
	};

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.title}>
						Compartilhe uma imagem
					</Text>
					<View style={styles.imageContainer}>
						<Image
							source={
								this.state.image
							}
							style={styles.image}
						/>
					</View>
					<TouchableOpacity
						onPress={this.pickImage}
						style={styles.button}>
						<Text style={styles.buttonText}>
							Escolha a foto
						</Text>
					</TouchableOpacity>
					<TextInput
						placeholder="algum comentario"
						style={styles.input}
						value={this.state.comment}
						editable={this.props.name != null}
						onChangeText={comment =>
							this.setState({comment})
						}
					/>
					<TouchableOpacity
						disabled={this.props.loading}
						onPress={this.save}
						style={[styles.button, this.props.loading ? styles.buttonDisabled : null]}>
						<Text style={styles.buttonText}>
							Salvar
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
		marginTop: Platform.OS === 'ios' ? 30 : 10,
		fontWeight: 'bold',
	},
	imageContainer: {
		width: '90%',
		height: Dimensions.get('window').width / 2,
		backgroundColor: '#EEE',
		marginTop: 10,
	},
	image: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height / 2,
		resizeMode: 'center',
	},
	button: {
		marginTop: 30,
		padding: 10,
		backgroundColor: '#4286f4',
	},
	buttonText: {
		fontSize: 20,
		color: '#FFF',
	},
	input: {
		marginTop: 20,
		width: '90%',
	},
	buttonDisabled: {
		backgroundColor: '#AAA',
	},
});

//export default AddPhoto;

const mapStateToProps = ({user, posts}) => {
	return {
		email: user.email,
		name: user.name,
		loading: posts.isUploading,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAddPost: post => dispatch(addPost(post)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPhoto);
