# Face AI-Time Recognition Demo

一个基于 Vue 3 + Vite + Ant Design Vue 的科研演示前端项目，用于展示“跨时间个体识别”任务，包括数据、模型、系统检索结果与案例演示。

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

git clone https://github.com/Adminer-2415304346/face-ai-time-demo.git

进入项目目录：

cd face-ai-time-demo

4. 安装依赖

在项目根目录执行：

npm install

5. 启动开发环境

执行：

npm run dev

启动后，终端会输出本地访问地址，例如：

http://localhost:5173

打开浏览器访问该地址即可。


6. 开发说明
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

下面是项目整体目录：
project-root/
├─ public/                              # 公共静态资源目录，打包时原样输出
│  ├─ images/                           # 放不需要被打包处理的图片资源
│  │  ├─ query/                         # 查询图样例
│  │  ├─ results/                       # 检索结果样例图
│  │  ├─ species/                       # 非人类生物数据相关图片
│  │  └─ human/                         # 人脸迁移验证相关图片
│  └─ favicon.ico                       # 网站图标
│
├─ src/                                 # 项目主源码目录
│  ├─ assets/                           # 需要被构建工具处理的静态资源
│  │  ├─ images/                        # 本地图片资源（正式素材放这里）
│  │  │  ├─ intro/                      # 问题引入页素材
│  │  │  ├─ dataset/                    # 数据集介绍页素材
│  │  │  ├─ system/                     # 系统演示页素材
│  │  │  ├─ metrics/                    # 指标页图表素材
│  │  │  └─ failures/                   # 失败案例页素材
│  │  └─ styles/                        # 全局样式文件
│  │     ├─ index.css                   # 全局样式入口
│  │     ├─ theme.css                   # 主题变量和基础视觉风格
│  │     └─ antd-overrides.css          # Ant Design Vue 组件样式覆写
│  │
│  ├─ components/                       # 通用组件目录
│  │  ├─ common/                        # 基础通用组件
│  │  │  └─ BaseCard.vue                # 统一卡片组件，整个项目的轻卡片风格基础
│  │  │
│  │  ├─ layout/                        # 布局组件
│  │  └─ DemoShell.vue               # 演示系统主布局，含侧边栏、头部、内容区
│  │ 
│  │
│  ├─ views/                            # 页面视图目录
│  │  └─ demo/                          # 比赛演示相关页面
│  │     ├─ IntroScene.vue              # 问题引入页：解释跨时间识别为什么难
│  │     ├─ DatasetScene.vue            # 数据集介绍页：双数据域结构展示
│  │     ├─ PreprocessScene.vue         # 预处理流程页（待补）
│  │     ├─ ModelScene.vue              # 模型方案页（待补）
│  │     ├─ SystemDemoScene.vue         # 系统演示页：双模式检索展示
│  │     ├─ CrossTimeScene.vue          # 跨时间案例页（待补）
│  │     ├─ MetricsScene.vue            # 指标结果页（待补）
│  │     ├─ FailureScene.vue            # 失败案例页（待补）
│  │     └─ SummaryScene.vue            # 总结页（待补）
│  │
│  ├─ router/                           # 路由配置目录
│  │  └─ index.js                       # Vue Router 路由入口文件
│  │
│  ├─ stores/                           # 状态管理目录（现在空着，后续可接 Pinia）
│  │  ├─ demo.js                        # 演示流程状态管理（后续补）
│  │  └─ scene.js                       # 场景局部状态管理（后续补）
│  │
│  ├─ mock/                             # 前端演示用 mock 数据
│  │  ├─ introData.js                   # 问题引入页假数据
│  │  ├─ datasetData.js                 # 数据集页假数据
│  │  ├─ retrievalCases.js              # 系统演示页检索案例数据
│  │  ├─ metricsData.js                 # 指标页数据
│  │  ├─ failuresData.js                # 失败案例页数据
│  │  └─ summaryData.js                 # 总结页数据
│  │
│  ├─ utils/                            # 工具函数目录
│  │  ├─ format.js                      # 文本、数字、标签格式化
│  │  ├─ constants.js                   # 项目常量配置
│  │  └─ helpers.js                     # 通用辅助函数
│  │
│  ├─ App.vue                           # 应用根组件
│  └─ main.js                           # 应用入口文件
│
├─ .gitignore                           # Git 忽略文件配置
├─ index.html                           # Vite HTML 入口
├─ package.json                         # 项目依赖和脚本配置
├─ package-lock.json                    # npm 锁定文件
├─ vite.config.js                       # Vite 配置文件
└─ README.md                            # 项目说明文档
