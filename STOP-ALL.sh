#!/bin/bash

# ChineseMaster - 停止所有服务

echo "⏹️  停止 ChineseMaster 平台..."
echo ""

# 停止后端
if [ -f pids/backend.pid ]; then
    BACKEND_PID=$(cat pids/backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo "✅ 后端已停止 (PID: $BACKEND_PID)"
    fi
    rm pids/backend.pid
fi

# 停止用户端
if [ -f pids/frontend-user.pid ]; then
    USER_PID=$(cat pids/frontend-user.pid)
    if ps -p $USER_PID > /dev/null; then
        kill $USER_PID
        echo "✅ 用户端已停止 (PID: $USER_PID)"
    fi
    rm pids/frontend-user.pid
fi

# 停止管理端
if [ -f pids/admin.pid ]; then
    ADMIN_PID=$(cat pids/admin.pid)
    if ps -p $ADMIN_PID > /dev/null; then
        kill $ADMIN_PID
        echo "✅ 管理端已停止 (PID: $ADMIN_PID)"
    fi
    rm pids/admin.pid
fi

# 额外清理：查找并停止所有相关进程
pkill -f "node.*backend"
pkill -f "next dev"
pkill -f "vite.*admin"

echo ""
echo "✨ 所有服务已停止！"

