const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configura las credenciales y la región de AWS
let s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

// Configuración de multer para manejar archivos multipart
const upload = multer();

const uploadFiletoS3 = (file, folder_name, callback) => {

    const key = `${folder_name}/${Date.now().toString()}${path.extname(file.originalname)}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const putCommand = new PutObjectCommand(params);

    s3.send(putCommand, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, key);
        }
    });
};

const deleteFiletoS3 = (key, callback) => {

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    const deleteCommand = new DeleteObjectCommand(params);

    s3.send(deleteCommand, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

module.exports = { upload, uploadFiletoS3, deleteFiletoS3 };