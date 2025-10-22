// 初始化管理员账号和配置
import prisma from './utils/prisma.js';
import bcrypt from 'bcryptjs';

async function init() {
  try {
    // 1. 创建管理员账号
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@chinesemaster.com' },
      update: {},
      create: {
        email: 'admin@chinesemaster.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ 管理员账号已创建:');
    console.log('   📧 Email: admin@chinesemaster.com');
    console.log('   🔑 Password: admin123');
    console.log('   👤 ID:', admin.id);
    
    // 2. 创建GLM-4配置（如果不存在）
    const glmConfig = await prisma.aIConfig.upsert({
      where: { modelName: 'GLM-4' },
      update: {},
      create: {
        modelName: 'GLM-4',
        apiKey: process.env.GLM_API_KEY || 'your-glm-api-key',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        isActive: true,
        isDefault: true
      }
    });
    
    console.log('✅ GLM-4配置已创建:', glmConfig.modelName);
    
    console.log('\n🎉 初始化完成！');
    console.log('👉 请访问 http://localhost:3007 登录管理端');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

init();

