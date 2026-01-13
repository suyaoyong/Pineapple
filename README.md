# 本项目运行与故障复盘（可复制可操作）

本文档按 **时间线** 与 **问题类型** 组织，记录今天所有故障、原因与排查步骤，方便后续复盘与快速恢复。

---

## 0. 一键启动（先按这套跑起来）

1) 安装依赖
```bash
pnpm install
```

2) 创建/更新 `.env.local`
```env
OPENAI_API_KEY=你的OpenAIKey
HTTPS_PROXY=http://127.0.0.1:10809
HTTP_PROXY=http://127.0.0.1:10809
# 可选：超时拉长
OPENAI_TIMEOUT_MS=40000
# 可选：走网关
# OPENAI_BASE_URL=https://你的网关/v1/images
```

3) 启动
```bash
pnpm dev
```

4) 访问
```
http://localhost:3000
```

---

## 1. 时间线复盘（发生顺序）

### T1: 前端“Generate Now”只是模拟，没有真实调用
**现象**  
点击按钮只是假生成，页面显示固定图片。

**原因**  
`components/editor-section.tsx` 里使用 `setTimeout` 模拟，没有调用服务端。

**处理**  
新增 `app/api/generate/route.ts`，前端调用 `/api/generate`，真实请求 OpenAI。

---

### T2: 网页无法访问（拒绝访问）
**现象**  
浏览器无法打开 `http://localhost:3000`。

**原因**  
Next dev 未运行或端口 3000 未监听。

**排查/处理**
```bash
netstat -ano | findstr :3000
pnpm dev
```

---

### T3: OpenAI 连接超时（ConnectTimeout）
**现象**  
`fetch failed` / `UND_ERR_CONNECT_TIMEOUT` / `api.openai.com:443`

**原因**  
Node 进程不走浏览器代理；v2rayN 仅影响浏览器。

**排查**
```powershell
Test-NetConnection api.openai.com -Port 443
Invoke-WebRequest -Uri "https://api.openai.com/v1/models" -Method Head -Proxy "http://127.0.0.1:10809"
```
> 若返回 401，说明代理通但缺少鉴权（正常）。

**处理**  
在 `.env.local` 写入：
```env
HTTPS_PROXY=http://127.0.0.1:10809
HTTP_PROXY=http://127.0.0.1:10809
```
并 **重启** `pnpm dev` 让 Node 读到环境变量。

---

### T4: 构建报错 `Module not found: undici`
**现象**  
`Module not found: Can't resolve 'undici'`

**原因**  
代理逻辑依赖 `undici`，但没安装。

**处理**
```bash
pnpm add undici
```

---

### T5: 组织验证限制（模型不可用）
**现象**  
`Your organization must be verified to use the model gpt-image-1-mini`

**原因**  
GPT Image 模型需要组织验证。

**处理**  
临时切换为不需要组织验证的模型（当前方案用 `dall-e-2`）。

---

### T6: 参数不兼容（output_format 报错）
**现象**  
`Unknown parameter: 'output_format'`

**原因**  
`output_format` 是 GPT Image 模型参数；DALL·E 需要 `response_format`。

**处理**  
在 DALL·E 模型下使用：
```json
{ "response_format": "b64_json" }
```

---

### T7: 图生图格式不支持（JPEG）
**现象**  
`Invalid file 'image': unsupported mimetype ('image/jpeg')`

**原因**  
DALL·E 图生图只支持 PNG。

**处理**  
前端上传时把 JPG/JPEG 通过 Canvas 转成 PNG 再发送。

---

### T8: 端口冲突（3000 被占用）
**现象**  
`Port 3000 is in use ...` / `Unable to acquire lock`

**处理**
```bash
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

---

## 2. 问题类型索引（按类型快速定位）

### 网络类（无法连接 OpenAI）
**关键症状**  
`fetch failed` / `ConnectTimeout` / `api.openai.com:443`

**处理**  
1) 配置代理环境变量  
2) 重启 `pnpm dev`  
3) 测试代理是否可用  
```powershell
Invoke-WebRequest -Uri "https://api.openai.com/v1/models" -Method Head -Proxy "http://127.0.0.1:10809"
```

---

### 计费类（Billing hard limit）
**关键症状**  
`Billing hard limit has been reached`

**原因**  
API 计费与 ChatGPT 订阅分离，需单独设置 API 预算或预付费余额。

**处理**  
去 OpenAI 平台设置 Usage Limits 或充值预付费余额。

---

### 模型权限类（组织验证）
**关键症状**  
`organization must be verified`

**处理**  
完成组织验证或临时切换模型（DALL·E）。

---

### 参数/格式类（output_format / JPEG）
**关键症状**  
`Unknown parameter: output_format` / `unsupported mimetype`

**处理**  
1) DALL·E 用 `response_format`  
2) JPG/JPEG 转 PNG 再上传

---

### 运行类（端口冲突/无法访问）
**关键症状**  
网页打不开、端口占用

**处理**
```bash
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
pnpm dev
```

---

## 3. 关键文件说明

- `components/editor-section.tsx`  
  负责前端上传、Prompt、调用 `/api/generate`、图片预览；已内置 JPG → PNG 转换逻辑。

- `app/api/generate/route.ts`  
  负责请求 OpenAI，区分 text-to-image / image-to-image，并处理不同模型参数。

- `.env.local`  
  存放 `OPENAI_API_KEY` 与代理设置，必须重启 `pnpm dev` 才生效。

---

## 4. 日志定位

开发日志会写到：
- `dev.*.out.log`
- `dev.*.err.log`

如果生成失败：
1) 先看 `dev.*.out.log` 是否有 `POST /api/generate 500`
2) 再看 `dev.*.err.log` 的具体错误

---

## 5. 安全提醒

- `.env.local` 不要提交到 git。  
- 如果 API Key 曾被曝光，建议立即到控制台轮换。

