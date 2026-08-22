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
input[type=text],textarea,select{width:100%;border:1px solid var(--border-card);border-radius:10px;padding:10px;font:inherit;font-size:15px;background:#fff;color:var(--foreground)}
textarea{min-height:64px;resize:vertical}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:480px){.row2{grid-template-columns:1fr}}
.btn-main{display:block;width:100%;min-height:48px;border:0;border-radius:999px;background:var(--ember);color:#f7f1e5;font:inherit;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px}
.btn-main:hover{background:var(--ember-deep)}
.btn-ghost{min-height:40px;border:1px solid var(--border-card);border-radius:10px;background:rgba(43,36,28,.05);color:var(--foreground);font:inherit;font-size:14px;cursor:pointer;padding:6px 14px}
.hint{font-size:12.5px;color:var(--muted)}
.spreads{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
@media(max-width:560px){.spreads{grid-template-columns:repeat(2,1fr)}}
.spread{border:1px solid var(--border-card);border-radius:10px;background:#fff;padding:10px 8px;font:inherit;cursor:pointer;text-align:center;color:var(--foreground)}
.spread b{display:block;font-size:14.5px}
.spread span{display:block;font-size:11.5px;color:var(--muted);margin-top:2px}
.spread.on{border-color:var(--cinnabar);background:rgba(178,62,38,.06);box-shadow:inset 0 0 0 1px var(--cinnabar)}
.mode{display:flex;gap:8px;margin:2px 0 8px}
.mode button{flex:1;min-height:42px;border:1px solid var(--border-card);border-radius:10px;background:rgba(43,36,28,.05);font:inherit;font-size:14.5px;cursor:pointer;color:var(--foreground)}
.mode button.on{background:var(--cinnabar);border-color:var(--cinnabar);color:#fff}
.pickgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin:8px 0}
@media(max-width:560px){.pickgrid{grid-template-columns:repeat(4,1fr)}}
.pick{border:1px solid var(--border-card);border-radius:8px;background:#fff;font:inherit;font-size:11.5px;line-height:1.3;padding:5px 2px;cursor:pointer;color:var(--foreground)}
.pick.used{opacity:.28;cursor:not-allowed}
.pick b{display:block;font-size:13px}
.dealt{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin:10px 0}
.dealt.gt{grid-template-columns:repeat(9,1fr);gap:4px}
@media(max-width:640px){.dealt.gt{grid-template-columns:repeat(6,1fr)}}
.cardface{border:1px solid var(--border-card);border-radius:10px;background:#fffdf9;padding:8px 4px;text-align:center;position:relative;min-height:86px}
.cardface .no{font-size:11px;color:var(--muted)}
.cardface .glyph{font-size:22px;line-height:1.3}
.cardface .glyph .zi{display:inline-block;width:28px;height:28px;line-height:28px;border-radius:50%;background:var(--sand);font-size:15px;font-family:var(--font-serif)}
.cardface .nm{font-size:13px;font-weight:600;color:var(--ink)}
.cardface .en{font-size:10.5px;color:var(--muted)}
.cardface .pk{position:absolute;top:4px;right:6px;font-size:10px;color:var(--muted)}
.cardface .pk.red{color:var(--cinnabar)}
.cardface .poslab{font-size:10.5px;color:var(--cinnabar-deep);margin-top:2px}
.cardface.gtc{min-height:64px;padding:4px 2px}
.cardface.gtc .glyph{font-size:15px}
.cardface.gtc .nm{font-size:10.5px}
.cardface.sig{outline:2px solid var(--cinnabar);outline-offset:1px}
.kv{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;font-size:14px}
.kv dt{color:var(--muted)}.kv dd{margin:0}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin:4px 0 6px}
.chip{flex:0 0 auto;border:1px solid var(--border-card);background:rgba(43,36,28,.05);border-radius:999px;padding:6px 14px;font-size:14px;cursor:pointer;white-space:nowrap;color:var(--foreground)}
.chip.on{background:var(--cinnabar);border-color:var(--cinnabar);color:#fff}
.blurb{font-size:13px;color:var(--muted);margin:0 0 10px;min-height:1.4em}
.btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 8px}
@media(max-width:480px){.btns{grid-template-columns:1fr}}
.btn-copy{min-height:46px;border:0;border-radius:10px;background:var(--cinnabar);color:#fff;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.btn-copy:disabled{opacity:.45;cursor:not-allowed}
.btn-copy2{min-height:46px;border:1px solid var(--cinnabar);border-radius:10px;background:transparent;color:var(--cinnabar);font:inherit;font-size:15px;font-weight:600;cursor:pointer}
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
<h1>免費雷諾曼占卜</h1>
<p class="lead">36 張 Petit Lenormand，問日常、問走向、問抉擇。靜心寫低問題，揀牌陣抽牌（或錄入你實體抽嘅牌），再一鍵複製 AI 解讀資料包，貼去 ChatGPT／Claude／Gemini 深入連讀。</p>

<!-- ═══ SECTION:FORM ═══ -->
<section class="card" id="formCard">
  <h2>開始占卜</h2>
  <label for="q">我的問題（選填；每日一張可以留空）</label>
  <textarea id="q" maxlength="300" placeholder="例：如果我留喺而家間公司，下半年會點發展？"></textarea>
  <div class="row2" id="abRow" style="display:none">
    <div><label for="optA">選項 A</label><input type="text" id="optA" maxlength="60" placeholder="例：留喺現職"></div>
    <div><label for="optB">選項 B</label><input type="text" id="optB" maxlength="60" placeholder="例：接受新 offer"></div>
  </div>
  <label>牌陣</label>
  <div class="spreads" id="spreadBox"></div>
  <div id="sigRow" style="display:none">
    <label for="sig">指示牌（大藍圖用；代表問卜人自己）</label>
    <select id="sig"></select>
  </div>
  <label>抽牌方式</label>
  <div class="mode">
    <button type="button" id="modeAuto" class="on">線上抽牌</button>
    <button type="button" id="modeManual">錄入實體抽牌</button>
  </div>
  <div id="manualArea" style="display:none">
    <p class="hint" style="margin:4px 0 0">用你自己副牌抽好之後，按抽出先後喺下面逐張點選。大藍圖（36 張）唔支援手動錄入。</p>
    <div class="pickgrid" id="pickGrid"></div>
    <div class="inline"><button type="button" class="btn-ghost" id="pickReset">重新揀過</button>　<span class="hint" id="pickStatus"></span></div>
  </div>
  <button type="button" class="btn-main" id="drawBtn">抽牌</button>
  <p class="hint" style="margin:10px 0 0">線上抽牌用加密隨機數洗牌；雷諾曼傳統唔用逆位，本工具全部正位論。一事一問，同一問題唔好短時間內反覆抽。</p>
</section>

<!-- ═══ SECTION:CHART ═══ -->
<section class="card" id="chartCard" style="display:none">
  <h2 id="resultTitle">抽出的牌</h2>
  <dl class="kv" id="drawInfo" style="margin-bottom:10px"></dl>
  <div class="dealt" id="dealt"></div>
  <p class="hint" id="layoutHint"></p>
</section>

<!-- ═══ SECTION:AI-PANEL ═══ -->
<section class="card" id="aiCard" style="display:none" aria-labelledby="ai-title">
  <h2 id="ai-title">交給 AI 解讀</h2>
  <p class="lead" style="margin-bottom:10px">牌抽好，下一步係問對問題。揀一個方向，複製去你慣用嘅 ChatGPT／Claude／Gemini，佢就會照呢一鋪牌答你。免費、免登入。</p>
  <div class="chips" role="radiogroup" aria-label="解讀方向" id="chips"></div>
  <p class="blurb" id="blurb"></p>
  <div class="warn" id="freeWarn">請先喺上面「我的問題」寫低你想問乜，先可以用自由提問。</div>
  <div class="btns">
    <button type="button" class="btn-copy" id="copyAll">複製 Prompt＋資料包</button>
    <button type="button" class="btn-copy2" id="copyPack">只複製資料包</button>
  </div>
  <details><summary>預覽將會複製嘅全文</summary><pre id="preview"></pre></details>
  <div class="links">貼上去：<a href="https://chatgpt.com/" target="_blank" rel="noopener">開 ChatGPT ↗</a><a href="https://claude.ai/new" target="_blank" rel="noopener">開 Claude ↗</a><a href="https://gemini.google.com/app" target="_blank" rel="noopener">開 Gemini ↗</a></div>
  <div class="privacy">資料包同「重開此局」連結含你嘅問題同抽牌結果，請只分享畀你信任嘅人或 AI 服務。</div>
</section>

<!-- ═══ SECTION:CONSULT-BRIDGE ═══ -->
<div style="margin:8px 0 16px;padding:14px 16px;background:rgba(178,62,38,.06);border:1px solid rgba(178,62,38,.18);border-radius:12px;font-size:14px;color:#5A5247;line-height:1.7">
  牌卡幫你照一件事，命盤先睇到成盤人生。想由一事睇到格局，<a href="/consultation" style="color:#b23e26;font-weight:600">預約八字深度諮詢 →</a>
</div>

<!-- ═══ SECTION:BIANJIE ═══ -->
<section class="card">
  <details>
    <summary>占卜口徑與邊界（供核對）</summary>
    <div style="font-size:13.5px;color:var(--muted);margin-top:8px;line-height:1.9">
      <p style="margin:0 0 6px">・牌組：Petit Lenormand 36 張，每張附傳統撲克對應；全部正位論，不用逆位（雷諾曼傳統）。<br>
      ・讀法口徑：組合行先，相鄰嘅牌會改寫對方嘅意思，唔逐張獨立解；資料包附每張牌嘅傳統關鍵詞做提示，組合意義由解讀層判斷。<br>
      ・抽牌：線上抽牌用瀏覽器加密隨機數（crypto.getRandomValues）洗牌；手動錄入以你實體抽出嘅先後順序為準。<br>
      ・大藍圖：36 張全鋪，9×4 排列；宮位（House）以標準 1–36 牌序對應。<br>
      ・邊界：本工具唔出吉凶斷語、唔計時間應期；判斷交畀你同你信任嘅解讀者。</p>
    </div>
  </details>
</section>

<!-- ═══ SECTION:SEO ═══ -->
<section class="seo">
  <h2>雷諾曼占卜是什麼</h2>
  <p>雷諾曼（Lenormand）源自 19 世紀法國的 36 張占卜牌，每張牌對應一個具體意象：騎士代表消息、房屋代表家宅、狐狸代表心機、錨代表安穩。與塔羅不同，雷諾曼不講宏大原型，而著重日常實事；讀法亦非逐張解讀，而是如同組句一般，將相鄰的牌兩兩組合連讀，一組牌讀成一段有脈絡的訊息。本工具提供六種牌陣：每日一張、三張連讀、五張連讀、九宮格、二選一，以及 36 張全鋪的大藍圖。</p>
  <h2>如何把雷諾曼牌交給 ChatGPT 解讀？</h2>
  <p>直接告訴 AI「我抽了騎士與雲」，AI 多數會逐張講解牌義，錯過雷諾曼最核心的組合連讀；牌陣位置與宮位資訊亦容易遺漏。正確做法是：在此抽牌（或錄入實體牌），複製「Prompt＋資料包」貼至 ChatGPT、Claude 或 Gemini。資料包列明牌陣結構、每個位置的意義、各牌的傳統關鍵詞，Prompt 指明須組合連讀、不得逐張獨立交代，AI 便會依規解讀。</p>
  <h2>雷諾曼占卜常見誤解</h2>
  <p>第一，將雷諾曼視為「簡化版塔羅」：兩套系統讀法各異，雷諾曼著重組合與具體事象，塔羅著重原型與心理歷程，各有所長。第二，見到棺材、鐮刀、十字架便感到恐慌：雷諾曼沒有絕對的凶牌，棺材可象徵一個階段完結，鐮刀可象徵果斷收割，意義由組合與問題脈絡決定。第三，同一問題反覆抽至滿意為止：短時間內重複提問只會增加雜訊，應一事一問，隔一段時間再問。</p>
  <h2>常見問題</h2>
  <div class="faq-item"><h3>Q1　雷諾曼有沒有逆位？</h3><p>傳統雷諾曼不使用逆位，本工具全部以正位論，牌的色彩由組合與脈絡決定。</p></div>
  <div class="faq-item"><h3>Q2　本人有實體牌，是否可以使用？</h3><p>可以。選擇「錄入實體抽牌」，按抽出的先後順序逐張點選，工具將按您的結果排陣並生成資料包（大藍圖除外）。</p></div>
  <div class="faq-item"><h3>Q3　大藍圖是什麼？</h3><p>大藍圖（Grand Tableau）是雷諾曼最完整的讀法：36 張牌全部鋪開，9 列 4 行，由指示牌（代表問卜人的牌）的位置、周圍的牌及宮位對應讀出全局。適合全面審視一段時期運勢時使用。</p></div>
  <div class="faq-item"><h3>Q4　什麼是指示牌？</h3><p>指示牌（Significator）是代表問卜人的牌，傳統上男性用男人（28）、女性用女人（29），亦可自行選擇。大藍圖將以指示牌位置作為解讀中心。</p></div>
  <div class="faq-item"><h3>Q5　如何提問才有效？</h3><p>一次聚焦一件事，開放式問題比是非題更有層次：與其問「我應否辭職」，不如問「若繼續留下，接下來將如何發展」。問題越具體，連讀越貼身。</p></div>
  <div class="faq-item"><h3>Q6　此工具需要付費嗎？</h3><p>不需要。雷諾曼占卜與 AI 資料包全部免費，免登入、免安裝。</p></div>
</section>

<footer>
  占卜結果屬自我反思參考，不構成醫療、法律、財務等專業意見；最終決定權永遠喺你手上。<br>
  命運解決師 陳卓賢 · destinysolver.com ｜ <a href="https://www.destinysolver.com/consultation" style="color:var(--cinnabar)">預約深度諮詢</a><br>
  © 2026 命運解決師 陳卓賢．本頁文案、資料包格式（ds-*-pack）、prompt 設計與介面均為原創作品，受版權保護；歡迎分享連結，未經授權請勿複製轉載。
</footer>
</div>
<div class="toast" id="toast">已複製 ✓ 去 ChatGPT／Claude／Gemini 貼上即可。</div>
`

export default function LenormandTool() {
  useEffect(() => {
    ;(window as any).__lenormandInit?.()
    return setupToolAnalytics('lenormand')
  }, [])
  return (
    <div className="pt-24">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        src="/scripts/lenormand-tool.js"
        strategy="afterInteractive"
        onLoad={() => { ;(window as any).__lenormandInit?.() }}
      />
    </div>
  )
}
