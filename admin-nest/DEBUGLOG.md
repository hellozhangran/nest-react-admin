**2025.06.08**
- 引入yml文件，并试图配置到app.module.t时报错，后nest-cli.json 增加相关配置解决
- 解释如下：
. TypeScript 编译过程
之前的情况：
Apply to DEBUGLOG.md
没有复制！
TypeScript 编译器默认行为：
✅ 编译 .ts 文件为 .js 文件
❌ 不会复制 非 TypeScript 文件（如 .yml, .json, .txt 等）
2. 运行时路径解析
你的代码中：
)
运行时 __dirname 的值：
开发环境：/Users/ran/.../admin-nest/src/config/env
生产环境：/Users/ran/.../admin-nest/dist/config/env
问题出现：
Apply to DEBUGLOG.md
Run
目录中！
⚙️ 解决方案机制
assets 配置的作用
}
工作流程：
编译阶段 - TypeScript 编译 .ts → .js
资源复制阶段 - Nest CLI 根据 assets 配置复制指定的文件
结果 - 非代码文件也被复制到 dist 目录
修复后的目录结构：
Apply to DEBUGLOG.md
复制过来了！
📝 assets 配置详解
支持的模式：
Apply to DEBUGLOG.md
]




- 原报错信息如下
>[Nest] 43596  - 2025/06/08 17:20:16     LOG [NestFactory] Starting Nest application...
[Nest] 43596  - 2025/06/08 17:20:16   ERROR [ExceptionHandler] Error: ENOENT: no such file or directory, open '/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/dist/config/env/dev.yml'
    at readFileSync (node:fs:449:20)
    at InstanceWrapper.exports.default (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/src/config/env/index.ts:14:32)
    at Injector.instantiateClass (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/injector.js:376:55)
    at callback (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/injector.js:65:45)
    at async Injector.resolveConstructorParams (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/injector.js:145:24)
    at async Injector.loadInstance (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/injector.js:70:13)
    at async Injector.loadProvider (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/injector.js:98:9)
    at async /Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/instance-loader.js:56:13
    at async Promise.all (index 4)
    at async InstanceLoader.createInstancesOfProviders (/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/node_modules/.pnpm/@nestjs+core@11.1.1_@nestjs+common@11.1.1_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+pl_bb21eab67da5d6bfae900c526d2a3f5a/node_modules/@nestjs/core/injector/instance-loader.js:55:9) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/ran/Code/Github/zhangran/nest-react-admin/admin-nest/dist/config/env/dev.yml'
}

