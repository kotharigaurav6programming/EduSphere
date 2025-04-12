import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
    region: process.env.REGION, // Ensure AWS Region is set in .env
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    }
});

async function customUpload(folderName,filename,fileName){
     // Upload params
     const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 Bucket Name
        Key: `${folderName}/${fileName}`, // File Path in S3
        Body: filename.data, // File Data
        ContentType: filename.mimetype // MIME Type
    };

    // Upload File to S3
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // S3 File URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${folderName}/${fileName}`;
}

export default customUpload;

