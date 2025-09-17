import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Headers("authorization") authHeader: string,
  ): Promise<LoginResponseDto> {
    // Extract token from "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Authorization header must be provided with Bearer token",
      );
    }

    const idToken = authHeader.substring(7); // Remove "Bearer " prefix

    if (!idToken) {
      throw new UnauthorizedException("Firebase ID token is required");
    }

    return await this.authService.login(idToken);
  }
}
