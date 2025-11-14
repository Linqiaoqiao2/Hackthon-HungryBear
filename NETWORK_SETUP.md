# 网络配置指南

## 问题诊断和修复步骤

### 1. 验证IP地址
当前配置的IP地址是：`172.21.114.187`

要验证或更新IP地址，运行：
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

如果IP地址已更改，请更新 `frontend/services/config.ts` 中的 `PHYSICAL_DEVICE_IP` 值。

### 2. 启动Django服务器（重要！）

**关键问题**：Django默认只监听 `127.0.0.1:8000`，这只能从本机访问。要从其他设备（如手机）访问，必须监听 `0.0.0.0:8000`。

#### 正确的启动方式：

```bash
cd backend
source venv/bin/activate  # 如果使用虚拟环境
python manage.py runserver 0.0.0.0:8000
```

**不要使用**：
```bash
python manage.py runserver  # 这只监听127.0.0.1，无法从外部访问
```

### 3. 验证服务器是否正在运行

在另一个终端运行：
```bash
curl http://172.21.114.187:8000/api/recipes/
```

如果返回数据或JSON响应，说明服务器配置正确。

### 4. 检查防火墙

确保防火墙允许端口8000的入站连接：
- macOS: 系统设置 > 网络 > 防火墙
- 确保允许Python/Django的连接

### 5. 确保设备在同一网络

- 手机和电脑必须在同一个WiFi网络
- 不能使用手机热点（除非电脑连接到手机热点）

### 6. 测试连接

在前端应用中，检查控制台是否有错误信息。如果看到 "Network request failed"，请检查：
1. Django服务器是否正在运行（`0.0.0.0:8000`）
2. IP地址是否正确
3. 设备是否在同一网络

## 已完成的修复

✅ 添加了 `django-cors-headers` 支持
✅ 配置了CORS设置允许所有来源（仅开发环境）
✅ 更新了 `requirements.txt`

## 下一步

1. 停止当前运行的Django服务器（如果正在运行）
2. 使用 `python manage.py runserver 0.0.0.0:8000` 重新启动
3. 验证IP地址是否正确
4. 测试前端应用连接

