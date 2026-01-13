# 今日故障排除纪实（文章版）

> 记录人与助手之间的完整沟通过程与排查步骤，便于复盘与培训。

## 一、背景与目标

今天的目标是把一个本地 AI 生成图片网页真正接入 OpenAI API：
- 点击首页“Generate Now”时调用后端
- 支持“text to image”和“image to image”两种模式
- 使用“Main Prompt”作为提示词
- 通过本地 `http://localhost:3000` 访问

---

## 二、事件经过（按时间线）

### 1）启动项目

用户：请运行这个项目并保持，我本地打开。

我先检查项目结构与 `package.json`，确认是 Next.js 项目，然后安装依赖并启动。

关键动作：
```bash
pnpm install
pnpm dev
```

随后确认端口 3000 正在监听。

---

### 2）网页无法访问

用户：无法访问此网站。

我检查端口 3000 是否在监听，发现没有。于是重新启动 `pnpm dev` 并确认监听成功。

用户随后反馈：可以访问了。

---

### 3）需要接入 OpenAI API

用户：网页是 AI 生成图片，需要植入 API Key，点击“Generate Now”后调用 AI，支持 image-to-image / text-to-image。

我定位到 `components/editor-section.tsx`，发现 `handleGenerate` 只是 `setTimeout` 模拟。于是：
- 新增 `app/api/generate/route.ts`
- 前端改为调用 `/api/generate`
- 使用 `Main Prompt` 作为提示词

---

### 4）重新启动服务

用户已创建 `.env.local` 并提供 key，要求重启。

我停止旧进程后重新启动 `pnpm dev`，确认端口 3000 监听。

---

### 5）连接 OpenAI 超时

用户贴出错误日志：`Connect Timeout Error api.openai.com:443`。

我判断是 Node 服务未走代理，于是：
- 支持 `OPENAI_BASE_URL` 与 `OPENAI_TIMEOUT_MS`
- 引导设置代理环境变量
- 识别到 v2rayN 本地代理端口是 `http:10809`
- 写入 `.env.local`

```env
HTTPS_PROXY=http://127.0.0.1:10809
HTTP_PROXY=http://127.0.0.1:10809
```

并重启服务。

---

### 6）依赖缺失 undici

用户反馈构建报错：`Module not found: Can't resolve 'undici'`。

我安装依赖：
```bash
pnpm add undici
```

并重新启动。

---

### 7）计费限制

用户反馈：`Billing hard limit has been reached`。

我解释：ChatGPT 订阅与 OpenAI API 计费独立，需要在平台设置 Usage Limits 或预付费余额。

---

### 8）组织验证限制

用户反馈：模型 `gpt-image-1-mini` 需要组织验证。

用户选择临时切换模型。我将后端默认模型映射改为 DALL·E：
- `dall-e-2`（避免组织验证）
- 图生图强制使用 `dall-e-2`

并重启服务。

---

### 9）网页再次拒绝访问

用户：网页拒绝访问。

我发现 dev 服务停止，重新启动并确认端口 3000 监听。

---

### 10）参数不兼容

用户：生成时报错 `Unknown parameter: output_format`。

原因：DALL·E 不支持 `output_format`，需要 `response_format`。

我修改后端请求：
- DALL·E → `response_format: "b64_json"`
- GPT Image → `output_format: "png"`

并重启服务。

---

### 11）图生图格式不支持 JPEG

用户：`Invalid file 'image': unsupported mimetype ('image/jpeg')`。

原因：DALL·E 图生图仅接受 PNG。

我在前端上传逻辑中增加转换：
- 上传 JPG/JPEG → Canvas 转 PNG → 再发送

---

### 12）网络再次故障

用户：按钮显示 “Network error. Please try again.”

我检查日志发现服务端多次 `POST /api/generate 500`。
随后测试代理：
```powershell
Invoke-WebRequest -Uri "https://api.openai.com/v1/models" -Method Head -Proxy "http://127.0.0.1:10809"
```
返回 401，说明代理可通。

我把代理设置改为全局生效（undici 的 global dispatcher），再重启服务。之后文生图成功。

---

## 三、最终结论与可复用经验

1. **前端按钮必须调用真实 API**，否则只是模拟。
2. **OpenAI API 计费与 ChatGPT 订阅独立**，要设置 Usage Limits 或充值。
3. **组织验证限制可通过切换模型规避**（如用 `dall-e-2`）。
4. **代理必须对 Node 服务生效**，仅浏览器代理无效。
5. **DALL·E 图生图只接受 PNG**，前端自动转换是最稳妥方案。
6. **参数兼容性很重要**：DALL·E 不支持 `output_format`。

---

## 四、关键对话摘要（交流步骤）

- 用户：网页无法访问 → 我检查端口并重启服务。
- 用户：需要接入 OpenAI Key → 我新增 API Route 与前端调用。
- 用户：超时连接 OpenAI → 我识别为代理未生效，指导配置代理。
- 用户：`undici` 缺失 → 我添加依赖。
- 用户：组织验证问题 → 我切换到 DALL·E。
- 用户：参数错误 → 我修正为 `response_format`。
- 用户：JPEG 不支持 → 我添加 PNG 转换。
- 用户：网络故障 → 我测试代理并改全局代理。

---

## 五、建议保留的配置

`.env.local` 推荐：
```env
OPENAI_API_KEY=你的OpenAIKey
HTTPS_PROXY=http://127.0.0.1:10809
HTTP_PROXY=http://127.0.0.1:10809
OPENAI_TIMEOUT_MS=40000
```

---

## 六、后续可选优化

- 增加“余额/限额提示”UI
- 模型下拉改成真实模型名称
- 生成质量、尺寸、背景选项

---

> 以上为今日完整复盘文档，可直接复制用于团队同步与问题排查。
