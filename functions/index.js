const functions = require("firebase-functions");
const cors = require('cors')({origin: true});
const fs = require('fs');
const uuid = require('uuid-v4');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
	projectId: 'lambe-1e80b',
	keyFilename: 'lambe-1e80b.json',
});

exports.updloadImage = functions.https.onRequest((request, response) => {
	cors(request, response, _ => {
		try {
			fs.writeFileSync('/tmp/imageToSave.jpg', request.body.image, 'base64');

			const bucket = storage.bucket('lambe-1e80b.appspot.com');
			const id = uuid();
			bucket.upload('/tmp/imageToSave.jpg', {
				uploadType: 'media',
				destination: `/posts/${id}.jpg`,
				metadata: {
					metadata: {
						contentType: 'image/jpg',
						firebaseStorageDownloadTokens: id,
					}
				}, (err, file) => {
					if(err){
						console.log(err);
						return response.status(500).json({error: err});
					} 

					const fileName = encodeURIComponent(file.name);
					const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + fileName + '?alt=media&token=' + id;
					return reponse.status(201).json({imageUrl: imageUrl});
				});
		} catch(err) {
			console.log(err);
			return response.status(500).json({ error: err});
		}
	});
});
