# dsh-bull-bear

> 牛熊行情宠物 — DeepSeek Harness 实时行情状态宠物：涨得越快牛头抬得越高，跌得越快熊头低得越深。

一个挂在 DeepSeek Harness Web UI 左下角的行情宠物：免费的新浪实时行情，把**涨跌速率**映射成一只**牛抬头 / 熊低头**的 SVG 动物。纯恶搞、无投资建议，仅供自己看着开心。

## 功能

- **实时免费行情**：新浪 `hq.sinajs.cn` 公开接口，免登录、免 API key，Node 直连，一次批量拉取多标的。
- **组合驱动牛/熊**：宠物反映**整个自选篮的平均**涨跌——组合上涨显示牛（🐂），下跌显示熊（🐻）。
- **速度决定姿态**：组合涨得越快牛头抬得越高（抬头角度与速率成正比），跌得越快熊头低得越深。
- **自选面板**：点宠物打开侧边面板，逐只列出自选的红/绿涨跌，可按名称/代码搜索添加、删除。
- **可应对大量标的**：最多 200 只，按每片 500 只分片抓取，避开新浪单 URL 上限；自选由 host 持久化到 `.bull-bear-watchlist.json`。
- **悬浮可点击**：注册进官方 `shell.overlay` 槽位，点击宠物开关面板。

## 安装

```bash
# npm 包（预构建，推荐）
dsh plugin --profile web add dsh-bull-bear

# 或本地目录
dsh plugin --profile web add /path/to/dsh-bull-bear
```

添加后重启一次 `dsh web`，刷新页面即可看到左下角的牛/熊宠物。

## 使用

- **自选面板**：点击宠物打开侧边面板。逐只列出每只自选的最新涨跌（红=涨、绿=跌，符合 A 股配色），底部显示组合平均；可按名称/代码搜索添加，可删除任意自选。
- **持久化**：改动写入 `<workspace>/.bull-bear-watchlist.json`，启动时重新应用，最多 200 只。
- **点击开关面板 / 收起**：点击宠物切换面板；也可单独收起。
- **刷新频率**：默认 5 秒，见下方配置文件说明。

### 配置

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `symbols` | 上证/深成/创业板/茅台/宁德 | 自选标的（新浪代码，如 `sh000001`、`sz399001`；支持 `6` 开头自动识别为沪市） |
| `refreshMs` | `5000` | 行情刷新周期（毫秒） |
| `sensitivity` | `1` | 速率→抬头角度放大倍数（`0.1`–`5`） |

主代码默认值在 `src/index.js` 的 `config` 对象中；运行期可通过 RPC 动态调整。

## 原理

- **Host 半**（`src/index.js`）：每 `refreshMs` 用原生 `fetch` 请求新浪 `hq.sinajs.cn`，GBK 解码，计算每个标的相对昨收的涨跌幅（`pct`）与相对上次采样的速率（`rate`），再求**组合平均**（`avgPct`、`avgRate`）。新浪对超过约 800 只的一个 URL 会返回 HTTP 431，因此按**每片 500 只分片并发**抓取后合并。通过官方 `ctx.connection.rpc.handle('/bullbear'...)` 通道暴露，另有 `search` 操作经腾讯 `smartbox` 按名称/代码解析证券。
- **Client 半**（`src/client/index.js`）：轮询 RPC，用 `rateToAngle(avgRate, sensitivity)` 把组合速率夹到 `[-70, 70]` 度，牛头/熊头绕颈部旋转并位移；侧边面板列出 `entries` 并调用 `search` / `addSymbol` / `removeSymbol`。注册进 `shell.overlay` 槽位。

窗口内 `mood` 判定：组合 `avgPct > 0.05` 显示牛、`avgPct < -0.05` 显示熊、其余横盘。

## 免责声明

- 数据来自新浪财经公开 Web 接口，仅供学习与研究，**不构成任何投资建议**；请勿高频请求，遵守目标站点条款。
- 本插件非任何券商或行情服务商的官方产品。

## License

[MIT](./LICENSE)
