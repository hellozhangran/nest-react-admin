import { Module, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeptModule } from './dept/dept.module';
import { PostModule } from './post/post.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';

@Global()
@Module({
  imports: [
    UserModule,
    DeptModule,
    PostModule,
    MenuModule,
    RoleModule,
  ],
})
export class SystemModule {}
