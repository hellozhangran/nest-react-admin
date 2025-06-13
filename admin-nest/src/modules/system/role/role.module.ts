import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SysRoleEntity } from "./entities/role.entity";
import { SysRoleWithMenuEntity } from "./entities/role-with-menu.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SysRoleEntity, SysRoleWithMenuEntity])],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}