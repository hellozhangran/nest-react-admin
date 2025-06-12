import { Module, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeptModule } from './dept/dept.module';

@Global()
@Module({
  imports: [
    UserModule,
    DeptModule,
  ],
})
export class SystemModule {}
