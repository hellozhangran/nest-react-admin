# 项目分析

## 

## 1. 设计几种用户呢
- admin 用户：只有自己用
- vip 用户：充钱的用户，能看到所有功能和数据，但涉及别人相关的操作只能看不能改。
- visitor 用户，自己注册的用户，可保留账号。



## 1. 通用逻辑分析

### 登陆逻辑，每次登陆都会执行
- 1. 登陆login后获取token，放到本地，后续所有请求都带着header.Autheration
- 2. getUserInfo 登陆成功后立即获取用户基本信息，需要包括基本信息和菜单以及权限信息
- 3. 获取路由信息 getRouterInfo

### 刷新逻辑
- 1. 每次刷新页面，先判断是否有 token，没有则navigate 到login.html
- 2. 有token则判断是否有userInfo，没有则发请求取
- 3. 判断是否有routes，没有则发请求取。

#### 刷新页面时，请求缓存方案
- 问题：请教一个技术方案，假设我的页面每次刷新都会请求一个userInfo接口，因为该接口不仅有用户信息，还有权限信息，菜单配置信息。这些信息是初始化页面和菜单所必须的。现在的问题是，我如何让刷新页面的时候请求走缓存，这样可减轻服务端压力，但如果操作过菜单或权限配置之后，再刷新页面请求userInfo就不能走缓存了。鉴于我目前用了react query，帮我设计个方案可以完成我想要的，回答要简洁，直观，别废话。先给方案，别直接改代码
- 使用 react-query 的持久化插件 (如 persistQueryClient) 将 userInfo 的查询缓存到 localStorage 中。
- 在 useMutation 的 onSuccess 回调函数中，调用 queryClient.invalidateQueries({ queryKey: ['userInfo'] })。
效果: 当用户成功修改了权限或菜单后，相关的 userInfo 缓存会被标记为 "失效"。当用户再次刷新页面时，react-query 会发现缓存已失效，从而强制重新从服务器获取最新的 userInfo 数据，并将新数据再次存入 localStorage。


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