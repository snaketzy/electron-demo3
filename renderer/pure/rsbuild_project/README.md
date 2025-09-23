# Rsbuild project

## 环境配置说明
执行nvm use ，会根据.nvmrc切换到项目需要的node版本

##
```
填写信息
http://localhost:8088/huamingce/infowrite?qrcode=202506124310000001&bindCardType=2&bankCardBindStatus=1&secondBankType=SPDB&skipOpenAccount=1

资料信息上传
http://localhost:8088/huamingce/upload?qrcode=202506124310000001&bindCardType=2&bankCardBindStatus=1&secondBankType=SPDB&skipOpenAccount=1
```

信息预览
http://localhost:8088/huamingce/detail?qrcode=202506124310000001
## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server, and the app will be available at [http://localhost:3000](http://localhost:3000).

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Learn more

To learn more about Rsbuild, check out the following resources:

- [Rsbuild documentation](https://rsbuild.rs) - explore Rsbuild features and APIs.
- [Rsbuild GitHub repository](https://github.com/web-infra-dev/rsbuild) - your feedback and contributions are welcome!
