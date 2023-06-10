const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 7 * 24 * 60 * 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}

module.exports = {
  uploadFile,
  getObjectSignedUrl,
};
