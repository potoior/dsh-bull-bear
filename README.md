# dsh-bull-bear

> Bull & bear market pet for DeepSeek Harness: the faster the market rises, the higher the bull raises its head; the faster it falls, the deeper the bear lowers its head.

A market-status pet docked at the bottom-left of the DeepSeek Harness Web UI. It maps the **rate of change** of free Sina real-time quotes onto an SVG **bull raising its head / bear lowering its head**. Purely for fun — not investment advice.

## Features

- **Free real-time quotes**: Sina `hq.sinajs.cn` public endpoint, no login, no API key, fetched directly from Node, batched for multiple symbols.
- **Bull/bear by direction**: an upside basket shows the bull (🐂), a downside shows the bear (🐻).
- **Speed sets the pose**: the faster it rises, the higher the bull raises its head (angle proportional to rate); the faster it falls, the deeper the bear bows.
- **Multiple symbols**: defaults to SSE Composite, SZ Component, ChiNext, Moutai, CATL; watchlist is persisted by the host to `.bull-bear-watchlist.json`.
- **Floating & collapsible**: registered into the official `shell.overlay` slot; click to collapse into a badge.

## Install

```bash
# npm package (prebuilt, recommended)
dsh plugin --profile web add dsh-bull-bear

# or a local directory
dsh plugin --profile web add /path/to/dsh-bull-bear
```

Restart `dsh web` once after adding, then refresh the page to see the bull/bear pet.

## Usage

- **Watchlist**: edit the `symbols` array in `<workspace>/.bull-bear-watchlist.json` (e.g. `["sh000001","sz399001","sz300750"]`); the host reads it on startup and applies it.
- **Collapse/expand**: click the pet to collapse into a `🐂` badge; click again to expand.
- **Refresh rate**: 5 seconds by default (see config below).

### Config

| Key | Default | Description |
| --- | --- | --- |
| `symbols` | SSE/SC/ChiNext/Moutai/CATL | watchlist (Sina codes like `sh000001`/`sz399001`; a `6`-prefixed 6-digit code is auto-detected as SSE) |
| `refreshMs` | `5000` | quote refresh interval (ms) |
| `sensitivity` | `1` | rate→angle multiplier (`0.1`–`5`) |

Defaults live in the `config` object in `src/index.js`; they can be adjusted at runtime via the RPC interface.

## How it works

- **Host half** (`src/index.js`): every `refreshMs` it fetches Sina `hq.sinajs.cn` with native `fetch`, decodes GBK, computes each symbol's change vs previous close (`pct`) and the rate vs the previous sample (`rate`), then summarizes a representative quote (largest absolute `pct`) plus the average rate. Exposed via the official `ctx.connection.rpc.handle('/bullbear'...)` channel.
- **Client half** (`src/client/index.js`): polls the RPC and uses `rateToAngle(rate, sensitivity)` to clamp the rate into `[-70, 70]` degrees; the bull/bear head rotates around the neck and translates. Registered into the `shell.overlay` slot.

`mood` within a window: `pct > 0.05` shows the bull, `pct < -0.05` shows the bear, otherwise flat.

## Disclaimer

- Data comes from Sina Finance's public web interface, for study and research only, and is **not investment advice**; do not poll aggressively and respect the source site's terms.
- This plugin is not an official product of any broker or quote provider.

## License

[MIT](./LICENSE)
