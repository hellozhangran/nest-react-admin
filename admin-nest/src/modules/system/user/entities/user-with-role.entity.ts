import { Entity, PrimaryColumn } from 'typeorm';

//用户和角色关联表 
// N 对 N 时才会专门用一个关联表
@Entity('sys_user_role', {
  comment: '用户和角色关联表',
})
export class SysUserWithRoleEntity {
  @PrimaryColumn({ type: 'int', name: 'user_id', comment: '用户ID' })
  public userId: number;

  @PrimaryColumn({ type: 'int', name: 'role_id', comment: '角色ID' })
  public roleId: number;
}
