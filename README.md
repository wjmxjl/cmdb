# CMDB 资产管理系统

一个基于 Flask 的轻量级配置管理数据库（CMDB）系统，用于管理和追踪 IT 资产。

## 功能特点

- 🖥️ 服务器资产管理
- 📱 手机资产管理
- 🔑 密码管理
- 📊 数据统计与可视化
- 🔍 资产搜索与筛选
- 📝 资产变更记录
- 🔄 数据导入导出
- 👥 用户权限管理

## 技术栈

- 后端：Python Flask
- 前端：HTML, CSS, JavaScript
- 数据库：SQLite
- 部署：Docker

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/wjmxjl/cmdb.git
cd cmdb
```

### 2. 创建虚拟环境

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# 或
.venv\Scripts\activate  # Windows
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 5. 运行应用

```bash
python app.py
```



## 使用说明

1. 访问 `http://localhost:5000` 进入系统


## 目录结构

```
cmdb/
├── app.py              # 主应用文件
├── static/             # 静态文件
├── templates/          # HTML模板
├── uploads/            # 上传文件目录
├── data/               # 数据文件
├── requirements.txt    # 依赖包列表
└── README.md           # 项目说明
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者：wjmxjl
- GitHub：[https://github.com/wjmxjl](https://github.com/wjmxjl) 