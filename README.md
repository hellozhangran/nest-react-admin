<div align="center"> 
<br> 
<br>
<img src="./admin-react/src/assets/images/logo.png" height="140" />
<h3> Nest-React-Admin </h3>
  <p>
    <p style="font-size: 14px">
      Nest-React-Admin 是一款全栈的后台管理系统。后端技术栈是：Nest.js + Mysql + Typeorm + Redis + JWT。前端技术栈是：React + Zustand + React Query + Vite + TailwindCSS。它旨在帮助开发人员快速搭建功能强大的后台管理系统，未来会对标 ruoyi 系统，希望构建以nest+react为基础的大型综合后台管理系统。
    </p>
    <br />
    <br />
</div>

**中文** | [English](./README.md)


## 特性

- 使用 React 18 hooks 进行构建。
- 基于 Vite 进行快速开发和热模块替换。
- 集成 Ant Design，提供丰富的 UI 组件和设计模式。
- 使用 TypeScript 编写，提供类型安全性和更好的开发体验。
- 响应式设计，适应各种屏幕尺寸和设备。
- 灵活的路由配置，支持多级嵌套路由。
- 集成权限管理，根据用户角色控制页面访问权限。
- 集成国际化支持，轻松切换多语言。
- 集成常见的后台管理功能，如用户管理、角色管理、权限管理等。
- 可定制的主题和样式，以满足您的品牌需求。
- 基于 MSW 和 Faker.js 的Mock方案
- 使用 Zustand 进行状态管理
- 使用 React-Query 进行数据获取

## 快速开始

### 获取项目代码

```bash
git clone https://github.com/hellozhangran/nest-react-admin.git
cd nest-react-admin
cd admin-react
```

### 安装依赖

在项目根目录下运行以下命令安装项目依赖：

```bash
pnpm install
```

### 启动开发服务器

运行以下命令以启动开发服务器：

```bash
pnpm dev
```

访问 [http://localhost:3001](http://localhost:3001) 查看您的应用程序。

### 构建生产版本

运行以下命令以构建生产版本：

```bash
pnpm build
```

构建后的文件将位于 `dist` 目录中。

参考[.commitlint.config.js](./commitlint.config.js)

- `feat` 新功能
- `fix` 修复bug
- `docs` 文档注释
- `style` 代码格式(不影响代码运行的变动)
- `refactor` 重构
- `perf` 性能优化
- `revert` 回滚commit
- `test` 测试相关
- `chore` 构建过程或辅助工具的变动
- `ci` 修改CI配置、脚本
- `types` 类型定义文件修改
- `wip` 开发中
