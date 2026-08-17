window.__ModuleLoader__.load({ id: "dsh-bull-bear", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var React = (typeof globalThis !== "undefined" && globalThis.React) || (typeof window !== "undefined" && window.React) || (function () { try { return require("react") } catch (e) { return undefined } })() || ReactFallbackError();
function ReactFallbackError() { throw new Error("dsh-bull-bear(client): React is not available (neither global nor require('react'))") }
module.exports = {
  inject: ['connection'],
  apply(ctx) {
    // ---- 样式 ----
    const styles = { insert(css) { const el = document.createElement('style'); el.textContent = css; document.head.appendChild(el) } }
    styles.insert(`
@keyframes bullbear-run{0%{transform:translateY(0)}25%{transform:translateY(-3px)}50%{transform:translateY(-1px)}75%{transform:translateY(-4px)}100%{transform:translateY(0)}}
@keyframes bullbear-groundmove{0%{background-position-x:0}100%{background-position-x:-24px}}
.bullbear{position:fixed;left:16px;bottom:20px;z-index:1200;cursor:grab;user-select:none;pointer-events:auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,.25));animation:bullbear-run 0.9s ease-in-out infinite;}
.bullbear:active{cursor:grabbing;}
.bullbear-ground{position:absolute;left:8px;right:8px;bottom:2px;height:6px;border-radius:3px;background-image:linear-gradient(90deg,var(--dsw-alias-border-l2) 2px,transparent 2px,transparent 12px,var(--dsw-alias-border-l1) 12px,transparent 13px,transparent 22px);background-size:24px 6px;background-repeat:repeat-x;animation:bullbear-groundmove 0.5s linear infinite;opacity:.6;pointer-events:none;}
.bullbear-badge{position:fixed;left:16px;bottom:20px;z-index:1201;display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:12px;line-height:1.4;color:var(--dsw-alias-label-primary);pointer-events:auto;cursor:pointer;}
.bullbear-up{color:var(--dsw-alias-state-error-primary);}
.bullbear-down{color:var(--dsw-alias-state-success-primary);}
.bullbear-flat{color:var(--dsw-alias-label-secondary);}
.bullbear-name{font-size:11px;color:var(--dsw-alias-label-secondary);}
.bullbear-tip{font-size:10px;color:var(--dsw-alias-label-secondary);}
.bullbear-row-up{color:var(--dsw-alias-state-error-primary);}
.bullbear-row-down{color:var(--dsw-alias-state-success-primary);}
.bullbear-row-flat{color:var(--dsw-alias-label-primary);}
.bullbear-error{font-size:10px;color:var(--dsw-alias-state-warning-primary);}
.bullbear-panel{position:fixed;right:16px;top:16px;bottom:16px;width:320px;z-index:1300;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);overflow:hidden;pointer-events:auto;font-size:13px;color:var(--dsw-alias-label-primary);}
.bullbear-panel-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.bullbear-panel-title{font-weight:600;}
.bullbear-panel-close{background:none;border:none;cursor:pointer;font-size:14px;color:var(--dsw-alias-label-secondary);}
.bullbear-panel-search{padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.bullbear-panel-input{width:100%;box-sizing:border-box;padding:6px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px;}
.bullbear-panel-input:focus{outline:none;border-color:var(--dsw-alias-focus-ring-border);}
.bullbear-search-list{border-bottom:1px solid var(--dsw-alias-border-l1);max-height:220px;overflow:auto;}
.bullbear-search-item{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;cursor:pointer;}
.bullbear-search-item:hover{background:var(--dsw-alias-bg-layer-2);}
.bullbear-search-item-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.bullbear-search-item-add{font-size:11px;color:var(--dsw-alias-state-info-primary);margin-left:8px;flex-shrink:0;}
.bullbear-panel-list{flex:1;overflow:auto;padding:4px 0;}
.bullbear-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.bullbear-row-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;}
.bullbear-row-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.bullbear-row-pct{font-size:12px;font-weight:600;min-width:62px;text-align:right;}
.bullbear-row-del{background:none;border:none;cursor:pointer;color:var(--dsw-alias-label-tertiary);font-size:12px;}
.bullbear-row-del:hover{color:var(--dsw-alias-state-error-primary);}
.bullbear-panel-empty{padding:20px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:12px;}
.bullbear-avg{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l1);}
.bullbear-avg-label{font-size:11px;color:var(--dsw-alias-label-secondary);}
.bullbear-avg-val{font-size:13px;font-weight:700;}
`)

    function el(type, props, children) { return React.createElement(type, props, children) }

    async function call(action, args) {
      const res = await ctx.connection.rpc.call('/bullbear', 'x', { action: action, args: args || {} })
      if (!res || !res.ok) throw new Error((res && res.error && (res.error.message || res.error)) || '调用失败')
      return res.value
    }

    // ---- 涨跌速率 → 牛头抬升 / 熊头低垂 的纯函数映射 ----
    // stat 携带 avgPct（相对昨收涨跌%，驱动牛/熊切换）和 avgRate（采样间速率% / 周期，驱动头角度）
    function rateToAngle(rate, sensitivity) {
      // 速率（%/采样周期）→ 头转动角度，sensitivity 放大倍数，clamp 到 [-70, 70] 度
      const raw = rate * (sensitivity || 1)
      const clamped = Math.max(-70, Math.min(70, raw * 24))
      return clamped
    }

    // ---- 四条腿的对角跑步步态 ----
    // phase: 0..1 循环;对角腿(0&3, 1&2)反相摆动,幅度 ~= speed*maxSwing
    function legGeom(phase, i, maxSwing) {
      // 对角同步: i 0 与 3 同相, 1 与 2 反相
      const off = (i === 1 || i === 2) ? Math.PI : 0
      const a = maxSwing * Math.sin(phase * Math.PI * 2 + off)
      return a
    }

    // ---- 牛（SVG）----
    function BullFox({ angle, phase }) {
      // angle>0 抬头（看涨），angle<0 低头。头围绕颈部旋转 + 微位移增强表现
      const rot = angle * 0.6      // 旋转主导
      const headY = -angle * 0.9   // 平移辅助
      const swing = 26
      // 每条腿的支点 x 坐标
      const legs = [40, 64, 88, 106]
      function Leg({ x, i, hipY, footLen, color }) {
        const a = legGeom(phase, i, swing)
        return el('g', { transform: `rotate(${a} ${x} ${hipY})` }, [
          el('path', { d: `M${x} ${hipY} L${x} ${hipY + footLen}`, stroke: color, strokeWidth: 6, strokeLinecap: 'round' }),
        ])
      }
      return el('svg', { width: 150, height: 130, viewBox: '0 0 150 130' }, [
        // 身体(背后腿在身体下方, 绘制顺序: 后腿→身体→前腿? 简化为全部腿在身体前)
        el('path', { key: 'body', d: 'M20 95 C20 60 55 42 90 46 C120 49 140 66 138 92 C137 108 120 118 96 118 C60 118 20 110 20 95 Z', fill: '#d9a066' }),
        el('g', { key: 'legs' }, [0, 1, 2, 3].map((i) => el(Leg, { key: 'l' + i, x: legs[i], i: i, hipY: 108, footLen: 16, color: '#7c4a21' }))),
        // 尾巴（上扬=看涨）
        el('path', { key: 'tail', d: 'M20 90 C6 84 4 70 14 64 C20 60 24 66 20 72 C14 79 12 88 20 90 Z', fill: '#c9853f' }),
        // 头（整体随 angle 旋转+位移）
        el('g', { key: 'head', transform: `translate(0 ${-headY}) rotate(${rot} 118 40)`, style: { transformOrigin: '118px 40px' } }, [
          el('path', { key: 'headshape', d: 'M108 46 C108 28 118 18 132 18 C143 18 148 26 146 38 C144 50 138 56 124 54 C112 53 108 52 108 46 Z', fill: '#b87333' }),
          // 角
          el('path', { key: 'horn1', d: 'M112 22 C106 14 98 12 92 16', stroke: '#fff5e0', strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }),
          el('path', { key: 'horn2', d: 'M126 18 C126 8 132 4 140 6', stroke: '#fff5e0', strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }),
          // 耳朵
          el('path', { key: 'ear', d: 'M118 22 L116 12 L124 16 Z', fill: '#c9853f' }),
          // 眼睛
          el('circle', { key: 'eye', cx: 122, cy: 34, r: 2.6, fill: '#1f1f1f' }),
          // 鼻孔
          el('circle', { key: 'noz', cx: 140, cy: 40, r: 1.6, fill: '#1f1f1f' }),
        ]),
      ])
    }

    // ---- 熊（SVG）----
    function Bear({ angle, phase }) {
      // angle 越负（下跌）熊头越低。旋转 + 下移增强低头
      const rot = angle * 0.6
      const headY = angle * 0.9 // 负angle=>正值=>translate下移
      const swing = 22
      const legs = [40, 64, 88, 106]
      function Leg({ x, i, hipY, footLen, color }) {
        const a = legGeom(phase, i, swing)
        return el('g', { transform: `rotate(${a} ${x} ${hipY})` }, [
          el('path', { d: `M${x} ${hipY} L${x} ${hipY + footLen}`, stroke: color, strokeWidth: 6, strokeLinecap: 'round' }),
        ])
      }
      return el('svg', { width: 150, height: 130, viewBox: '0 0 150 130' }, [
        el('path', { key: 'body', d: 'M22 98 C22 62 58 44 92 48 C122 51 140 70 136 96 C133 112 114 122 90 122 C56 122 22 112 22 98 Z', fill: '#6b4f3a' }),
        el('g', { key: 'legs' }, [0, 1, 2, 3].map((i) => el(Leg, { key: 'l' + i, x: legs[i], i: i, hipY: 108, footLen: 16, color: '#3a2a1c' }))),
        el('path', { key: 'tail', d: 'M22 92 C8 88 4 98 10 102 C14 105 20 100 22 92 Z', fill: '#5a412f' }),
        el('g', { key: 'head', transform: `translate(0 ${-headY}) rotate(${rot} 118 42)`, style: { transformOrigin: '118px 42px' } }, [
          el('path', { key: 'headshape', d: 'M106 46 C104 30 112 20 126 20 C138 20 144 27 142 40 C140 51 132 56 120 55 C110 54 107 54 106 46 Z', fill: '#7d5c42' }),
          el('circle', { key: 'ear1', cx: 116, cy: 20, r: 7, fill: '#5a412f' }),
          el('circle', { key: 'ear2', cx: 133, cy: 20, r: 7, fill: '#5a412f' }),
          el('circle', { key: 'eye', cx: 122, cy: 34, r: 2.6, fill: '#0c0c0c' }),
          el('ellipse', { key: 'nose', cx: 138, cy: 40, rx: 4, ry: 3, fill: '#2a1c12' }),
        ]),
      ])
    }

    // ---- 浮动面板:自选股列表 + 搜索添加/删除 ----
    function WatchlistPanel({ onClose, onChanged }) {
      const [view, setView] = React.useState(null)
      const [query, setQuery] = React.useState('')
      const [results, setResults] = React.useState([])
      const [panelError, setPanelError] = React.useState('')
      const [busy, setBusy] = React.useState(false)

      const fetchView = React.useCallback(async function () {
        try {
          const res = await call('get', {})
          setView(res)
        } catch (e) {
          setPanelError(String((e && e.message) || e))
        }
      }, [])

      React.useEffect(function () {
        fetchView()
      }, [fetchView])

      // 输入防抖搜索
      React.useEffect(function () {
        if (!query.trim()) { setResults([]); return }
        setBusy(true)
        const id = setTimeout(async function () {
          try {
            const res = await call('search', { key: query.trim() })
            setResults((res && res.results) || [])
          } catch (e) {
            setResults([])
          } finally {
            setBusy(false)
          }
        }, 300)
        return function () { clearTimeout(id) }
      }, [query])

      async function add(symbol) {
        try { await call('addSymbol', { symbol: symbol }); setQuery(''); setResults([]); fetchView(); onChanged && onChanged() }
        catch (e) { setPanelError(String((e && e.message) || e)) }
      }
      async function remove(symbol) {
        try { await call('removeSymbol', { symbol: symbol }); fetchView(); onChanged && onChanged() }
        catch (e) { setPanelError(String((e && e.message) || e)) }
      }

      const empty = !(view && view.stats && view.stats.entries && view.stats.entries.length)
      return el('div', { className: 'bullbear-panel' }, [
        el('div', { key: 'head', className: 'bullbear-panel-head' }, [
          el('span', { key: 't', className: 'bullbear-panel-title' }, '自选股'),
          el('button', { key: 'c', className: 'bullbear-panel-close', onClick: function () { onClose() } }, '✕'),
        ]),
        el('div', { key: 'search', className: 'bullbear-panel-search' }, [
          el('input', {
            key: 'i', className: 'bullbear-panel-input', placeholder: '搜索股票(名称/代码)', value: query,
            onChange: function (e) { setQuery(e.target.value) },
          }),
          busy ? el('div', { key: 'b', className: 'bullbear-tip' }, '搜索中…') : null,
        ]),
        results.length
          ? el('div', { key: 'sr', className: 'bullbear-search-list' }, results.map(function (r, i) {
            return el('div', { key: 's' + i, className: 'bullbear-search-item', onClick: function () { add(r.symbol) } }, [
              el('span', { key: 'n', className: 'bullbear-search-item-name' }, r.name + ' ' + r.symbol),
              el('span', { key: 'a', className: 'bullbear-search-item-add' }, '+ 添加'),
            ])
          }))
          : null,
        panelError ? el('div', { key: 'er', className: 'bullbear-error' }, panelError) : null,
        empty
          ? el('div', { key: 'em', className: 'bullbear-panel-empty' }, '暂无自选,上方搜索添加')
          : el('div', { key: 'list', className: 'bullbear-panel-list' }, view.stats.entries.map(function (e, i) {
            const cls = e.pct > 0.05 ? 'bullbear-row-up' : (e.pct < -0.05 ? 'bullbear-row-down' : 'bullbear-row-flat')
            const text = (e.pct > 0 ? '+' : '') + Number(e.pct).toFixed(2) + '%'
            return el('div', { key: 'r' + i, className: 'bullbear-row' }, [
              el('span', { key: 'n', className: 'bullbear-row-name' }, e.name),
              el('div', { key: 'rt', className: 'bullbear-row-right' }, [
                el('span', { key: 'p', className: 'bullbear-row-pct ' + cls }, text),
                el('button', { key: 'd', className: 'bullbear-row-del', title: '删除', onClick: function () { remove(e.symbol) } }, '✕'),
              ]),
            ])
          })),
        view && view.stats ? el('div', { key: 'avg', className: 'bullbear-avg' }, [
          el('span', { key: 'l', className: 'bullbear-avg-label' }, '组合平均'),
          el('span', { key: 'v', className: 'bullbear-avg-val ' + (view.stats.avgPct > 0.05 ? 'bullbear-row-up' : (view.stats.avgPct < -0.05 ? 'bullbear-row-down' : 'bullbear-row-flat')) },
            (view.stats.avgPct > 0 ? '+' : '') + Number(view.stats.avgPct).toFixed(2) + '%'),
        ]) : null,
      ])
    }

    // ---- 主组件：shell.overlay 宠物 ----
    function BullBearPet() {
      const [stat, setStat] = React.useState(null)
      const [sensitivity, setSensitivity] = React.useState(1)
      const [visible, setVisible] = React.useState(true)
      const [panel, setPanel] = React.useState(false)
      const [pos, setPos] = React.useState(null)
      const [error, setError] = React.useState('')
      const [runT, setRunT] = React.useState(0)

      // 跑步动画循环:每帧推进相位,驱动四条腿摆动
      const SPEED = 8 // 相位速度(周期/秒的倍数)
      React.useEffect(function () {
        let raf
        let last = performance.now()
        function tick(now) {
          const dt = (now - last) / 1000
          last = now
          setRunT(function (t) { return (t + dt * SPEED) % 1 })
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return function () { cancelAnimationFrame(raf) }
      }, [])

      const refresh = React.useCallback(async function () {
        try {
          const res = await call('get', {})
          setStat(res.stats)
          setSensitivity((res.config && res.config.sensitivity) || 1)
        } catch (e) {
          setError(String((e && e.message) || e))
        }
      }, [])

      React.useEffect(function () {
        refresh()
        const id = setInterval(refresh, 5000)
        return function () { clearInterval(id) }
      }, [refresh])

      if (!visible) return el('button', { className: 'bullbear-badge', onClick: function () { setVisible(true) } }, '🐂')

      // 归一化：组合平均涨跌驱动牛/熊与头角度
      let angle = 0, mood = 'flat'
      if (stat && stat.entries && stat.entries.length) {
        const r = stat.avgRate || 0
        angle = rateToAngle(r, sensitivity)
        const avg = stat.avgPct
        mood = avg > 0.05 ? 'up' : (avg < -0.05 ? 'down' : 'flat')
      }

      const pctText = stat && stat.avgPct !== undefined ? (stat.avgPct > 0 ? '+' : '') + Number(stat.avgPct).toFixed(2) + '%' : '--'

      return el('div', {}, [
        el('div', {
          key: 'pet', className: 'bullbear',
          style: pos ? { left: pos.x, top: pos.y } : null,
          onClick: function () { setPanel(!panel) },
          title: '点击打开自选面板',
        }, [
          mood === 'down'
            ? el(Bear, { key: 'bear', angle: angle, phase: runT })
            : el(BullFox, { key: 'bull', angle: angle, phase: runT }),
          el('div', { key: 'badge', className: 'bullbear-badge' + (mood === 'up' ? ' bullbear-up' : (mood === 'down' ? ' bullbear-down' : ' bullbear-flat')) }, [
            el('span', { key: 'pv', className: 'bullbear-val' }, pctText),
            el('span', { key: 'tip', className: 'bullbear-tip' }, mood === 'up' ? '组合·牛抬头' : (mood === 'down' ? '组合·熊低头' : '组合·横盘')),
          ]),
          error ? el('div', { key: 'err', className: 'bullbear-error', style: { position: 'absolute' } }, error) : null,
          el('div', { key: 'ground', className: 'bullbear-ground' }),
        ]),
        panel ? el(WatchlistPanel, {
          key: 'panel',
          onClose: function () { setPanel(false) },
          onChanged: refresh,
        }) : null,
      ])
    }

    // ---- 注册到 shell.overlay ----
    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('shell.overlay', function () {
      return slots.register(
        { name: 'shell.overlay', id: 'bull-bear' },
        function () { return el(BullBearPet, null) },
      )
    })
  },
}
return module.exports; } });