/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
  onRequest,
  onCall,
  HttpsError,
  CallableRequest,
} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { auth } from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// data, context
export const sayHello = onCall(() => {
  return `Hello World!`;
});

// export const userSignUpTrigger = auth.user().onCreate((user) => {
//   logger.info("User cerated", user.email, user.uid, { structuredData: true });
//   return admin.firestore().collection("users").doc(user.uid).set({
//     email: user.email,
//     roles: [],
//   });
// });

export const userDeletedTrigger = auth.user().onDelete((user) => {
  logger.info("User deleted", user.email, user.uid, { structuredData: true });
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export const createUser = onCall(
  async (request: CallableRequest<CreateUserRequest>) => {
    const { data, auth } = request;
    // Verify the request is made by an authenticated admin
    if (!auth) {
      throw new HttpsError(
        "permission-denied",
        "Only administrators can create new users."
      );
    }

    const { name, email, password } = data;

    // Check if the required data is provided
    if (!name || !email || !password) {
      throw new HttpsError(
        "invalid-argument",
        'The function must be called with the arguments "name", "email", and "password".'
      );
    }

    try {
      // Create the user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });

      // Optionally, add the user to Firestore or perform other actions
      await admin.firestore().collection("users").doc(userRecord.uid).set({
        name: name,
        email: email,
        roles: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info("User cerated", userRecord.email, userRecord.uid, {
        structuredData: true,
      });
      return { uid: userRecord.uid, message: "User created successfully" };
    } catch (error) {
      logger.error("Error creating user", { structuredData: true });
      throw new HttpsError("internal", "Unable to create user", error);
    }
  }
);
