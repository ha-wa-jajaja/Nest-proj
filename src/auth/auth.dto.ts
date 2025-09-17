import { IsString, IsEmail, IsOptional } from "class-validator";

export class LoginResponseDto {
  @IsString()
  firebaseUid: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  createdAt: Date;
}

export class FirebaseUserData {
  uid: string;
  email: string;
  name?: string | null;
  email_verified: boolean;
}
