import { Module, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeptModule } from './dept/dept.module';
import { PostModule } from './post/post.module';

@Global()
@Module({
  imports: [
    UserModule,
    DeptModule,
    PostModule,
  ],
})
export class SystemModule {}
