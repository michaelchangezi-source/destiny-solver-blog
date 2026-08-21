'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import { setupToolAnalytics } from '@/lib/tool-analytics'

const css = `
/* ═══ DS-STYLE：跟 destinysolver.com 現有 design token（置入時可換成 codebase 樣式） ═══ */
:root{--background:#fafaf8;--surface:#fff;--sand:#f4eee1;--foreground:#2b241c;--ink:#161310;
--cinnabar:#b23e26;--cinnabar-deep:#96321e;--ember:#e0552c;--ember-deep:#c9461f;--gold:#e8a86e;
--muted:#6b6155;--border-card:rgba(43,36,28,.14);
--shadow-card:0 1px 2px rgba(43,36,28,.04),0 4px 12px rgba(43,36,28,.06);
--font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang TC","PingFang HK","Hiragino Sans TC","Microsoft JhengHei","Noto Sans TC",system-ui,sans-serif;
--font-serif:"Noto Serif TC","Songti TC","Noto Serif CJK TC","PMingLiU",serif;}
*{box-sizing:border-box}
.wrap{max-width:760px;margin:0 auto;padding:28px 16px 64px}
.eyebrow{font-size:12px;letter-spacing:.22em;color:var(--muted);font-weight:600}
h1{font-family:var(--font-serif);font-weight:900;font-size:clamp(26px,6vw,36px);color:var(--cinnabar);margin:6px 0 8px;line-height:1.3}
.lead{color:var(--muted);font-size:15px;margin:0 0 22px}
.card{background:var(--surface);border:1px solid var(--border-card);border-radius:14px;padding:18px 16px;box-shadow:var(--shadow-card);margin-bottom:16px}
.card h2{font-family:var(--font-serif);font-size:19px;margin:0 0 10px;color:var(--ink)}
label{display:block;font-size:13px;color:var(--muted);margin:10px 0 4px}
input[type=text],input[type=datetime-local],input[type=number],textarea,select{width:100%;border:1px solid var(--border-card);border-radius:10px;padding:10px;font:inherit;font-size:15px;background:#fff;color:var(--foreground)}
textarea{min-height:64px;resize:vertical}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:480px){.row2{grid-template-columns:1fr}}
.inline{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.btn-main{display:block;width:100%;min-height:48px;border:0;border-radius:999px;background:var(--ember);color:#f7f1e5;font:inherit;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px}
.btn-main:hover{background:var(--ember-deep)}
.btn-ghost{min-height:40px;border:1px solid var(--border-card);border-radius:10px;background:rgba(43,36,28,.05);color:var(--foreground);font:inherit;font-size:14px;cursor:pointer;padding:6px 14px}
.hint{font-size:12.5px;color:var(--muted)}
.grid9{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:12px 0}
.gcell{border:1px solid var(--border-card);border-radius:10px;background:#fffdf9;padding:8px 6px;min-height:118px;font-size:12.5px;line-height:1.5;position:relative}
.gcell .pn{position:absolute;top:6px;right:8px;font-size:11px;color:var(--muted)}
.gcell .role{position:absolute;top:6px;left:8px;font-size:11px;color:#fff;background:var(--cinnabar);border-radius:6px;padding:0 5px}
.gcell .stargod{color:var(--ink);font-weight:600}
.gcell .door{color:var(--cinnabar-deep);font-weight:700}
.gcell .stems{font-size:15px;letter-spacing:.08em}
.gcell .stems b{font-family:var(--font-serif)}
.gcell .mk{color:#8a6d3b;font-size:11.5px}
.gcell.center{background:var(--sand);color:var(--muted)}
.kv{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;font-size:14px}
.kv dt{color:var(--muted)}
.kv dd{margin:0}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin:4px 0 6px}
.chip{flex:0 0 auto;border:1px solid var(--border-card);background:rgba(43,36,28,.05);border-radius:999px;padding:6px 14px;font-size:14px;cursor:pointer;white-space:nowrap;color:var(--foreground)}
.chip.on{background:var(--cinnabar);border-color:var(--cinnabar);color:#fff}
.blurb{font-size:13px;color:var(--muted);margin:0 0 10px;min-height:1.4em}
.btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 8px}
@media(max-width:480px){.btns{grid-template-columns:1fr}}
.btn-copy{min-height:46px;border:0;border-radius:10px;background:var(--cinnabar);color:#fff;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.btn-copy:disabled{opacity:.45;cursor:not-allowed}
.btn-copy2{min-height:46px;border:1px solid var(--cinnabar);border-radius:10px;background:transparent;color:var(--cinnabar);font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.btn-copy2:disabled{opacity:.45;cursor:not-allowed}
details{margin-top:10px}
summary{cursor:pointer;font-size:14px;color:var(--muted)}
pre{white-space:pre-wrap;word-break:break-word;background:#fff;border:1px solid var(--border-card);border-radius:10px;padding:12px;font-size:12.5px;max-height:44vh;overflow:auto;margin:8px 0 0}
.links{font-size:13.5px;margin-top:10px}
.links a{color:var(--cinnabar);margin-right:12px}
.privacy{font-size:12px;color:var(--muted);margin-top:8px}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:50}
.toast.show{opacity:1}
.seo h2{font-family:var(--font-serif);font-size:20px;color:var(--ink);margin:26px 0 8px}
.seo p{font-size:15px;margin:0 0 12px}
.faq-item{border-bottom:1px solid var(--border-card);padding:10px 0}
.faq-item h3{font-size:15.5px;margin:0 0 6px;color:var(--ink)}
.faq-item p{font-size:14.5px;color:var(--muted);margin:0}
footer{margin-top:36px;font-size:12.5px;color:var(--muted);border-top:1px solid var(--border-card);padding-top:14px}
.warn{font-size:13px;color:var(--cinnabar-deep);background:rgba(178,62,38,.07);border:1px solid rgba(178,62,38,.2);border-radius:10px;padding:8px 12px;margin:10px 0 0;display:none}
`

const html = `
<div class="wrap">

<!-- ═══ SECTION:HEADER ═══ -->
<div class="eyebrow">FREE TOOL</div>
<h1>免費奇門遁甲排盤</h1>
<p class="lead">奇門一時一局：以你起念嗰一刻嘅時空，睇件事嘅局勢同進退。輸入起局時刻，即時排出陰陽遁局數、值符值使同九宮五層盤，並可一鍵複製 AI 解讀資料包，貼去 ChatGPT／Claude／Gemini 深入分析。</p>

<!-- ═══ SECTION:FORM ═══ -->
<section class="card" id="formCard">
  <h2>起局</h2>
  <label for="q">所占之事（選填，一事一局，越具體越好）</label>
  <textarea id="q" maxlength="300" placeholder="例：下星期同客戶簽約，呢單刻唔刻成？"></textarea>
  <div class="row2">
    <div>
      <label for="dt">起局時刻（預設當下）</label>
      <input type="datetime-local" id="dt">
    </div>
    <div>
      <label>&nbsp;</label>
      <button type="button" class="btn-ghost" id="nowBtn">用而家呢一刻</button>
    </div>
  </div>
  <div class="row2">
    <div>
      <label for="ny">當事人出生年（選填，作年命參照）</label>
      <input type="number" id="ny" min="1900" max="2100" placeholder="例：1990">
      <span class="inline hint"><label style="margin:4px 0 0;display:inline-flex;align-items:center;gap:4px"><input type="checkbox" id="nyb" style="width:auto">生於該年立春前</label></span>
    </div>
    <div>
      <label for="oy">對方出生年（選填，問感情／合作時用）</label>
      <input type="number" id="oy" min="1900" max="2100" placeholder="例：1992">
      <span class="inline hint"><label style="margin:4px 0 0;display:inline-flex;align-items:center;gap:4px"><input type="checkbox" id="oyb" style="width:auto">生於該年立春前</label></span>
    </div>
  </div>
  <button type="button" class="btn-main" id="castBtn">起局排盤</button>
  <p class="hint" style="margin:10px 0 0">口徑：轉盤時家 · 拆補定局 · 中五寄坤二宮 · 子時 23:00 換日 · 香港時間。詳見下方「排盤口徑與邊界」。</p>
</section>

<!-- ═══ SECTION:CHART ═══ -->
<section class="card" id="chartCard" style="display:none">
  <h2>九宮盤</h2>
  <dl class="kv" id="juInfo"></dl>
  <div class="grid9" id="grid9"></div>
  <p class="hint">盤圖畀你核對；要畀 AI 分析，請用下面面板複製資料包。宮內每格由上至下：地盤干／天盤干、九星 · 八神、八門、標記。</p>
</section>

<!-- ═══ SECTION:AI-PANEL ═══ -->
<section class="card" id="aiCard" style="display:none" aria-labelledby="ai-title">
  <h2 id="ai-title">交給 AI 解讀</h2>
  <p class="lead" style="margin-bottom:10px">局排好，下一步係問對問題。揀一個方向，複製去你慣用嘅 ChatGPT／Claude／Gemini，佢就會照呢個局答你。免費、免登入。</p>
  <div class="chips" role="radiogroup" aria-label="解讀方向" id="chips"></div>
  <p class="blurb" id="blurb"></p>
  <div class="warn" id="freeWarn">請先喺上面「所占之事」寫低你想問乜，先可以用自由提問。</div>
  <div class="btns">
    <button type="button" class="btn-copy" id="copyAll">複製 Prompt＋資料包</button>
    <button type="button" class="btn-copy2" id="copyPack">只複製資料包</button>
  </div>
  <details><summary>預覽將會複製嘅全文</summary><pre id="preview"></pre></details>
  <div class="links">貼上去：<a href="https://chatgpt.com/" target="_blank" rel="noopener">開 ChatGPT ↗</a><a href="https://claude.ai/new" target="_blank" rel="noopener">開 Claude ↗</a><a href="https://gemini.google.com/app" target="_blank" rel="noopener">開 Gemini ↗</a></div>
  <div class="privacy">資料包同「重開此局」連結含你嘅問事同起局時刻，請只分享畀你信任嘅人或 AI 服務。</div>
</section>

<!-- ═══ SECTION:CONSULT-BRIDGE ═══ -->
<div style="margin:8px 0 16px;padding:14px 16px;background:rgba(178,62,38,.06);border:1px solid rgba(178,62,38,.18);border-radius:12px;font-size:14px;color:#5A5247;line-height:1.7">
  六爻問一事，八字看一生。事情背後想睇埋自己嘅格局同時機，<a href="/consultation" style="color:#b23e26;font-weight:600">預約八字深度諮詢 →</a>
</div>

<!-- ═══ SECTION:BIANJIE ═══ -->
<section class="card">
  <details>
    <summary>排盤口徑與邊界（供核對）</summary>
    <div style="font-size:13.5px;color:var(--muted);margin-top:8px;line-height:1.9">
      <p style="margin:0 0 6px">所有口徑固定並寫入資料包，方便你或任何解讀者核對：</p>
      <p style="margin:0 0 6px">・盤式：轉盤時家奇門。定局法：拆補（按日柱符頭定三元）。中五寄坤二宮；天禽寄天芮。<br>
      ・曆法：香港時間（UTC+8）；年柱立春換年、月柱節氣換月；日柱 23:00 換日（早子時）；節氣時刻以天文算法計算，與天文台公佈時刻誤差一分鐘內，貼近交節時刻起局請自行覆核。<br>
      ・標記：空＝時柱旬空所在宮；馬＝時支驛馬所在宮；刑＝六儀擊刑；墓＝十干墓（甲墓坤二、乙丙戊墓乾六、丁己庚墓艮八、辛壬墓巽四、癸墓坤二）；迫＝門克宮。<br>
      ・邊界：本工具唔提供置閏定局、飛盤奇門、真太陽時；奇門流派口徑有異，本站唔作「唯一正確」宣稱，資料包寫明口徑，判斷交畀解讀者。工具只出結構，唔出吉凶斷語。</p>
    </div>
  </details>
</section>

<!-- ═══ SECTION:SEO ═══ -->
<section class="seo">
  <h2>奇門遁甲排盤計算什麼</h2>
  <p>奇門遁甲是以時間空間定局的問事之術：取你起念、起事的一刻，按節氣定陰陽遁與局數，把三奇六儀佈入九宮，再排上九星、八門、八神。工具會排出起局四柱、定局（陰遁或陽遁第幾局、上中下元）、旬首、值符值使及其落宮，以及九宮每一宮的地盤干、天盤干、九星、八門、八神與空馬刑墓迫標記。與八字不同，奇門問的不是「我是什麼人」，而是「這件事此刻的局勢與進退」。</p>
  <h2>如何把奇門盤交給 ChatGPT 分析？</h2>
  <p>直接叫 AI「幫我起一個奇門局」多數會排錯：模型未必知道今日日辰、目前節氣同拆補三元，值符值使經常靠估。正確分工係：工具負責排準個局，你複製上面嘅「Prompt＋資料包」貼去 ChatGPT、Claude 或 Gemini，AI 只負責解讀一份已經排啱嘅結構化資料。資料包寫明排盤口徑，缺什麼層級 AI 會照實講，唔會靠常識補。</p>
  <h2>奇門排盤常見誤解</h2>
  <p>第一，以為隨時排一局都一樣：奇門一時一局，同一個時辰內盤局相同，換一個時辰全局重排，所以「所占之事」要喺起念嗰刻起局。第二，把值符值使當成吉凶答案：值符代表事情主氣所在、值使關人事走動，係讀盤入口，唔係結論，吉凶要睇用神落宮嘅門星神組合。第三，把拆補同置閏爭議當成對錯問題：兩者係唔同定局法，各流派有各自傳承，本工具固定用拆補並喺資料包寫明，方便核對。</p>
  <h2>常見問題</h2>
  <div class="faq-item"><h3>Q1　奇門遁甲要唔要輸入出生時間？</h3><p>唔需要。奇門以起局時刻定盤，唔使出生資料；如果想喺盤中對照自己，可以選填出生年做年命參照。</p></div>
  <div class="faq-item"><h3>Q2　乜嘢係值符值使？</h3><p>值符係當旬旬首所帶嘅九星，代表事情嘅主氣所在；值使係同宮嘅八門，多與人事同行動相關。工具會列明兩者落喺邊一宮。</p></div>
  <div class="faq-item"><h3>Q3　拆補定局係乜？</h3><p>拆補以起局日嘅符頭（最近嘅甲日或己日）地支定上中下元：子午卯酉為上元、寅申巳亥為中元、辰戌丑未為下元，再按節氣查局數。本工具固定用拆補，並喺資料包寫明。</p></div>
  <div class="faq-item"><h3>Q4　點解中五宮無門星神？</h3><p>轉盤奇門中五宮唔安門星神，寄於坤二宮；天禽星寄天芮。工具喺中宮同資料包都會標明「寄坤二宮」。</p></div>
  <div class="faq-item"><h3>Q5　資料包貼畀 AI 之後，AI 會唔會亂補嘢？</h3><p>資料包附有使用規則：以資料包為唯一盤面事實、唔准改局重排、未列出嘅層級要直接講明。實測主流模型會照跟；如果 AI 輸出嘅盤面同資料包唔一致，以資料包為準。</p></div>
  <div class="faq-item"><h3>Q6　呢個工具需要付費嗎？</h3><p>唔需要。奇門排盤同 AI 資料包全部免費，免登入免安裝。</p></div>
</section>

<footer>
  本工具只出可核對嘅盤面結構，唔出吉凶斷語；解讀屬命理參考，不構成專業意見。<br>
  命運解決師 陳卓賢 · destinysolver.com ｜ <a href="https://www.destinysolver.com/consultation" style="color:var(--cinnabar)">預約深度諮詢</a><br>
  © 2026 命運解決師 陳卓賢．本頁文案、資料包格式（ds-*-pack）、prompt 設計與介面均為原創作品，受版權保護；歡迎分享連結，未經授權請勿複製轉載。
</footer>
</div>
<div class="toast" id="toast">已複製 ✓ 去 ChatGPT／Claude／Gemini 貼上即可。</div>
`

export default function QimenTool() {
  useEffect(() => {
    ;(window as any).__qimenInit?.()
    return setupToolAnalytics('qimen')
  }, [])
  return (
    <div className="pt-24">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        src="/scripts/qimen-tool.js"
        strategy="afterInteractive"
        onLoad={() => { ;(window as any).__qimenInit?.() }}
      />
    </div>
  )
}
