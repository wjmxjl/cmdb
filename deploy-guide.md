# CMDB 系统部署指南

## 系统要求
- Linux 操作系统
- Docker 已安装
- Docker Compose 已安装

## 部署步骤

### 1. 安装 Docker 和 Docker Compose（如果未安装）

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 导入镜像

```bash
# 导入 Docker 镜像
docker load -i cmdb-app.tar
```

### 3. 创建必要的目录

```bash
# 创建数据目录
mkdir -p data uploads
chmod 777 data uploads
```

### 4. 启动服务

```bash
# 使用 docker-compose 启动服务
docker-compose up -d
```

### 5. 验证部署

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 访问应用
- 浏览器访问：http://服务器IP:5001

## 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
docker-compose logs -f
```

### 停止服务
```bash
docker-compose down
```

### 重启服务
```bash
docker-compose restart
```

## 注意事项
1. 确保 5001 端口未被占用
2. 确保 data 和 uploads 目录有正确的权限
3. 定期备份 data 目录中的数据
4. 如需修改配置，编辑 docker-compose.yml 后重启服务 