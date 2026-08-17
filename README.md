# dsh-bull-bear

> Bull & bear market pet for DeepSeek Harness: the faster the market rises, the higher the bull raises its head; the faster it falls, the deeper the bear lowers its head.

A market-status pet docked at the bottom-left of the DeepSeek Harness Web UI. It maps the **rate of change** of free Sina real-time quotes onto an SVG **bull raising its head / bear lowering its head**. Purely for fun — not investment advice.

## Features

- **Free real-time quotes**: Sina `hq.sinajs.cn` public endpoint, no login, no API key, fetched directly from Node, batched for multiple symbols.
- **Portfolio-driven bull/bear**: the pet reflects your **whole basket's average** — an up portfolio shows the bull (🐂), a down one the bear (🐻).
- **Speed sets the pose**: the faster the portfolio rises, the higher the bull raises its head (angle proportional to rate); the faster it falls, the deeper the bear bows.
- **Watchlist panel**: click the pet to open a side panel listing every held symbol with its red/green change, search by name/code to add, and remove holdings.
- **Scales to many symbols**: up to 200 symbols, fetched in chunks of 500 to stay under Sina's single-URL limit; watchlist is persisted by the host to `.bull-bear-watchlist.json`.
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

- **Watchlist panel**: click the pet to open the side panel. It lists every held symbol with its change (red = up, green = down, matching A-share color conventions), shows the portfolio average at the bottom, lets you search stocks by name/code to add them, and remove any holding.
- **Persistence**: edits are written to `<workspace>/.bull-bear-watchlist.json` and reapplied on startup; up to 200 symbols.
- **Collapse/expand**: click the pet to toggle the panel; the pet can be collapsed separately.
- **Refresh rate**: 5 seconds by default (see config below).

### Config

| Key | Default | Description |
| --- | --- | --- |
| `symbols` | SSE/SC/ChiNext/Moutai/CATL | watchlist (Sina codes like `sh000001`/`sz399001`; a `6`-prefixed 6-digit code is auto-detected as SSE) |
| `refreshMs` | `5000` | quote refresh interval (ms) |
| `sensitivity` | `1` | rate→angle multiplier (`0.1`–`5`) |

Defaults live in the `config` object in `src/index.js`; they can be adjusted at runtime via the RPC interface.

## How it works

- **Host half** (`src/index.js`): every `refreshMs` it fetches Sina `hq.sinajs.cn` with native `fetch`, decoding GBK, computing each symbol's change vs previous close (`pct`) and rate vs the previous sample (`rate`), then the **portfolio average** (`avgPct`, `avgRate`). Because Sina rejects URLs with more than ~800 symbols (HTTP 431), the watchlist is fetched in **chunks of 500** merged together. Exposed via the official `ctx.connection.rpc.handle('/bullbear'...)` channel, plus a `search` action that resolves names/codes through Tencent's `smartbox` endpoint.
- **Client half** (`src/client/index.js`): polls the RPC and uses `rateToAngle(avgRate, sensitivity)` to clamp the portfolio rate into `[-70, 70]` degrees; the bull/bear head rotates around the neck and translates. The side panel lists `entries` and calls `search`/`addSymbol`/`removeSymbol`. Registered into the `shell.overlay` slot.

`mood` within a window: portfolio `avgPct > 0.05` shows the bull, `avgPct < -0.05` the bear, otherwise flat.

## Disclaimer

- Data comes from Sina Finance's public web interface, for study and research only, and is **not investment advice**; do not poll aggressively and respect the source site's terms.
- This plugin is not an official product of any broker or quote provider.

## License

[MIT](./LICENSE)
