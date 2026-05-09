# openClaw-backup

> 宝宝的 AI 助手（OpenClaw）工作区自动备份仓库

## 📦 仓库简介

本仓库是 OpenClaw AI 助手工作区的自动备份，由每日凌晨 3:00 的定时任务自动驱动。每次备份会自动生成压缩包并推送到 GitHub，确保工作区数据安全不丢失。

## 📋 备份内容

| 类别 | 说明 |
|------|------|
| **配置文件** | `openclaw.json` 等核心配置 |
| **身份与设定** | `SOUL.md`（人格）、`IDENTITY.md`（身份）、`USER.md`（用户信息） |
| **工作区规范** | `AGENTS.md`（工作规范）、`TOOLS.md`（工具笔记）、`HEARTBEAT.md`（心跳任务） |
| **记忆文件** | `memory/` 目录下的日常记录与长期记忆 |
| **技能（Skills）** | 所有已安装的 OpenClaw 技能 |
| **定时任务** | 定时任务配置与调度信息 |

> ⚠️ 备份已排除 `completions/` 缓存、`plugin-runtime-deps/`（npm 依赖，可再生）、日志文件和锁文件。

## 🧩 已安装技能（62 个）

### 工作区技能（9 个）
*位于 `~/.openclaw/workspace/skills/`*

| 技能 | 功能 |
|------|------|
| `agent-browser-core` | 浏览器自动化（Rust + Playwright） |
| `find-skills` | 技能搜索与安装助手 |
| `office-document-editor` | 专业 Word 编辑（修订模式、Git 版本控制） |
| `office-editor` | Word/Excel/PowerPoint 文件创建与编辑 |
| `office-toolkit` | Office 综合工具包（读写、格式转换、批处理） |
| `openclaw-backup` | 备份与恢复管理 |
| `skill-vetter` | 技能安全审查，安装前风险评估 |
| `skillhub-preference` | 优先使用 skillhub 进行技能管理 |
| `windows-screenshot` | Windows 截图工具 |

### 全局内置技能（53 个）
*位于 `node_modules/openclaw/skills/`*

**Apple/macOS 专用（9 个）：** `apple-notes`、`apple-reminders`、`bluebubbles`、`imsg`、`peekaboo`、`things-mac`、`tmux`、`sherpa-onnx-tts`、`sag`

**智能家居/设备（5 个）：** `openhue`（飞利浦 Hue）、`blucli`（BluOS）、`sonoscli`（Sonos）、`camsnap`（摄像头）、`eightctl`（智能床）

**笔记/文档/待办（6 个）：** `notion`、`obsidian`、`bear-notes`、`trello`、`1password`、`taskflow`

**社交/消息（4 个）：** `discord`、`slack`、`wacli`（WhatsApp）、`xurl`（Twitter/X）

**开发/GitHub（7 个）：** `github`、`gh-issues`、`coding-agent`、`mcporter`、`oracle`、`session-logs`、`clawhub`

**AI/媒体（6 个）：** `gemini`、`summarize`、`video-frames`、`songsee`、`openai-whisper`、`gifgrep`

**云服务（3 个）：** `gog`（Google Workspace）、`goplaces`（Google Places）、`blogwatcher`

**邮件/通讯（2 个）：** `himalaya`（终端邮件）、`voice-call`

**音乐/播放（2 个）：** `spotify-player`、`ordercli`（外卖）

**实用工具（9 个）：** `weather`、`healthcheck`、`node-connect`、`skill-creator`、`model-usage`、`nano-pdf`、`taskflow-inbox-triage`、`canvas`、`openai-whisper-api`

## ⏰ 定时任务

| 任务名 | 时间 | 模型 | 状态 | 说明 |
|--------|------|------|------|------|
| **每日备份** | **每天 03:00** | deepseek-v4-pro | ✅ 正常 | **tar 打包 + git push** |
| Memory Dreaming | 每天 03:00 | 默认 | ✅ 正常 | 短期记忆自动晋升 |

## 🔄 备份流程

```
定时触发（每天 03:00 Asia/Shanghai）
    │
    ├─── 运行 backup-task.ps1 → tar 打包生成 openclaw-YYYY-MM-DD_HHMM.zip
    │
    ├─── 保留最近 7 个备份，自动轮转删除旧备份
    │
    ├─── git add + git commit
    │
    └─── git push origin main
```

## 🔧 本地恢复流程

```powershell
# 1. 停止 Gateway
openclaw gateway stop

# 2. 备份当前目录
Rename-Item ~/.openclaw ~/.openclaw-old

# 3. 解压最新备份
tar -xf ~/openclaw-backups/openclaw-YYYY-MM-DD_HHMM.zip -C ~

# 4. 重启 Gateway
openclaw gateway start
```

## 📁 目录结构

```
~/.openclaw/
├── openclaw.json          # 主配置文件
├── credentials/            # API 密钥与凭证
├── agents/                # Agent 配置
├── workspace/             # ← 本仓库（工作区）
│   ├── SOUL.md            # 人格定义
│   ├── USER.md            # 用户信息
│   ├── AGENTS.md          # 工作规范
│   ├── TOOLS.md           # 工具笔记
│   ├── HEARTBEAT.md       # 心跳任务
│   ├── BACKUP.md          # 备份记录
│   ├── memory/            # 记忆文件
│   └── skills/            # 已安装技能
├── cron/                  # 定时任务配置
└── extensions/            # 插件
```

## 🔑 Git 配置

- **用户名：** shh32010
- **远程仓库：** git@github.com:shh32010/openClaw-backup.git
- **默认分支：** main

## 🤖 模型配置

| 用途 | Provider | 模型 | 上下文窗口 | 状态 |
|------|----------|------|-----------|------|
| **主模型** | xiaomi-coding | `mimo-v2.5-pro` | 1M tokens | ✅ 正常 |
| **备用模型 1** | custom-gpt-agent-cc | `claude-sonnet-4-6` | 196K tokens | ✅ 已配置 |
| **备用模型 2** | nvidia | `deepseek-ai/deepseek-v4-pro` | 1M tokens | ✅ 已配置 |

> 主模型：xiaomi-coding/mimo-v2.5-pro；备用：nvidia/deepseek-ai/deepseek-v4-pro

## 🔌 已安装插件

| 插件 | 状态 | 说明 |
|------|------|------|
| `anthropic` | ✅ 启用 | Anthropic API 支持 |
| `memory-core` | ✅ 启用 | 记忆系统（dreaming 已开启） |
| `nvidia` | ✅ 启用 | Nvidia Nim 模型支持 |

---

## 📝 备份记录格式

每次备份后，BACKUP.md 会追加以下格式记录：

| 日期 | 时间 | 文件大小 | 备份文件路径 |
|------|------|----------|--------------|
| 2026-05-09 | 20:55 | 435.9 MB | `C:\Users\002\openclaw-backups\openclaw-2026-05-09_2055.zip` |

---

_本文件最后更新于 2026-05-09_
