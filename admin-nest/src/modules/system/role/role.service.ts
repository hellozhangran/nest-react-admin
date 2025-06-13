import { Injectable } from "@nestjs/common";
import { SysRoleWithMenuEntity } from "./entities/role-with-menu.entity";
import { SysRoleEntity } from "./entities/role.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from "./dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly sysRoleEntityRep: Repository<SysRoleEntity>,
    @InjectRepository(SysRoleWithMenuEntity)
    private readonly sysRoleWithMenuEntityRep: Repository<SysRoleWithMenuEntity>,
  ) {}

  /**
   * 创建角色
   * @param createRoleDto 
   * @returns 
   */
  async create(createRoleDto: CreateRoleDto) {
    const res = await this.sysRoleEntityRep.save(createRoleDto);
    const entity = this.sysRoleWithMenuEntityRep.createQueryBuilder('entity');
    const values = createRoleDto.menuIds?.map((id) => {
      return {
        roleId: res.roleId,
        menuId: id,
      };
    });
    if (values) {
      entity.insert().values(values).execute();
    }
    return res;
  }

  /**
   * 获取角色列表
   * @param query 
   * @returns 
   */
  async findAll(query: ListRoleDto) {
    const entity = this.sysRoleEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.roleName) {
      entity.andWhere(`entity.roleName LIKE "%${query.roleName}%"`);
    }

    if (query.roleKey) {
      entity.andWhere(`entity.roleKey LIKE "%${query.roleKey}%"`);
    }

    if (query.roleId) {
      entity.andWhere('entity.roleId = :roleId', { roleId: query.roleId });
    }

    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      entity.andWhere('entity.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    if (query.pageSize && query.pageNum) {
      entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    }
    const [list, total] = await entity.getManyAndCount();

    return {
      list,
      total,
    };
  }

  /**
   * 获取角色详情
   * @param roleId 
   * @returns 
   */
  async findOne(roleId: number) {
    const res = await this.sysRoleEntityRep.findOne({
      where: {
        roleId: roleId,
        delFlag: '0',
      },
    });
    return res;
  }

  /**
   * 更新角色
   * @param updateRoleDto 
   * @returns 
   */
  async update(updateRoleDto: UpdateRoleDto) {
    const hasId = await this.sysRoleWithMenuEntityRep.findOne({
      where: {
        roleId: updateRoleDto.roleId,
      },
      select: ['roleId'],
    });

    //角色已关联菜单
    if (hasId) {
      await this.sysRoleWithMenuEntityRep.delete({
        roleId: updateRoleDto.roleId,
      });
    }

    //TODO 后续改造为事务
    const entity = this.sysRoleWithMenuEntityRep.createQueryBuilder('entity');
    const values = updateRoleDto.menuIds?.map((id) => {
      return {
        roleId: updateRoleDto.roleId,
        menuId: id,
      };
    });

    delete (updateRoleDto as any).menuIds;
    if (values) {
      entity.insert().values(values).execute();
    }
    const res = await this.sysRoleEntityRep.update({ roleId: updateRoleDto.roleId }, updateRoleDto);
    return res;
  }

  /**
   * 删除角色
   * @param roleIds 
   * @returns 
   */
  async remove(roleIds: number[]) {
    const data = await this.sysRoleEntityRep.update(
      { roleId: In(roleIds) },
      {
        delFlag: '1',
      },
    );
    return data;
  }
}