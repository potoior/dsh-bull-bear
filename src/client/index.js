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
@keyframes bullbear-groundmove{0%{background-position-x:0}100%{background-position-x:-24px}}
.bullbear{position:fixed;left:16px;bottom:20px;z-index:1200;cursor:grab;user-select:none;pointer-events:auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,.25));}
.bullbear:active{cursor:grabbing;}
.bullbear-ground{position:absolute;left:8px;right:8px;bottom:2px;height:6px;border-radius:3px;background-image:linear-gradient(90deg,var(--dsw-alias-border-l2) 2px,transparent 2px,transparent 12px,var(--dsw-alias-border-l1) 12px,transparent 13px,transparent 22px);background-size:24px 6px;background-repeat:repeat-x;animation:bullbear-groundmove 0.3s linear infinite;opacity:.6;pointer-events:none;}
.bullbear-dust{position:absolute;bottom:0;width:40px;height:26px;opacity:0;pointer-events:none;animation:bullbear-dustpuff 0.7s ease-out infinite;background:radial-gradient(ellipse at bottom,rgba(160,140,110,.5),transparent 70%);}
@keyframes bullbear-dustpuff{0%{transform:translateX(0) scale(.3);opacity:0}30%{opacity:.7}100%{transform:translateX(-34px) translateY(-10px) scale(1.3);opacity:0}}
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
.bullbear-race{flex:0 0 auto;max-height:40%;overflow:hidden;border-bottom:1px solid var(--dsw-alias-border-l1);padding:6px 0;}
.bullbear-race-title{display:flex;align-items:center;justify-content:space-between;padding:2px 12px 6px;font-size:11px;color:var(--dsw-alias-label-secondary);}
.bullbear-race-line{display:flex;align-items:center;gap:8px;padding:3px 12px;position:relative;}
.bullbear-race-rank{flex-shrink:0;width:18px;text-align:right;font-size:11px;font-weight:700;color:var(--dsw-alias-label-secondary);}
.bullbear-race-ico{flex-shrink:0;font-size:14px;}
.bullbear-race-name{flex-shrink:0;width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--dsw-alias-label-primary);}
.bullbear-race-track{flex:1;height:8px;border-radius:4px;overflow:hidden;background:var(--dsw-alias-bg-layer-2);}
.bullbear-race-pos{height:100%;border-radius:4px;min-width:4px;transition:none;}
.bullbear-race-pos-up{background:var(--dsw-alias-state-error-primary);}
.bullbear-race-pos-down{background:var(--dsw-alias-state-success-primary);}
.bullbear-race-pos-flat{background:var(--dsw-alias-label-tertiary);}
.bullbear-race-optime{font-size:10px;color:var(--dsw-alias-state-info-primary);}
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
    function BullFox({ angle, phase, swing }) {
      // angle>0 抬头（看涨），angle<0 低头。头围绕颈部旋转 + 微位移增强表现
      const rot = angle * 0.6      // 旋转主导
      const headY = -angle * 0.9   // 平移辅助
      // 每条腿的支点 x 坐标
      const legs = [40, 64, 88, 106]
      function Leg({ x, i, hipY, footLen, color }) {
        const a = legGeom(phase, i, swing)
        return el('g', { transform: `rotate(${a} ${x} ${hipY})` }, [
          el('path', { d: `M${x} ${hipY} L${x} ${hipY + footLen}`, stroke: color, strokeWidth: 6, strokeLinecap: 'round' }),
        ])
      }
      return el('svg', { width: 150, height: 130, viewBox: '0 0 170 130' }, [
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
    function Bear({ angle, phase, swing }) {
      // angle 越负（下跌）熊头越低。旋转 + 下移增强低头
      const rot = angle * 0.6
      const headY = angle * 0.9 // 负angle=>正值=>translate下移
      const legs = [40, 64, 88, 106]
      function Leg({ x, i, hipY, footLen, color }) {
        const a = legGeom(phase, i, swing)
        return el('g', { transform: `rotate(${a} ${x} ${hipY})` }, [
          el('path', { d: `M${x} ${hipY} L${x} ${hipY + footLen}`, stroke: color, strokeWidth: 6, strokeLinecap: 'round' }),
        ])
      }
      return el('svg', { width: 150, height: 130, viewBox: '0 0 170 130' }, [
        // 圆胖横长的身体(背高前略低)
        el('path', { key: 'body', d: 'M22 98 C22 60 56 40 94 46 C122 49 140 64 138 92 C136 112 116 122 92 122 C54 122 22 110 22 98 Z', fill: '#6b4f3a' }),
        el('g', { key: 'legs' }, [0, 1, 2, 3].map((i) => el(Leg, { key: 'l' + i, x: legs[i], i: i, hipY: 108, footLen: 16, color: '#3a2a1c' }))),
        // 短圆尾巴(左侧)
        el('circle', { key: 'tail', cx: 14, cy: 92, r: 7, fill: '#5a412f' }),
        el('g', { key: 'head', transform: `translate(0 ${-headY}) rotate(${rot} 138 32)`, style: { transformOrigin: '138px 32px' } }, [
          // 脖子:细一些,从身体前肩托起源头
          el('path', { key: 'neck', d: 'M136 52 C136 46 138 40 140 36', stroke: '#5a412f', strokeWidth: 12, strokeLinecap: 'round', fill: 'none' }),
          // 圆胖头:整体前出超过身体右缘(x138),主体在身体轮廓外
          el('ellipse', { key: 'headshape', cx: 140, cy: 30, rx: 20, ry: 17, fill: '#7d5c42' }),
          // 大圆耳:后耳在头顶靠前侧,前耳更靠前(侧视前上)
          el('circle', { key: 'earBack', cx: 128, cy: 16, r: 8, fill: '#4a3326' }),
          el('circle', { key: 'earFront', cx: 146, cy: 15, r: 8, fill: '#5a412f' }),
          // 短圆吻部:朝右前方突出,浅色
          el('ellipse', { key: 'snout', cx: 158, cy: 34, rx: 7, ry: 9, fill: '#c19a72' }),
          // 圆鼻头:吻端,圆润
          el('ellipse', { key: 'nose', cx: 163, cy: 31, rx: 3.4, ry: 3, fill: '#2a1c12' }),
          // 圆眼睛:侧视应靠前(靠近吻部一侧),不在正中心
          el('circle', { key: 'eye', cx: 147, cy: 23, r: 3, fill: '#0c0c0c' }),
          // 嘴角
          el('path', { key: 'mouth', d: 'M153 39 C156 41 160 41 162 39', stroke: '#3a2a1c', strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' }),
        ]),
      ])
    }

    // ---- 赛道赛跑:进度条宽度以涨幅最大者为满幅(100%),其他按比例缩放 ----
    function Racetrack({ entries, view }) {
      if (!entries || !entries.length) return el('div', { className: 'bullbear-race' }, [
        el('div', { key: 't', className: 'bullbear-race-title' }, '🏁 行情赛跑'),
      ])

      // 按涨跌幅排序(涨幅最大在最上),取前 6 展示
      const sorted = entries.slice().sort(function (a, b) {
        return (b.pct || 0) - (a.pct || 0)
      }).slice(0, 6)

      // 满幅基准 = 涨幅绝对值最大的那只,它占满 100%,其余按比例
      const maxAbs = Math.max(0.0001, sorted.reduce(function (m, e) { return Math.max(m, Math.abs(e.pct || 0)) }, 0))
      const tickNow = (view && view.stats && view.stats.marketTime) || ''

      return el('div', { className: 'bullbear-race' }, [
        el('div', { key: 't', className: 'bullbear-race-title' }, [
          el('span', { key: 'l' }, '🏁 赛跑 · 涨最快在前'),
          el('span', { key: 'time', className: 'bullbear-race-optime' }, (tickNow || '').toString()),
        ]),
        ...sorted.map(function (e, i) {
          // 比例 = 该股涨跌幅 / 最大涨跌幅;最大者为满格 100%
          const w = Math.max(0.04, Math.min(1, Math.abs(e.pct || 0) / maxAbs))
          const up = e.pct > 0.05
          const cls = up ? 'bullbear-race-pos-up' : (e.pct < -0.05 ? 'bullbear-race-pos-down' : 'bullbear-race-pos-flat')
          const ico = up ? '🐂' : (e.pct < -0.05 ? '🐻' : '🐂')
          const pctText = (e.pct > 0 ? '+' : '') + Number(e.pct).toFixed(2) + '%'
          return el('div', { key: 'r' + e.symbol, className: 'bullbear-race-line' }, [
            el('span', { key: 'rank', className: 'bullbear-race-rank' }, String(i + 1)),
            el('span', { key: 'ico', className: 'bullbear-race-ico' }, ico),
            el('span', { key: 'name', className: 'bullbear-race-name' }, e.name),
            el('div', { key: 'tr', className: 'bullbear-race-track' }, [
              el('div', { key: 'pos', className: 'bullbear-race-pos ' + cls, style: { width: (w * 100).toFixed(1) + '%' } }),
            ]),
            el('span', { key: 'pct', className: 'bullbear-row-pct ' + cls }, pctText),
          ])
        }),
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
      const entries = (view && view.stats && view.stats.entries) || []
      return el('div', { className: 'bullbear-panel' }, [
        el('div', { key: 'head', className: 'bullbear-panel-head' }, [
          el('span', { key: 't', className: 'bullbear-panel-title' }, '自选股'),
          el('button', { key: 'c', className: 'bullbear-panel-close', onClick: function () { onClose() } }, '✕'),
        ]),
        el(Racetrack, { key: 'race', entries: entries, view: view }),
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
      const [vigor, setVigor] = React.useState(0)
      const [stunt, setStunt] = React.useState(0) // 0..1 特技进度, 0=无特技

      // ---- 拖动状态(refs,避免每帧 setState) ----
      const dragRef = React.useRef(null)

      function onPetPointerDown(e) {
        if (!(e && e.button !== undefined ? e.button === 0 : true)) return
        const x = e.clientX, y = e.clientY
        dragRef.current = { startX: x, startY: y, moved: false, origin: { left: pos ? pos.x : 16, top: pos ? pos.y : topDefault() } }
        if (e.target && e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId)
      }
      function topDefault() {
        // 默认 bottom:20px 换算成 top(在首帧 pos 为 null 时的初始落点)
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800
        return vh - 150
      }
      function onPetPointerMove(e) {
        const d = dragRef.current
        if (!d) return
        const dx = e.clientX - d.startX, dy = e.clientY - d.startY
        if (!d.moved && Math.hypot(dx, dy) > 5) d.moved = true
        if (d.moved) {
          setPos({ x: d.origin.left + dx, y: d.origin.top + dy })
        }
      }
      function onPetPointerUp(e) {
        const d = dragRef.current
        dragRef.current = null
        if (d && d.moved) return // 拖动结束,不触发展开面板
        e && e.preventDefault && e.preventDefault()
      }

      // 市场强度基准:组合涨跌 ±20% 视为满强度(100%)。
      // vigor = |avgPct|/20 线性映射到 [0,1],20% 收益时达到 1(全速戏剧化跑)。
      // 速率只作小幅加成,让急涨急跌比缓步爬升更兴奋。
      const MAX_GAIN_PCT = 20
      let vigorNow = 0
      if (stat && stat.entries && stat.entries.length) {
        const p = Math.abs(stat.avgPct || 0)
        const r = Math.abs(stat.avgRate || 0)
        const pctVigor = p / MAX_GAIN_PCT
        const rateBonus = Math.min(0.4, r / 2)
        vigorNow = Math.min(1, pctVigor + rateBonus)
      }

      // 奔跑 + 特技动画循环(JS 驱动,随行情变速变幅)
      // refs 让 rAF 循环读到最新 vigor,不重建 effect
      const vigorRef = React.useRef(0)
      vigorRef.current = vigorNow
      const statRef = React.useRef(stat)
      statRef.current = stat

      React.useEffect(function () {
        let raf
        let last = performance.now()
        let stuntUntil = 0
        let nextStunt = performance.now() + 3500 + Math.random() * 3500
        function tick(now) {
          const dt = (now - last) / 1000
          last = now
          const v = vigorRef.current || 0.1
          // 奔跑速度: 横盘慢(2周期/秒),行情猛时飞快(高达 9)
          const speed = 2 + v * 7
          setRunT(function (t) { return (t + dt * speed) % 1 })
          // 特技:周期性随机触发(横盘也偶尔),持续 ~0.9s
          let sv = 0
          if (now < stuntUntil) {
            sv = (now - (stuntUntil - 900)) / 900
          } else if (now >= nextStunt) {
            stuntUntil = now + 900
            nextStunt = now + 4000 + Math.random() * 6000
            sv = 0.0001
          }
          setStunt(sv)
          setVigor(v)
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

      // 特技:跃起 + 甩头 + 尘土爆发
      const stuntUp = stunt > 0 ? Math.sin(Math.min(stunt, 1) * Math.PI) * 40 * (0.6 + vigor * 0.8) : 0
      const headWhip = stunt > 0 ? Math.sin(stunt * Math.PI * 2) * 45 : 0
      const stuntGrow = stunt > 0 ? 1 + 0.18 * Math.sin(stunt * Math.PI) : 1
      // 跑步颠簸:随相位上下的跳跃感,行情越猛颠得越厉害
      const bob = Math.abs(Math.sin(runT * Math.PI * 2)) * (4 + vigor * 12)

      // 尘土浓度与位置:左(牛)/右(熊)脚后方扬起
      const dustOn = vigor > 0.45 || stunt > 0
      const dustStyle = stunt > 0
        ? { opacity: Math.sin(stunt * Math.PI), animationDuration: '0.45s' }
        : { opacity: Math.min(0.8, vigor), animationDuration: String(1.3 - vigor * 0.9) + 's' }

      return el('div', {}, [
        el('div', {
          key: 'pet', className: 'bullbear',
          style: Object.assign(
            { transform: `translateY(${stuntUp - bob}px) scale(${stuntGrow})` },
            pos ? { left: pos.x, top: pos.y } : null,
          ),
          onPointerDown: onPetPointerDown,
          onPointerMove: onPetPointerMove,
          onPointerUp: function (e) {
            const wasMoved = !!(dragRef.current && dragRef.current.moved)
            onPetPointerUp(e)
            if (!wasMoved) setPanel(!panel) // 未拖动=点击,展开/收起面板
          },
          title: '拖动移动 · 点击展开自选面板',
        }, [
          mood === 'down'
            ? el(Bear, { key: 'bear', angle: angle + headWhip, phase: runT, swing: 18 + vigor * 34 })
            : el(BullFox, { key: 'bull', angle: angle + headWhip, phase: runT, swing: 18 + vigor * 34 }),
          el('div', { key: 'badge', className: 'bullbear-badge' + (mood === 'up' ? ' bullbear-up' : (mood === 'down' ? ' bullbear-down' : ' bullbear-flat')) }, [
            el('span', { key: 'pv', className: 'bullbear-val' }, pctText),
            el('span', { key: 'tip', className: 'bullbear-tip' }, mood === 'up' ? '组合·牛抬头' : (mood === 'down' ? '组合·熊低头' : '组合·横盘')),
          ]),
          error ? el('div', { key: 'err', className: 'bullbear-error', style: { position: 'absolute' } }, error) : null,
          el('div', { key: 'ground', className: 'bullbear-ground' }),
          dustOn ? el('div', { key: 'dust', className: 'bullbear-dust', style: dustStyle }) : null,
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