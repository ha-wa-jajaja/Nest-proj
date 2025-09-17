import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { FirebaseUserData, LoginResponseDto } from "./auth.dto";
import { FirebaseService } from "src/firebase/firebase.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly firebaseService: FirebaseService, // Inject FirebaseService
  ) {}

  /**
   * Validates Firebase ID token and returns user data
   */
  async validateFirebaseToken(idToken: string): Promise<FirebaseUserData> {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(idToken);

      // Validate required fields
      if (!decodedToken.email) {
        throw new UnauthorizedException("Token missing required email");
      }

      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: typeof decodedToken.name === "string" ? decodedToken.name : null, // null is better than empty string
        email_verified: !!decodedToken.email_verified,
      };
    } catch {
      throw new UnauthorizedException("Invalid or expired Firebase token");
    }
  }

  async login(idToken: string): Promise<LoginResponseDto> {
    // Validate Firebase token
    const firebaseUser = await this.validateFirebaseToken(idToken);

    // Upsert user in database
    const updateData: { email: string; name?: string } = {
      email: firebaseUser.email,
    };

    // Only update name if Firebase has a name
    if (firebaseUser.name) {
      updateData.name = firebaseUser.name;
    }

    const user = await this.db.user.upsert({
      where: { firebaseUid: firebaseUser.uid },
      update: updateData,
      create: {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name,
      },
    });

    return {
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user?.name ?? "",
      createdAt: user.createdAt,
    };
  }

  /**
   * Get user by Firebase UID (useful for protected routes)
   */
  async getUserByFirebaseUid(
    firebaseUid: string,
  ): Promise<LoginResponseDto | null> {
    const user = await this.db.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return null;
    }

    return {
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user?.name ?? "",
      createdAt: user.createdAt,
    };
  }
}
