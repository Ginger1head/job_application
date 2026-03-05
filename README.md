# JobTrack - 求职进度跟踪工具 / JobTrack - Job Search Tracking Tool

## 项目简介 / Project Introduction

JobTrack 是一款专为求职者设计的进度跟踪工具，帮助用户结构化记录求职全流程，通过时间线视图直观追踪进展，减少信息遗漏。适用于应届生和在职转行者。

JobTrack is a job search tracking tool designed specifically for job seekers, helping users structure their entire job hunting process, track progress through a timeline view, and reduce information loss. It is suitable for fresh graduates and professionals changing careers.

## 功能特性 / Features

### 核心功能 / Core Features
- **双视图模式切换** - 列表视图与甘特图视图
- **记录管理** - 添加、编辑、删除求职记录
- **状态跟踪** - 支持多种状态（已投递、初面、二面、终面、Offer、拒信等）
- **数据持久化** - 使用浏览器 localStorage 存储数据

- **Dual View Mode** - Switch between list view and Gantt chart view
- **Record Management** - Add, edit, delete job search records
- **Status Tracking** - Support multiple statuses (Applied, First Interview, Second Interview, Final Interview, Offer, Rejection, etc.)
- **Data Persistence** - Store data using browser localStorage

### 补充功能 / Additional Features
- **智能筛选** - 按公司、状态、时间范围筛选
- **数据导出** - 导出为 CSV 格式用于复盘分析
- **响应式设计** - 适配 PC、平板、手机等设备
- **状态历史** - 记录完整状态变迁时间线

- **Smart Filtering** - Filter by company, status, date range
- **Data Export** - Export to CSV format for review and analysis
- **Responsive Design** - Compatible with PC, tablet, mobile devices
- **Status History** - Record complete status change timeline

## 技术架构 / Technical Architecture

- **前端技术** - HTML5, CSS3, JavaScript (ES6+)
- **数据存储** - 浏览器 localStorage
- **无外部依赖** - 纯前端实现，无需后端服务
- **Frontend Technology** - HTML5, CSS3, JavaScript (ES6+)
- **Data Storage** - Browser localStorage
- **No External Dependencies** - Pure frontend implementation, no backend required

## 快速开始 / Quick Start

### 本地部署 / Local Deployment
1. 克隆或下载项目到本地
2. 打开 `index.html` 文件即可使用

1. Clone or download the project locally
2. Open the `index.html` file to use

### 使用方法 / Usage
- 点击 "+ 添加记录" 开始记录求职信息
- 在列表视图中查看所有记录
- 切换到甘特图视图查看时间线
- 使用筛选器快速定位特定记录
- 导出数据进行复盘分析

- Click "+ Add Record" to start recording job search information
- View all records in list view
- Switch to Gantt chart view to see timeline
- Use filters to quickly locate specific records
- Export data for review and analysis

## 文件结构 / File Structure

```
JobTrack/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 应用逻辑
└── README.md           # 说明文档
```

```
JobTrack/
├── index.html          # Main page
├── styles.css          # Style sheet
├── app.js              # Application logic
└── README.md           # Documentation
```

## 系统要求 / System Requirements

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 启用 JavaScript 和 localStorage
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Enable JavaScript and localStorage

## 版权声明 / Copyright Notice

本项目仅供学习和参考使用，您可以自由修改和分发。

This project is for learning and reference purposes only, you may freely modify and distribute it.

## 更新日志 / Changelog

### v1.0.0
- 初始版本发布
- Initial version release
