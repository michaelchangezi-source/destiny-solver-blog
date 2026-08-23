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
.inline{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
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
.pickgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:8px 0;max-height:300px;overflow:auto;border:1px solid var(--border-card);border-radius:10px;padding:8px}
@media(max-width:560px){.pickgrid{grid-template-columns:repeat(4,1fr)}}
.pick{border:1px solid var(--border-card);border-radius:8px;background:#fff;font:inherit;font-size:11px;line-height:1.3;padding:5px 2px;cursor:pointer;color:var(--foreground)}
.pick.used{opacity:.28;cursor:not-allowed}
.pickedlist{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.pchip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border-card);border-radius:999px;padding:3px 10px;font-size:12.5px;background:#fff}
.pchip button{border:0;background:var(--sand);border-radius:999px;font:inherit;font-size:11px;cursor:pointer;padding:1px 8px}
.pchip button.rev{background:var(--cinnabar);color:#fff}
.dealt{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin:10px 0}
.cardface{border:1px solid var(--border-card);border-radius:10px;background:#fffdf9;padding:10px 4px;text-align:center;position:relative;min-height:104px}
.cardface .no{font-size:10.5px;color:var(--muted)}
.cardface .glyph{font-size:24px;line-height:1.4;display:inline-block}
.cardface.rev .glyph{transform:rotate(180deg)}
.cardface .nm{font-size:13px;font-weight:600;color:var(--ink)}
.cardface .en{font-size:10px;color:var(--muted)}
.cardface .ori{position:absolute;top:5px;right:6px;font-size:10.5px;color:var(--muted)}
.cardface.rev .ori{color:var(--cinnabar);font-weight:700}
.cardface .poslab{font-size:10.5px;color:var(--cinnabar-deep);margin-top:3px}
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
<h1>免費塔羅占卜</h1>
<p class="lead">78 張韋特塔羅，支援正逆位。靜心寫下問題，選擇牌陣抽牌（或錄入您的實體牌），再一鍵複製 AI 解讀資料包，貼至 ChatGPT／Claude／Gemini 深入解讀。</p>

<!-- ═══ SECTION:FORM ═══ -->
<section class="card" id="formCard">
  <h2>開始占卜</h2>
  <label for="q">我的問題（選填；單張指引可以留空）</label>
  <textarea id="q" maxlength="300" placeholder="例：繼續與目前的伴侶走下去，關係將如何發展？"></textarea>
  <div class="row2" id="abRow" style="display:none">
    <div><label for="optA">選項 A</label><input type="text" id="optA" maxlength="60" placeholder="例：留喺現職"></div>
    <div><label for="optB">選項 B</label><input type="text" id="optB" maxlength="60" placeholder="例：接受新 offer"></div>
  </div>
  <label>牌陣</label>
  <div class="spreads" id="spreadBox"></div>
  <label>抽牌方式</label>
  <div class="mode">
    <button type="button" id="modeAuto" class="on">線上抽牌</button>
    <button type="button" id="modeManual">錄入實體抽牌</button>
  </div>
  <div class="inline" id="revRow">
    <label style="margin:0;display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="useRev" checked style="width:auto">使用逆位（線上抽牌）</label>
  </div>
  <div id="manualArea" style="display:none">
    <p class="hint" style="margin:4px 0 0">請用您的實體牌抽好後，按抽出先後順序逐張點選；點選後可在下方名單切換「正／逆」方向。</p>
    <div class="pickgrid" id="pickGrid"></div>
    <div class="pickedlist" id="pickedList"></div>
    <div class="inline"><button type="button" class="btn-ghost" id="pickReset">重新選過</button>　<span class="hint" id="pickStatus"></span></div>
  </div>
  <button type="button" class="btn-main" id="drawBtn">抽牌</button>
  <p class="hint" style="margin:10px 0 0">線上抽牌採用加密隨機數洗牌，正逆位各半機會。一事一問，同一問題不宜短時間內反覆抽牌。</p>
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
  <p class="lead" style="margin-bottom:10px">牌抽好後，下一步是問對問題。選擇一個方向，複製至您慣用的 ChatGPT／Claude／Gemini，它將依照這一鋪牌為您解讀。免費、免登入。</p>
  <div class="chips" role="radiogroup" aria-label="解讀方向" id="chips"></div>
  <p class="blurb" id="blurb"></p>
  <div class="warn" id="freeWarn">請先在上方「我的問題」欄位寫下您想詢問的事項，才能使用自由提問。</div>
  <div class="btns">
    <button type="button" class="btn-copy" id="copyAll">複製 Prompt＋資料包</button>
    <button type="button" class="btn-copy2" id="copyPack">只複製資料包</button>
  </div>
  <details><summary>預覽將要複製的全文</summary><pre id="preview"></pre></details>
  <div class="links">貼上去：<a href="https://chatgpt.com/" target="_blank" rel="noopener">開 ChatGPT ↗</a><a href="https://claude.ai/new" target="_blank" rel="noopener">開 Claude ↗</a><a href="https://gemini.google.com/app" target="_blank" rel="noopener">開 Gemini ↗</a></div>
  <div class="privacy">資料包及「重開此局」連結含有您的問題與抽牌結果，請僅分享給您信任的人或 AI 服務。</div>
</section>

<!-- ═══ SECTION:CONSULT-BRIDGE ═══ -->
<div style="margin:8px 0 16px;padding:14px 16px;background:rgba(178,62,38,.06);border:1px solid rgba(178,62,38,.18);border-radius:12px;font-size:14px;color:#5A5247;line-height:1.7">
  牌卡聚焦一件事，命盤才能看見整盤人生。若想從一件事看到格局，<a href="/consultation" style="color:#b23e26;font-weight:600">預約八字深度諮詢 →</a>
</div>

<!-- ═══ SECTION:BIANJIE ═══ -->
<section class="card">
  <details>
    <summary>占卜口徑與邊界（供核對）</summary>
    <div style="font-size:13.5px;color:var(--muted);margin-top:8px;line-height:1.9">
      <p style="margin:0 0 6px">・牌組：韋特（Rider–Waite–Smith）系統 78 張：大阿爾克那 22 張＋小阿爾克那 56 張（權杖火、聖杯水、寶劍風、錢幣土）。<br>
      ・逆位口徑：逆位＝該牌能量受阻、內化、延遲或過度，並非簡單「意思相反」；具體解讀由解讀層按問題脈絡判斷。可在抽牌前關閉逆位。<br>
      ・抽牌：線上抽牌採用瀏覽器加密隨機數（crypto.getRandomValues）洗牌，正逆位各半機會；手動錄入以您的實體牌抽出先後與方向為準。<br>
      ・讀法口徑：位置意義為先（每個牌陣位置代表什麼，資料包均會列明），一鋪牌讀成連貫故事，不逐張獨立背誦牌義。<br>
      ・邊界：本工具不出吉凶斷語、不計時間應期；判斷交由您與您信任的解讀者決定。</p>
    </div>
  </details>
</section>

<!-- ═══ SECTION:SEO ═══ -->
<section class="seo">
  <h2>塔羅占卜是什麼</h2>
  <p>塔羅是一套 78 張的圖像系統：22 張大阿爾克那承載人生原型與重大課題，56 張小阿爾克那分四個牌組（權杖對應行動、聖杯對應情感、寶劍對應思維、錢幣對應物質），涵蓋日常處境。占卜時帶著一個問題洗牌抽牌，牌落在牌陣不同位置，每個位置各有其意義：過去、現在、未來、自身、對方、阻礙、建議。本工具提供五種牌陣：單張指引、三張時間線、愛情牌陣、二擇一，以及最完整的凱爾特十字。</p>
  <h2>如何把塔羅牌交給 ChatGPT 解讀？</h2>
  <p>直接告訴 AI「我抽了死神與月亮」，AI 多數會逐張背誦牌義，卻不知您使用了哪種牌陣、各牌所在位置及正逆位，難以讀出完整故事。正確做法是：在此抽牌（或錄入實體牌），複製「Prompt＋資料包」貼至 ChatGPT、Claude 或 Gemini。資料包列明牌陣結構、每個位置的意義、每張牌的正逆位與傳統關鍵詞，Prompt 指明須按位置連讀成故事，不得逐張獨立交代，亦不得恐嚇。</p>
  <h2>塔羅占卜常見誤解</h2>
  <p>第一，見到死神、高塔、惡魔便視為凶牌：死神多數象徵一個階段的結束與蛻變，高塔是假象瓦解，惡魔是看清自身執迷，吉凶須結合位置與問題判斷。第二，將逆位視為「意思相反」：逆位更多是能量受阻、內化或過火，應貼近正位意義解讀。第三，同一問題抽完不滿意立即再抽：塔羅提供一個切面供反思，反覆抽只會令訊息互相干擾，應一事一問，隔一段時間再問。</p>
  <h2>常見問題</h2>
  <div class="faq-item"><h3>Q1　塔羅與雷諾曼有何分別？</h3><p>塔羅著重原型與心理歷程，適合探索「如何面對此事」；雷諾曼著重具體事象與組合連讀，適合詢問日常實事。兩套系統讀法各異，本站兩個工具均備。</p></div>
  <div class="faq-item"><h3>Q2　本人有實體塔羅牌，是否可以使用？</h3><p>可以。選擇「錄入實體抽牌」，按抽出先後逐張點選，再於名單中切換正逆位，工具將按您的結果排陣並生成資料包。</p></div>
  <div class="faq-item"><h3>Q3　凱爾特十字是什麼？</h3><p>凱爾特十字（Celtic Cross）是最經典的十張牌陣：現況、挑戰、根源、過去、目標、未來、自身態度、外在環境、希望與恐懼、可能結果，適合全面審視一件事時使用。</p></div>
  <div class="faq-item"><h3>Q4　一定要使用逆位嗎？</h3><p>不一定。逆位增加細節，同時亦增加複雜度，初學者可於抽牌前關閉「使用逆位」，全部以正位論。</p></div>
  <div class="faq-item"><h3>Q5　將資料包貼給 AI 之後，AI 會否隨意恐嚇？</h3><p>資料包附有使用規則：不得恐嚇、不得斷言生死、牌面反映的是當下能量而非命定，每個判斷須標明牌面依據。若 AI 輸出的牌與資料包不一致，以資料包為準。</p></div>
  <div class="faq-item"><h3>Q6　此工具需要付費嗎？</h3><p>不需要。塔羅占卜與 AI 資料包全部免費，免登入、免安裝。</p></div>
</section>

<footer>
  占卜結果屬自我反思參考，不構成醫療、法律、財務等專業意見；最終決定權在於您自己。<br>
  命運解決師 陳卓賢 · destinysolver.com ｜ <a href="https://destinysolver.com/consultation" style="color:var(--cinnabar)">預約深度諮詢</a><br>
  © 2026 命運解決師 陳卓賢．本頁文案、資料包格式（ds-*-pack）、prompt 設計與介面均為原創作品，受版權保護；歡迎分享連結，未經授權請勿複製轉載。
</footer>
</div>
<div class="toast" id="toast">已複製 ✓ 去 ChatGPT／Claude／Gemini 貼上即可。</div>
`

export default function TarotTool() {
  useEffect(() => {
    ;(window as any).__tarotInit?.()
    return setupToolAnalytics('tarot')
  }, [])
  return (
    <div className="pt-24">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        src="/scripts/tarot-tool.js"
        strategy="afterInteractive"
        onLoad={() => { ;(window as any).__tarotInit?.() }}
      />
    </div>
  )
}
