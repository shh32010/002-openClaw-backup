# MEMORY.md - 长期记忆

## 关于宝宝
- 名字：浩哥，日常称呼「宝宝」
- 位置：扬州市邗江区
- 偏好：严谨、严肃的交流风格
- 默认浏览器：Microsoft Edge

## 环境配置
- 桌面路径：D:\Users\002\Desktop
- 工作区：C:\Users\002\.openclaw\workspace
- 模型 Provider：custom-gpt-agent-cc（baseUrl: https://gpt-agent.cc/v1）
- 主模型：nvidia/anthropic/claude-3-5-sonnet-20240620
- 备用模型：nvidia/nvidia/nemotron-3-super-120b-a12b
- 微信插件：@tencent-weixin/openclaw-weixin v2.1.6 已安装

## 已知问题
- 2026-04-20：已纠正模型映射，现在所有定时任务使用实际部署的模型（主模型：mistralai/mistral-large-3-675b-instruct-2512，备用：nvidia/nemotron-3-super-120b-a12b）。
- 2026-04-22：所有定时任务统一使用 `claude-sonnet-4-6`（与主会话一致），之前配置的 `nvidia/anthropic/claude-3-5-sonnet-20240620` 在该 provider 上不存在。

## Promoted From Short-Term Memory (2026-05-09)

<!-- openclaw-memory-promotion:memory:memory/2026-04-06.md:1:26 -->
- # 2026-04-06 日志 ## SQL对比任务（carbon.sql vs carbon改版.sql） **任务**：对比两个SQL文件，筛选"销售计划完成率"相关内容，输出到桌面 **文件位置**： - 原始：`D:\Users\002\Desktop\问题\carbon.sql`（7.96MB，29340条语句） - 改版：`D:\Users\002\Desktop\问题\carbon改版.sql`（6.75MB，27609条语句） **结果**： - 改版新增：660条 - 原始删除：666条 - 相同语句：11210条 - 输出文件：`D:\Users\002\Desktop\销售计划完成率差异.md`（372KB） **匹配关键词**：`销售计划`、`完成率`、`销售` **筛选结果涉及表**：`bid_bidding`、`contract_detail`、`data`等 **技术细节**： - Python 脚本：`C:\Users\002\.openclaw\workspace\filter_sales_run.py` - 正则技巧：`s.replace('\`', '')` 去除反引号后提取表名 - 归一化：去反引号 + VALUES PK值归一为 `@PK@` - Node.js 读取验证内容（PowerShell Python stdout 不支持UTF-8显示） [score=0.874 recalls=4 avg=0.829 source=memory/2026-04-06.md:1-26]
