import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SysMenuEntity } from "./entities/menu.entity";
import { CreateMenuDto, ListMenuDto, UpdateMenuDto } from "./dto";
import { ListToTree } from "src/common/utils";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenuEntity)
    private readonly sysMenuEntityRep: Repository<SysMenuEntity>,
  ) {}

  /**
   * 创建菜单
   * @param createMenuDto 
   * @returns 
   */
  async create(createMenuDto: CreateMenuDto) {
    const res = await this.sysMenuEntityRep.save(createMenuDto);
    return res;
  }

  /**
   * 获取菜单列表
   * @param query 
   * @returns 
   */
  async findAll(query: ListMenuDto) {
    const entity = this.sysMenuEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.menuName) {
      entity.andWhere(`entity.menuName LIKE "%${query.menuName}%"`);
    }
    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
    }
    entity.orderBy('entity.orderNum', 'ASC');

    const res = await entity.getMany();
    return res;
  }

  /**
   * 获取菜单树
   * @returns 
   */
  async treeSelect() {
    const res = await this.sysMenuEntityRep.find({
      where: {
        delFlag: '0',
      },
      order: {
        orderNum: 'ASC',
      },
    });
    const tree = ListToTree(
      res,
      (m) => m.menuId,
      (m) => m.menuName,
    );
    return tree;
  }

  /**
   * 获取菜单详情
   * @param menuId 
   * @returns 
   */
  async findOne(menuId: number) {
    const res = await this.sysMenuEntityRep.findOne({
      where: {
        delFlag: '0',
        menuId: menuId,
      },
    });
    return res;
  }

  /**
   * 更新菜单
   * @param updateMenuDto 
   * @returns 
   */
  async update(updateMenuDto: UpdateMenuDto) {
    await this.sysMenuEntityRep.update({ menuId: updateMenuDto.menuId }, updateMenuDto);
    return 'ok';
  }

  /**
   * 删除菜单
   * @param menuId 
   * @returns 
   */
  async remove(menuId: number) {
    await this.sysMenuEntityRep.update(
      { menuId: menuId },
      {
        delFlag: '1',
      },
    );
    return 'ok';
  }

}