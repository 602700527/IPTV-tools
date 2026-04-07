# Tasks

## 第一阶段：传统SEO结构化数据优化

- [ ] Task 1: 在首页增加FAQPage JSON-LD结构化数据
  - [ ] SubTask 1.1: 准备10个高质量FAQ问答（覆盖用户常见问题）
  - [ ] SubTask 1.2: 在home-page.js中添加FAQPage JSON-LD模板
  - [ ] SubTask 1.3: 验证JSON-LD格式正确

- [ ] Task 2: 在分类页增加BreadcrumbList结构化数据
  - [ ] SubTask 2.1: 在category-page.js中添加BreadcrumbList JSON-LD
  - [ ] SubTask 2.2: 验证分类页面包屑正确显示

- [ ] Task 3: 在频道页增加VideoObject结构化数据
  - [ ] SubTask 3.1: 在channel-page.js中添加VideoObject JSON-LD
  - [ ] SubTask 3.2: 验证频道页结构化数据包含直播信息

## 第二阶段：GEO（生成式引擎优化）

- [ ] Task 4: 添加Organization结构化数据
  - [ ] SubTask 4.1: 在首页添加Organization JSON-LD（网站名称、描述、联系方式、社交媒体）
  - [ ] SubTask 4.2: 验证AI可读取组织信息

- [ ] Task 5: 增强FAQ内容（供AI学习）
  - [ ] SubTask 5.1: 增加10个高质量FAQ问答，内容涵盖：
    - 如何免费观看IPTV
    - 订阅服务的优势
    - 支持的设备列表
    - 频道数量和类别
    - 合法性说明
    - 播放质量问题解决
    - 账户管理
    - 退款政策
    - 技术支持
    - 定期更新说明
  - [ ] SubTask 5.2: 在FAQ JSON-LD中使用详细答案

## 第三阶段：营销FAQ区块（页脚共享）

- [ ] Task 6: 在页脚组件增加FAQ常见问题区块
  - [ ] SubTask 6.1: 在page-footer.js中创建FAQ区块HTML结构（可展开/收起）
  - [ ] SubTask 6.2: 添加FAQ区块CSS样式
  - [ ] SubTask 6.3: 验证所有页面（首页、分类页、频道页）共享FAQ区块

## 第四阶段：验证与测试

- [ ] Task 7: 全面验证结构化数据
  - [ ] SubTask 7.1: 使用Google Rich Results Test验证首页JSON-LD
  - [ ] SubTask 7.2: 验证分类页JSON-LD
  - [ ] SubTask 7.3: 验证频道页JSON-LD
  - [ ] SubTask 7.4: 验证FAQ区块功能
  - [ ] SubTask 7.5: 验证Organization数据格式

# Task Dependencies

- Task 1, 2, 3, 4, 5 之间无强依赖关系，可以并行开发
- Task 6 依赖 Task 5（FAQ区块内容来自FAQ数据）
- Task 7 依赖 Task 1, 2, 3, 4, 5, 6 全部完成后执行