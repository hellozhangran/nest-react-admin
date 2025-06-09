import { Module, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    UserModule,
  ],
})
export class SystemModule {}
