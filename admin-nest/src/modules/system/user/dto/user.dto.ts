import { UserEntity } from '../entities/sys-user.entity';

export type UserType = {
  browser: string;
  ipaddr: string;
  loginLocation: string;
  loginTime: Date;
  os: string;
  permissions: string[];
  roles: string[];
  token: string;
  user: {
    dept: any;
    roles: Array<any>;
    posts: Array<any>;
  } & UserEntity;
  userId: number;
  userName: string;
  deptId: number;
};
