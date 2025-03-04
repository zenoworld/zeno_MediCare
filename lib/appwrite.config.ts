import * as sdk from 'node-appwrite';
const {
    NEXT_PUBLIC_PROJECT_ID:PROJECT_ID,
    NEXT_PUBLIC_API_KEY:API_KEY,
    NEXT_PUBLIC_DATABASE_ID:DATABASE_ID,
    NEXT_PUBLIC_PATIENT_COLLECTION_ID:PATIENT_COLLECTION_ID,
    NEXT_PUBLIC_DOCTOR_COLLECTION_ID:DOCTOR_COLLECTION_ID,
    NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID:APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID:BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT:END_POINT
} = process.env;

if (!PROJECT_ID || !API_KEY || !END_POINT) {
    throw new Error("Missing required environment variables: PROJECT_ID, API_KEY, or END_POINT");
}

const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67be0ca4003de07d78d0')
    .setKey('standard_679b0c3d69d995074a28dbe1bfd509acd03efb1ee6812a265b0bb354fc6bf5c74d8296634702f461035ccf7bacb78ef3c5c5dc7e3bf1a1db224fd89f88072cafef0b63040c40acfbb4b9dc3dab825b7d378d6c5dcb964d2c2baba4b47c2ea30caeca0b4a36adf6c7e7f38cb03e088f8b6d2e70997655da53291f7e3e3838cd99');

export const databases = new sdk.Databases(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);

export {
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    BUCKET_ID,
};
