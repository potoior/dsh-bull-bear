# dsh-bull-bear

> 牛熊行情宠物 — DeepSeek Harness 实时行情状态宠物：涨得越快牛头抬得越高，跌得越快熊头低得越深。

一个挂在 DeepSeek Harness Web UI 左下角的行情宠物：免费的新浪实时行情，把**涨跌速率**映射成一只**牛抬头 / 熊低头**的 SVG 动物。纯恶搞、无投资建议，仅供自己看着开心。

## 功能

- **实时免费行情**：新浪 `hq.sinajs.cn` 公开接口，免登录、免 API key，Node 直连，一次批量拉取多标的。
- **牛/熊随行情切换**：自选篮整体上涨显示牛（🐂），下跌显示熊（🐻）。
- **速度决定姿态**：涨得越快牛头抬得越高（抬头角度与速率成正比），跌得越快熊头低得越深。
- **标的多选**：默认上证/深成/创业板/茅台/宁德，可增删自选（host 持久化到 `.bull-bear-watchlist.json`）。
- **悬浮可拖**：注册进官方 `shell.overlay` 槽位，点击收起为徽章。

## 安装

```bash
# npm 包（预构建，推荐）
dsh plugin --profile web add dsh-bull-bear

# 或本地目录
dsh plugin --profile web add /path/to/dsh-bull-bear
```

添加后重启一次 `dsh web`，刷新页面即可看到左下角的牛/熊宠物。

## 使用

- **自选管理**：编辑 `<workspace>/.bull-bear-watchlist.json` 的 `symbols` 数组（如 `["sh000001","sz399001","sz300750"]`），host 会读取并每小时/每次启动应用。
- **点击收起/展开**：点击宠物收起为 `🐂` 徽章，再点展开。
- **刷新频率**：默认 5 秒，见下方配置文件说明。

### 配置

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `symbols` | 上证/深成/创业板/茅台/宁德 | 自选标的（新浪代码，如 `sh000001`、`sz399001`；支持 `6` 开头自动识别为沪市） |
| `refreshMs` | `5000` | 行情刷新周期（毫秒） |
| `sensitivity` | `1` | 速率→抬头角度放大倍数（`0.1`–`5`） |

主代码默认值在 `src/index.js` 的 `config` 对象中；运行期可通过 RPC 动态调整。

## 原理

- **Host 半**（`src/index.js`）：每 `refreshMs` 用原生 `fetch` 请求新浪 `hq.sinajs.cn`，GBK 解码，计算每个标的相对昨收的涨跌幅（`pct`）与相对上次采样的速率（`rate`），汇总出代表行情（涨跌幅绝对值最大者）与平均速率。通过官方 `ctx.connection.rpc.handle('/bullbear'...)` 通道暴露。
- **Client 半**（`src/client/index.js`）：轮询 RPC，用 `rateToAngle(rate, sensitivity)` 把速率夹到 `[-70, 70]` 度，牛头/熊头绕颈部旋转并位移。注册进 `shell.overlay` 槽位。

窗口内 `mood` 判定：`pct > 0.05` 显示牛、`pct < -0.05` 显示熊、其余横盘。

## 免责声明

- 数据来自新浪财经公开 Web 接口，仅供学习与研究，**不构成任何投资建议**；请勿高频请求，遵守目标站点条款。
- 本插件非任何券商或行情服务商的官方产品。

## License

[MIT](./LICENSE)
