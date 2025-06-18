# 项目分析

## 1. 整体项目结构
- 还算清晰，但可能有些不清晰的地方，比如shadcn的范围不清晰

## 2. 样式与主题
- 系统学习下shadcn
- 系统学习下tailwindCSS
  https://tailwind.org.cn/docs/installation/using-vite

## 3. 路由与页面加载

## 4. 登陆与权限

## 5. 接口逻辑及mock
- src/_mock 中实现了具体接口的mock，在main.ts 中开启
- api/ 中实现了对接口的定义，即 fetcher
- 在业务逻辑中，通过react query 配合api中的fetcher去调接口

## 6. 状态管理