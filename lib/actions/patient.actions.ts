'use server';

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { users,storage ,databases} from "../appwrite.config";
import {InputFile} from "node-appwrite/file"

const {
  NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_API_KEY: API_KEY,
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID: PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_DOCTOR_COLLECTION_ID: DOCTOR_COLLECTION_ID,
  NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID: APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: END_POINT,
} = process.env;


export const createUser = async (user: CreateUserParams) => {
  try {
    console.log(END_POINT);
    
    console.log("Attempting to create user:", user);

    const response = await fetch(`https://cloud.appwrite.io/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": PROJECT_ID || "",
        "X-Appwrite-Key": API_KEY || "",
      },
      body: JSON.stringify({
        userId: ID.unique(), // Generates a unique user ID
        name: user.name,
        email: user.email,
        password: generateRandomPassword(), // Secure random password
        phone: user.phone,
      }),
    });

    const newUserData = await response.json();

    if (!response.ok) {
      throw new Error(newUserData.message || "Failed to create user");
    }

    return newUserData;
  } catch (error: any) {
    console.error("Error in createUser:", error.message);

    if (error?.code === 409) {
      console.log("User already exists, fetching existing user...");
      return getExistingUserByEmail(user.email);
    }

    throw new Error(error.message || "An unexpected error occurred.");
  }
};
// Function to generate a random strong password
const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-12) + "A1!"; // Ensures complexity
};
// Function to fetch existing user by email
const getExistingUserByEmail = async (email: string) => {
  try {
    const response = await fetch(`${END_POINT}/v1/users?queries=[Query.equal("email", "${email}")]`, {
      method: "GET",
      headers: {
        "X-Appwrite-Project": PROJECT_ID || "",
        "X-Appwrite-Key": API_KEY || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch existing user");
    }

    return data?.users?.[0] || null;
  } catch (error: any) {
    console.error("Error fetching existing user:", error.message);
    return null;
  }
};


export  const getUser = async (userId:string) =>{
    try {
        const user = await users.get(userId)
        return user
    } catch (error) {
        console.log(error);
        
    }
}
export  const getPatient = async (userId:string) =>{
  try {
      const patients = await databases.listDocuments(
         DATABASE_ID!,
         PATIENT_COLLECTION_ID!,
         [Query.equal('userId' , userId)]
      )
      return parseStringify(patients.documents[0])
  } catch (error) {
      console.log(error);    
  }
}

export const registerPatient = async ({identificationDocument,...patient}:RegisterUserParams) => {

  try {
    let file;

    if(identificationDocument){
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,
      )

      file = await storage.createFile(BUCKET_ID!,ID.unique() , inputFile)
    }

    const newPatient = await databases.createDocument(
   DATABASE_ID!,
   PATIENT_COLLECTION_ID!,
   ID.unique(),
  {
    identificationDocumentId : file?.$id || null ,
    identificationDocumentUrl : `${END_POINT}/storage/bucket/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
    ...patient
  }
    )

    return parseStringify(newPatient)
  } catch (error) {
    console.log(error);
    
  }

}

// export const createUser = async (user: CreateUserParams) => {
//     try {
//         console.log("Attempting to create user:", user);

//         if (!user.email || !user.name || !user.phone) {
//             throw new Error("Missing required fields: email, name, or phone");
//         }

//         const newUser = await users.create(
//             ID.unique(),
//             user.email,
//             "p123",
//             user.name,
//             user.phone
//         );
        
//         return parseStringify(newUser);
//     } 
//     catch (error: any) {
//         console.log("Error in createUser:", error);

//         if (error?.code === 409) {
//             console.log("User already exists, fetching existing user...");
//             const existingUsers = await users.list(
//                 [Query.equal('email', [user.email])
//             ]);
//             return existingUsers?.users?.[0] || null;
//         }

//         throw new Error(error.message || "Failed to create user");
//     }
// }; 