import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseModule } from "../firebase/firebase.module";
import { DbModule } from "../db/db.module";

@Module({
  controllers: [AuthController],
  imports: [FirebaseModule, DbModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
