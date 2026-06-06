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

## Promoted From Short-Term Memory (2026-05-17)

<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:5:5 -->
- **背景：** 桌面上的 `彻底删除SQL_Server.ps1` 脚本在 PowerShell 中运行时出现中文乱码。 [score=0.865 recalls=0 avg=0.620 source=memory/2026-05-12.md:5-5]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:15:18 -->
- ```powershell [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 $OutputEncoding = [System.Text.Encoding]::UTF8 chcp 65001 | Out-Null [score=0.815 recalls=0 avg=0.620 source=memory/2026-05-12.md:15-18]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:23:23 -->
- **最佳实践：** 写含中文的 PowerShell 脚本时，始终保存为 **UTF-8 with BOM**，这是兼容性最好的方案。 [score=0.815 recalls=0 avg=0.620 source=memory/2026-05-12.md:23-23]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:25:25 -->
- **相关文件：** `D:\Users\002\Desktop\彻底删除SQL_Server.ps1` [score=0.815 recalls=0 avg=0.620 source=memory/2026-05-12.md:25-25]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:7:7 -->
- **问题根因：** [score=0.805 recalls=0 avg=0.620 source=memory/2026-05-12.md:7-7]

## Promoted From Short-Term Memory (2026-05-18)

<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:12:12 -->
- **解决方案（任选一）：** [score=0.812 recalls=0 avg=0.620 source=memory/2026-05-12.md:12-12]

## Promoted From Short-Term Memory (2026-06-06)

<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:13:14 -->
- PowerShell 中文编码坑: **文件加 BOM：** 用编辑器将 `.ps1` 保存为 **UTF-8 with BOM**，PowerShell 5.x 能识别 BOM 并正确解码; **脚本开头加编码声明：** [score=0.837 recalls=0 avg=0.620 source=memory/2026-05-12.md:13-14]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:20:21 -->
- PowerShell 中文编码坑: **改用 PowerShell 7+（pwsh）：** 默认 UTF-8，不会有这个问题; **控制台改代码页：** 运行前手动执行 `chcp 65001` [score=0.837 recalls=0 avg=0.620 source=memory/2026-05-12.md:20-21]
<!-- openclaw-memory-promotion:memory:memory/2026-05-12.md:8:10 -->
- PowerShell 中文编码坑: Windows PowerShell 5.x 默认编码是 GBK（代码页 936），不是 UTF-8; `.ps1` 文件若以 UTF-8 无 BOM 保存，PowerShell 5.x 会按系统默认编码（GBK）读取 → 中文乱码; `Write-Host` 输出到控制台时，如果控制台代码页不是 65001（UTF-8），中文也会乱码 [score=0.827 recalls=0 avg=0.620 source=memory/2026-05-12.md:8-10]
