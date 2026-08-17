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
.bullbear{position:fixed;left:16px;bottom:20px;z-index:1200;cursor:grab;user-select:none;pointer-events:auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,.25));}
.bullbear:active{cursor:grabbing;}
.bullbear-badge{position:fixed;left:16px;bottom:20px;z-index:1201;display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:12px;line-height:1.4;color:var(--dsw-alias-label-primary);pointer-events:auto;cursor:pointer;}
.bullbear-up{color:var(--dsw-alias-state-error-primary);}
.bullbear-down{color:var(--dsw-alias-state-success-primary);}
.bullbear-flat{color:var(--dsw-alias-label-secondary);}
.bullbear-name{font-size:11px;color:var(--dsw-alias-label-secondary);}
.bullbear-tip{font-size:10px;color:var(--dsw-alias-label-secondary);}
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

    // ---- 牛（SVG）----
    function BullFox({ angle }) {
      // angle>0 抬头（看涨），angle<0 低头。头围绕颈部旋转 + 微位移增强表现
      const rot = angle * 0.6      // 旋转主导
      const headY = -angle * 0.9   // 平移辅助
      return el('svg', { width: 150, height: 130, viewBox: '0 0 150 130' }, [
        // 身体
        el('path', { key: 'body', d: 'M20 95 C20 60 55 42 90 46 C120 49 140 66 138 92 C137 108 120 118 96 118 C60 118 20 110 20 95 Z', fill: '#d9a066' }),
        // 腿
        el('path', { key: 'leg1', d: 'M40 118 L36 128 M64 118 L60 128 M88 118 L84 128 M106 118 L110 128', stroke: '#7c4a21', strokeWidth: 6, strokeLinecap: 'round' }),
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
    function Bear({ angle }) {
      // angle 越负（下跌）熊头越低。旋转 + 下移增强低头
      const rot = angle * 0.6
      const headY = angle * 0.9 // 负angle=>正值=>translate下移
      return el('svg', { width: 150, height: 130, viewBox: '0 0 150 130' }, [
        el('path', { key: 'body', d: 'M22 98 C22 62 58 44 92 48 C122 51 140 70 136 96 C133 112 114 122 90 122 C56 122 22 112 22 98 Z', fill: '#6b4f3a' }),
        el('path', { key: 'leg1', d: 'M40 122 L36 129 M64 122 L60 129 M88 122 L84 129 M106 122 L110 129', stroke: '#3a2a1c', strokeWidth: 6, strokeLinecap: 'round' }),
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

    // ---- 主组件：shell.overlay 宠物 ----
    function BullBearPet() {
      const [stat, setStat] = React.useState(null)
      const [sensitivity, setSensitivity] = React.useState(1)
      const [visible, setVisible] = React.useState(true)
      const [pos, setPos] = React.useState(null)
      const [error, setError] = React.useState('')

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

      // 归一化：涨跌方向 + 速率
      let angle = 0, mood = 'flat', focusName = ''
      if (stat && stat.focus) {
        focusName = stat.focus.name + ' ' + Number(stat.focus.last).toFixed(2)
        const r = stat.avgRate || stat.focus.rate || 0
        angle = rateToAngle(r, sensitivity)
        const pct = stat.focus.pct
        mood = pct > 0.05 ? 'up' : (pct < -0.05 ? 'down' : 'flat')
      }

      const pctText = stat && stat.focus ? (stat.focus.pct > 0 ? '+' : '') + Number(stat.focus.pct).toFixed(2) + '%' : '--'

      return el('div', {
        className: 'bullbear',
        style: pos ? { left: pos.x, top: pos.y } : null,
        onClick: function () { setVisible(false) },
        title: '点击收起',
      }, [
        mood === 'down'
          ? el(Bear, { key: 'bear', angle: angle })
          : el(BullFox, { key: 'bull', angle: angle }),
        el('div', { key: 'badge', className: 'bullbear-badge' + (mood === 'up' ? ' bullbear-up' : (mood === 'down' ? ' bullbear-down' : ' bullbear-flat')) }, [
          el('span', { key: 'nm', className: 'bullbear-name' }, focusName || '行情'),
          el('span', { key: 'pv', className: 'bullbear-val' }, pctText),
          el('span', { key: 'tip', className: 'bullbear-tip' }, mood === 'up' ? '牛抬头' : (mood === 'down' ? '熊低头' : '横盘')),
        ]),
        error ? el('div', { key: 'err', className: 'bullbear-tip', style: { position: 'absolute' } }, error) : null,
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