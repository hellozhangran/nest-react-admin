梳理下login流程
登陆时：
- 调验证码接口，获取验证码
- 调login接口，传用户名，密码，验证码信息
- 判断password与数据库中password是否一致
- 使用userId获取一大堆用户信息，并更新到redis中
- login接口返回给前端token
其他接口调用：
- 接口带着Autheration过来
- auth.guard先拦住，主要处理白名单
- auth.strategy validate，从redis中把一大堆userInfo放到request中




# 6.9
1. 把role menu dept post 模块创建好
2. 把user模块相关的核心功能接口实现


- captchaImage 获取验证码
- login 登陆


- getInfo 获取用户信息
- getRouters 获取路由信息


- 现有策略在子应用中注册了全局的策略，有问题，见cursor对话
- 了解下nest-admin其他默认行为
    - 已经了解了APP_GUARD
