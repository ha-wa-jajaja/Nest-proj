import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseAdmin: admin.app.App;

  onModuleInit() {
    if (!admin.apps.length) {
      this.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      this.firebaseAdmin = admin.app();
    }
  }

  getAuth() {
    return this.firebaseAdmin.auth();
  }
}
