const { Rekognition, CompareFacesCommand } = require("@aws-sdk/client-rekognition");

const region = 'us-east-1';
const rekognition = new Rekognition({ region });

const compareImages = async (sourceImage, targetImageBuffer, similarity = 90) => {
    const params = {
        SourceImage: {
            S3Object: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Name: sourceImage,
            },
        },
        TargetImage: {
            Bytes: targetImageBuffer
        },
        SimilarityThreshold: similarity,
    };

    try {
        const data = await rekognition.send(new CompareFacesCommand(params));
        const faceMatches = data.FaceMatches;
        return faceMatches.length > 0;
    } catch (error) {
        console.error('Error al comparar caras:', error);
        return false;
    }
};

module.exports = { compareImages };