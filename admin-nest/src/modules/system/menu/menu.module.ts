import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SysMenuEntity } from "./entities/menu.entity";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";

@Module({
  imports: [TypeOrmModule.forFeature([SysMenuEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}