#!/bin/bash

# ChineseMaster - 一键启动脚本

echo "🚀 启动 ChineseMaster 平台..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo ""

# 启动后端
echo "📦 启动后端 API (端口 3000)..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端 PID: $BACKEND_PID"
cd ..

# 等待后端启动
sleep 3

# 启动用户端
echo "🌐 启动用户端 (端口 3001)..."
cd frontend-user
npm run dev > ../logs/frontend-user.log 2>&1 &
USER_PID=$!
echo "✅ 用户端 PID: $USER_PID"
cd ..

# 启动管理端
echo "🔧 启动管理端 (端口 3002)..."
cd admin
npm run dev > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
echo "✅ 管理端 PID: $ADMIN_PID"
cd ..

echo ""
echo "🎉 所有服务已启动!"
echo ""
echo "📍 访问地址:"
echo "   用户端: http://localhost:3001"
echo "   管理端: http://localhost:3002"
echo "   后端API: http://localhost:3000"
echo ""
echo "📋 默认账号:"
echo "   管理员: admin@demo.com / admin123"
echo "   用户: user@demo.com / user123"
echo ""
echo "📝 日志文件:"
echo "   后端: logs/backend.log"
echo "   用户端: logs/frontend-user.log"
echo "   管理端: logs/admin.log"
echo ""
echo "⏹️  停止所有服务: ./STOP-ALL.sh"
echo ""

# 保存 PID
mkdir -p pids
echo $BACKEND_PID > pids/backend.pid
echo $USER_PID > pids/frontend-user.pid
echo $ADMIN_PID > pids/admin.pid

echo "✨ 启动完成！祝学习愉快！"

