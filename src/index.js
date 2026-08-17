export default {
  apply(ctx) {
    const DEFAULT_WATCHLIST = ['sh000001', 'sz399001', 'sz399006', 'sh600519', 'sz300750']
    const DEFAULT_REFRESH_MS = 5000

    let watchlist = null
    let intervalId = null
    let lastQuotes = null
    let stats = null
    let config = {
      symbols: DEFAULT_WATCHLIST.slice(),
      refreshMs: DEFAULT_REFRESH_MS,
      sensitivity: 1.0,
    }

    function getWatchlistPath() {
      return '.bull-bear-watchlist.json'
    }

    async function loadWatchlist() {
      if (watchlist) return watchlist
      watchlist = { symbols: config.symbols.slice() }
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs && root) {
        try {
          const target = await fs.resolve(getWatchlistPath(), { cwd: root })
          const text = await fs.readText(target)
          const parsed = JSON.parse(text)
          if (parsed && Array.isArray(parsed.symbols) && parsed.symbols.length) {
            watchlist = { symbols: parsed.symbols.slice(0, 50) }
          }
        } catch (e) { /* 首次运行或未写权限时用默认列表 */ }
      }
      return watchlist
    }

    async function saveWatchlist() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs || !root) return
      try {
        const target = await fs.resolve(getWatchlistPath(), { cwd: root })
        await fs.writeText(target, JSON.stringify(watchlist))
      } catch (e) { /* 保持内存态 */ }
    }

    // ---- 新浪免费实时行情（无需登录 / cookie，Node fetch 直连，一次批量多只）----
    function sanitizeSymbol(s) {
      return String(s || '').replace(/[^A-Za-z0-9_.]/g, '')
    }

    function normalizeSymbol(s) {
      let sym = sanitizeSymbol(s).toLowerCase()
      if (/^\d{6}$/.test(sym)) {
        // 6 位数字无前缀时猜测：6 开头沪市，其余深市
        sym = sym[0] === '6' ? 'sh' + sym : 'sz' + sym
      }
      return sym
    }

    function decodeGbk(buf) {
      return new TextDecoder('gbk').decode(buf)
    }

    async function fetchQuotes(symbols) {
      const list = symbols.map(normalizeSymbol)
      const url = 'https://hq.sinajs.cn/list=' + list.join(',')
      const res = await fetch(url, {
        headers: {
          Referer: 'https://finance.sina.com.cn',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      })
      if (!res.ok) throw new Error('行情请求失败 HTTP ' + res.status)
      const buf = new Uint8Array(await res.arrayBuffer())
      const text = decodeGbk(buf)
      const quotes = []
      for (const m of text.matchAll(/hq_str_(\w+)="([^"]*)"/g)) {
        const symbol = m[1]
        const f = m[2].split(',')
        if (f.length < 32 || !f[0]) continue
        const last = parseFloat(f[3])
        const prev = parseFloat(f[2])
        quotes.push({
          symbol: symbol,
          name: f[0],
          last: last,
          prev: prev,
          open: parseFloat(f[1]),
          high: parseFloat(f[4]),
          low: parseFloat(f[5]),
          amount: parseFloat(f[9]),
          date: f[30],
          time: f[31],
        })
      }
      return quotes
    }

    // 计算涨跌幅度和速率（相对上一次采样的变化，用于驱动牛/熊抬头角度）
    function computeStats(quotes) {
      const prevMap = new Map()
      if (lastQuotes) lastQuotes.forEach(q => prevMap.set(q.symbol, q.last))

      const entries = quotes.map(q => {
        const prevLast = prevMap.get(q.symbol)
        const pct = q.prev ? ((q.last - q.prev) / q.prev) * 100 : 0
        // 速率：两个采样点之间价格变化的百分比/秒，正向=涨 负向=跌
        const rate = (prevLast !== undefined && q.last !== 0)
          ? ((q.last - prevLast) / Math.abs(prevLast)) * 100 : 0
        return {
          symbol: q.symbol,
          name: q.name,
          last: q.last,
          pct: pct,
          rate: rate,
          high: q.high,
          low: q.low,
          time: q.time,
        }
      })

      // 取"最具指示性"的一只：涨时取涨幅最大的，跌时取跌幅最大的
      let focus = entries[0]
      let maxAbsPct = -Infinity
      for (const e of entries) {
        const abs = Math.abs(e.pct)
        if (abs > maxAbsPct) { maxAbsPct = abs; focus = e }
      }
      const avg = entries.length
        ? entries.reduce((s, e) => s + e.pct, 0) / entries.length : 0

      return {
        entries: entries,
        focus: focus,
        avgPct: avg,
        avgRate: entries.length
          ? entries.reduce((s, e) => s + e.rate, 0) / entries.length : 0,
        updatedAt: Date.now(),
        marketTime: focus ? focus.time : null,
      }
    }

    async function refresh() {
      try {
        const wl = await loadWatchlist()
        if (!wl.symbols.length) return
        const quotes = await fetchQuotes(wl.symbols)
        if (!quotes.length) { stats = null; return }
        stats = computeStats(quotes)
        lastQuotes = quotes
      } catch (e) {
        // 网络抖动保留上一次统计，避免宠物乱跳
        ctx.logger.warn('bull-bear 行情刷新失败: ' + ((e && e.message) || e))
      }
    }

    function startPolling() {
      if (intervalId) return
      refresh()
      // Host 半运行在 DSH Node 进程，全局 timer 必然存在且语义明确。
      intervalId = setInterval(refresh, config.refreshMs)
    }

    function stopPolling() {
      if (intervalId) { clearInterval(intervalId); intervalId = null }
    }

    // ---- RPC：client 拉取当前统计 ----
    ctx.effect(async function () {
      startPolling()
      return stopPolling
    })

    const dispatch = {
      async get() {
        return {
          stats: sanitize(stats),
          watchlist: (await loadWatchlist()).symbols,
          config: { refreshMs: config.refreshMs, sensitivity: config.sensitivity },
        }
      },
      async setWatchlist(args) {
        const symbols = Array.isArray(args.symbols)
          ? args.symbols.map(normalizeSymbol).filter(Boolean) : []
        const wl = await loadWatchlist()
        wl.symbols = symbols.slice(0, 50)
        watchlist = wl
        await saveWatchlist()
        refresh()
        return { symbols: wl.symbols }
      },
      async addSymbol(args) {
        const sym = normalizeSymbol(args.symbol)
        if (!sym) throw new Error('无效代码: ' + args.symbol)
        const wl = await loadWatchlist()
        if (wl.symbols.indexOf(sym) === -1) { wl.symbols.push(sym); watchlist = wl; await saveWatchlist() }
        refresh()
        return { symbols: wl.symbols }
      },
      async removeSymbol(args) {
        const sym = normalizeSymbol(args.symbol)
        const wl = await loadWatchlist()
        const i = wl.symbols.indexOf(sym)
        if (i !== -1) { wl.symbols.splice(i, 1); watchlist = wl; await saveWatchlist() }
        refresh()
        return { symbols: wl.symbols }
      },
      async setSensitivity(args) {
        config.sensitivity = Math.min(Math.max(parseFloat(args.sensitivity) || 1, 0.1), 5)
        return { sensitivity: config.sensitivity }
      },
      async setRefresh(args) {
        config.refreshMs = Math.min(Math.max(parseInt(args.refreshMs, 10) || 5000, 1000), 60000)
        stopPolling()
        startPolling()
        return { refreshMs: config.refreshMs }
      },
    }

    // 官方 Host→Client RPC 通道：ctx.connection.rpc.handle 注册绝对通道，
    // client 用 ctx.connection.rpc.call('/bullbear', endpoint, payload) 调用。
    ctx.inject(['connection'], (connectionCtx) => {
      ctx.effect(() => {
        return connectionCtx.connection.rpc.handle(
          '/bullbear',
          async function (endpoint, payload) {
            const reqObj = (payload && typeof payload === 'object') ? payload : {}
            const action = reqObj.action
            const args = reqObj.args || {}
            if (!dispatch[action]) return { ok: false, error: { message: '未知操作: ' + action, code: 'UNKNOWN_ACTION' } }
            try {
              const data = await dispatch[action](args)
              return { ok: true, value: data }
            } catch (e) {
              return { ok: false, error: { message: String((e && e.message) || e), code: 'HANDLER_ERROR' } }
            }
          },
          { authority: 'loopback' },
        )
      })
    })
  },
}

function sanitize(v) {
  if (v === undefined || v === null) return null
  if (typeof v === 'number' && !Number.isFinite(v)) return null
  if (Array.isArray(v)) return v.map(sanitize)
  if (typeof v === 'object') {
    const out = {}
    for (const k in v) if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = sanitize(v[k])
    return out
  }
  return v
}
