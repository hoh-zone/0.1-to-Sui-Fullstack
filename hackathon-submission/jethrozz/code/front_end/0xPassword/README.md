## 项目名称

0xPassword

## 项目描述

基于sui链的一个密码管理插件 
类似于1password的插件

## 密码保存和填充
用户安装插件后（钱包和本插件）

1. 设置用户主密码。
2. 将用户主密码进行签名，拿到签名，用签名来派生密钥
3. 用派生密钥来加密用户密码,  随机生成一个盐值，用盐值和派生密钥来加密用户密码
4. 将加密后的密码存储在sui链上
5. 用户在登录页面时，会自动匹配域名，填充用户名和密码

## 主密码保存
主密码保存在本地，用签名来派生密钥，用派生密钥来加密用户密码


## Starting your dApp

To install dependencies you can run

```bash
pnpm install
```

To start your dApp in development mode run

```bash
pnpm dev
```

## Building

To build your app for deployment you can run

```bash
pnpm build
```
