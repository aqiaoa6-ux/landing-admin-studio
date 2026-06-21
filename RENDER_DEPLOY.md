# Render 部署说明

## 适用场景

如果你准备继续使用原来的 GitHub 仓库，但要把这个新项目作为独立服务部署到 Render，可以直接按下面配置。

推荐做法：

1. 把 `landing-admin-studio` 整个目录提交到你的原仓库里
2. 在 Render 新建一个 `Web Service`
3. 仓库仍然选你原来的仓库
4. 把 `Root Directory` 指向 `landing-admin-studio`

## Render 面板填写

- Name: `landing-admin-studio`
- Runtime: `Node`
- Root Directory: `landing-admin-studio`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

补充说明：

- 当前目录里的 `render.yaml` 适合项目本身就是仓库根目录时直接使用
- 如果你还是放在原来的大仓库里，最简单的是在 Render 面板手动把 `Root Directory` 设成 `landing-admin-studio`

## 推荐环境变量

- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=888888`
- `ADMIN_JWT_SECRET=请改成你自己的随机长字符串`
- `DATA_ROOT=/var/data/landing-admin-studio`

说明：

- `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 是后台登录账号密码
- `ADMIN_JWT_SECRET` 用来签发后台登录 token
- `DATA_ROOT` 用来指定配置文件和上传图片的持久化目录

## 持久化磁盘

如果你希望后台保存的联系方式、邀请码、品牌、案例图片不会因为重启或重新部署丢失，需要在 Render 给这个服务挂一个 `Persistent Disk`。

建议：

- Mount Path: `/var/data`
- 环境变量 `DATA_ROOT`: `/var/data/landing-admin-studio`

挂载后，项目会把以下内容写到持久化目录：

- `data/site-config.json`
- `uploads/*`

## 健康检查

可以在 Render 里把健康检查路径设为：

- `/api/health`

## 部署完成后访问

- 前台首页：`https://你的域名/`
- 后台登录：`https://你的域名/admin/login`

默认后台账号：

- 账号：`admin`
- 密码：`888888`

建议上线后马上改环境变量密码。

## 当前限制

当前版本已经适合直接部署，但存储仍然是文件型持久化方案，不是数据库方案。

优点：

- 配置简单
- 上线快
- 挂磁盘后就能正常长期保存

后续如果你要更稳，我可以再帮你升级成：

- SQLite 持久化
- 图片独立对象存储
- `render.yaml` 蓝图部署
