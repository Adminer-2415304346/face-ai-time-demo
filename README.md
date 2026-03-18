# Brown Bear Cross-Time Recognition Demo

一个基于 Vue 3 + Vite + Ant Design Vue 的科研演示前端项目，用于展示“跨时间棕熊个体识别”任务，包括数据、模型、系统检索结果与案例演示。

## 1. 项目简介

本项目是一个面向演示视频和现场展示的前端系统，重点围绕以下主线展开：

- 数据集介绍
- 预处理流程
- 模型方案
- 系统检索演示
- 跨时间案例展示
- 指标结果与失败案例

当前项目使用：

- Vue 3
- Vite
- JavaScript
- Ant Design Vue

---

## 2. 环境要求

请确保本机已安装：

- Node.js 18 或更高版本
- npm 9 或更高版本
- Git

3. 获取项目

克隆仓库：

git clone https://github.com/你的用户名/你的仓库名.git

进入项目目录：

cd 你的仓库名

GitHub 官方文档说明，克隆仓库会在本地创建远程仓库的副本，便于继续开发和提交更改。
参考 GitHub Docs：Cloning a repository

4. 安装依赖

在项目根目录执行：

npm install
5. 启动开发环境

执行：

npm run dev

启动后，终端会输出本地访问地址，例如：

http://localhost:5173

打开浏览器访问该地址即可。

6. 生产环境打包

执行：

npm run build

打包完成后会生成：

dist/

如果你想本地预览打包结果，可以执行：

npm run preview
7. 项目目录说明
src/
├─ assets/                 # 静态资源
├─ components/
│  ├─ common/              # 通用组件
│  └─ layout/              # 布局组件
├─ views/
│  └─ demo/                # 各演示场景页面
├─ router/                 # 路由
├─ stores/                 # 状态管理（如后续接入）
└─ utils/                  # 工具函数
8. 当前路由说明

主要页面包括：

/demo/intro 问题引入

/demo/dataset 数据集介绍

/demo/preprocess 预处理流程

/demo/model 模型方案

/demo/system 系统演示

/demo/cases 跨时间案例

/demo/metrics 指标结果

/demo/failures 失败案例

/demo/summary 总结

默认首页会跳转到：

/demo/system
9. 开发说明
新增页面

将新页面放到：

src/views/demo/

并在：

src/router/index.js

中注册路由。

通用卡片组件

项目中统一使用：

src/components/common/BaseCard.vue

以保持一致的轻量卡片视觉风格。

演示布局组件

项目主布局为：

src/components/layout/DemoShell.vue

负责侧边导航、头部和内容区域。
