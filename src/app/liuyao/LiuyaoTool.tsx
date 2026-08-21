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
input[type=text],input[type=datetime-local],textarea{width:100%;border:1px solid var(--border-card);border-radius:10px;padding:10px;font:inherit;font-size:15px;background:#fff;color:var(--foreground)}
textarea{min-height:64px;resize:vertical}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:480px){.row2{grid-template-columns:1fr}}
.btn-main{display:block;width:100%;min-height:48px;border:0;border-radius:999px;background:var(--ember);color:#f7f1e5;font:inherit;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px}
.btn-main:hover{background:var(--ember-deep)}
.btn-ghost{min-height:40px;border:1px solid var(--border-card);border-radius:10px;background:rgba(43,36,28,.05);color:var(--foreground);font:inherit;font-size:14px;cursor:pointer;padding:6px 14px}
.hint{font-size:12.5px;color:var(--muted)}
.mode{display:flex;gap:8px;margin:2px 0 8px}
.mode button{flex:1;min-height:42px;border:1px solid var(--border-card);border-radius:10px;background:rgba(43,36,28,.05);font:inherit;font-size:14.5px;cursor:pointer;color:var(--foreground)}
.mode button.on{background:var(--cinnabar);border-color:var(--cinnabar);color:#fff}
.linerow{display:grid;grid-template-columns:52px 1fr;gap:8px;align-items:center;margin:6px 0}
.linerow .nm{font-size:13.5px;color:var(--muted)}
.seg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.seg button{min-height:40px;border:1px solid var(--border-card);border-radius:9px;background:#fff;font:inherit;font-size:12.5px;line-height:1.35;cursor:pointer;color:var(--foreground);padding:4px 2px}
.seg button.on{background:var(--cinnabar);border-color:var(--cinnabar);color:#fff}
.tossArea{text-align:center;padding:8px 0}
.coins{font-size:26px;letter-spacing:.3em;min-height:40px}
.tossLog{font-size:13px;color:var(--muted);min-height:1.5em}
.hexwrap{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:start}
@media(max-width:560px){.hexwrap{grid-template-columns:1fr}.hexArrow{display:none}}
.hexcol h3{font-size:15px;margin:0 0 8px;text-align:center;color:var(--ink);font-family:var(--font-serif)}
.hexArrow{align-self:center;color:var(--muted);font-size:20px;padding-top:26px}
.yao{display:grid;grid-template-columns:44px 74px 56px 1fr;gap:6px;align-items:center;font-size:13px;padding:3px 0}
.yao .bar{font-family:monospace;font-size:15px;letter-spacing:0;color:var(--ink);white-space:nowrap}
.yao .bar.moving{color:var(--cinnabar)}
.yao .gz{white-space:nowrap}
.yao .tag{font-size:11.5px;color:#8a6d3b}
.yao .sy{display:inline-block;font-size:11px;color:#fff;background:var(--cinnabar);border-radius:6px;padding:0 5px;margin-left:4px}
.yao .sy.ying{background:var(--gold);color:var(--ink)}
.yao2{display:grid;grid-template-columns:44px 1fr;gap:6px;align-items:center;font-size:13px;padding:3px 0}
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
<h1>免費六爻排盤</h1>
<p class="lead">有件事諗嚟諗去都未有答案？靜心搖一卦，一事一問。親手搖卦後錄入結果（或用線上起卦），即時排出本卦變卦、納甲六親、六獸世應同旬空月破，並可一鍵複製 AI 解讀資料包，貼去 ChatGPT／Claude／Gemini 深入分析。</p>

<!-- ═══ SECTION:FORM ═══ -->
<section class="card" id="formCard">
  <h2>起卦</h2>
  <label for="q">所問之事（選填，一事一卦，越具體越好）</label>
  <textarea id="q" maxlength="300" placeholder="例：而家份工做落去，年底前有冇轉機？"></textarea>
  <label>起卦方式</label>
  <div class="mode">
    <button type="button" id="modeManual" class="on">錄入實體搖卦</button>
    <button type="button" id="modeOnline">線上模擬搖卦</button>
  </div>
  <div id="manualArea">
    <p class="hint" style="margin:4px 0 8px">用三枚相同硬幣搖六次，按先後順序記低每次幾多個「背面」（無字嗰面），由初爻（第一次）錄到上爻（第六次）。古法：一背＝少陽、兩背＝少陰、三背＝老陽（動）、三字＝老陰（動）。</p>
    <div id="lineRows"></div>
  </div>
  <div id="onlineArea" style="display:none">
    <p class="hint" style="margin:4px 0 8px">靜心默念所問之事，撳六次「搖卦」。線上起卦用加密隨機數模擬三錢；如你重視親手搖卦嘅儀式感，請用實體硬幣搖完再錄入。</p>
    <div class="tossArea">
      <div class="coins" id="coinShow"></div>
      <button type="button" class="btn-ghost" id="tossBtn" style="min-width:160px">搖卦（第 1 次／共 6 次）</button>
      <button type="button" class="btn-ghost" id="tossReset">重新搖過</button>
      <div class="tossLog" id="tossLog"></div>
    </div>
  </div>
  <div class="row2">
    <div>
      <label for="dt">起卦時刻（以搖完最後一次嗰刻為準，預設當下）</label>
      <input type="datetime-local" id="dt">
    </div>
    <div>
      <label>&nbsp;</label>
      <button type="button" class="btn-ghost" id="nowBtn">用而家呢一刻</button>
    </div>
  </div>
  <button type="button" class="btn-main" id="castBtn">裝卦排盤</button>
  <p class="hint" style="margin:10px 0 0">口徑：京房納甲 · 本卦宮五行定六親 · 日干起六獸 · 月建取節氣月支 · 日辰 23:00 換日 · 香港時間。詳見下方「排盤口徑與邊界」。</p>
</section>

<!-- ═══ SECTION:CHART ═══ -->
<section class="card" id="chartCard" style="display:none">
  <h2>卦象</h2>
  <dl class="kv" id="calInfo" style="margin-bottom:12px"></dl>
  <div class="hexwrap">
    <div class="hexcol"><h3 id="benTitle"></h3><div id="benLines"></div></div>
    <div class="hexArrow" id="hexArrow">→</div>
    <div class="hexcol" id="bianCol"><h3 id="bianTitle"></h3><div id="bianLines"></div></div>
  </div>
  <div id="fushenBox" style="margin-top:10px;font-size:13.5px"></div>
  <p class="hint" style="margin-top:10px">卦圖畀你核對；要畀 AI 分析，請用下面面板複製資料包。動爻以硃紅色標示（○＝陽動、✕＝陰動）。</p>
</section>

<!-- ═══ SECTION:AI-PANEL ═══ -->
<section class="card" id="aiCard" style="display:none" aria-labelledby="ai-title">
  <h2 id="ai-title">交給 AI 解讀</h2>
  <p class="lead" style="margin-bottom:10px">卦排好，下一步係問對問題。揀一個方向，複製去你慣用嘅 ChatGPT／Claude／Gemini，佢就會照呢支卦答你。免費、免登入。</p>
  <div class="chips" role="radiogroup" aria-label="解讀方向" id="chips"></div>
  <p class="blurb" id="blurb"></p>
  <div class="warn" id="freeWarn">請先喺上面「所問之事」寫低你想問乜，先可以用自由提問。</div>
  <div class="btns">
    <button type="button" class="btn-copy" id="copyAll">複製 Prompt＋資料包</button>
    <button type="button" class="btn-copy2" id="copyPack">只複製資料包</button>
  </div>
  <details><summary>預覽將會複製嘅全文</summary><pre id="preview"></pre></details>
  <div class="links">貼上去：<a href="https://chatgpt.com/" target="_blank" rel="noopener">開 ChatGPT ↗</a><a href="https://claude.ai/new" target="_blank" rel="noopener">開 Claude ↗</a><a href="https://gemini.google.com/app" target="_blank" rel="noopener">開 Gemini ↗</a></div>
  <div class="privacy">資料包同「重開此卦」連結含你嘅問事同起卦時刻，請只分享畀你信任嘅人或 AI 服務。</div>
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
      <p style="margin:0 0 6px">・起卦法：古法三錢，一背＝少陽（7）、兩背＝少陰（8）、三背＝老陽（9，動）、三字＝老陰（6，動）。<br>
      ・裝卦：京房納甲；八宮世應以構造法排（首卦世上爻、一至五世逐爻變、遊魂四爻復變、歸魂內卦復原）；六親以本卦宮五行為「我」；六獸以日干起（甲乙青龍、丙丁朱雀、戊勾陳、己螣蛇、庚辛白虎、壬癸玄武）；變爻六親以本卦宮論。<br>
      ・曆法：香港時間（UTC+8）；月建取節氣月支；日辰 23:00 換日（早子時）；旬空按日柱；月破＝月建所沖之支、日沖＝日辰所沖之支（暗動定沖散由解讀層判斷）；節氣時刻以天文算法計算，與天文台公佈誤差一分鐘內。<br>
      ・伏神：六親不全時於本宮首卦尋伏，同六親多爻全列。<br>
      ・邊界：不出卦身、胎養、星煞；不出吉凶斷語。判斷交畀你同你信任嘅解讀者。</p>
    </div>
  </details>
</section>

<!-- ═══ SECTION:SEO ═══ -->
<section class="seo">
  <h2>六爻排盤計算什麼</h2>
  <p>六爻係一套用《易經》六十四卦問事嘅術數：帶住一條清楚嘅問題，三枚硬幣搖六次得出一支卦，之後按京房納甲配干支、六親、六獸同世應，再結合起卦當日嘅月建日辰去讀。工具會排出本卦與變卦（卦名、所屬八宮、世應爻位）、每一爻嘅納甲干支同六親六獸、動爻及其化出、旬空月破日沖標記，以及六親不全時嘅伏神。同八字唔同，六爻唔使出生時間，問嘅係「呢件事而家點、跟住點行」。</p>
  <h2>如何把六爻卦交給 ChatGPT 分析？</h2>
  <p>直接叫 AI「幫我搖一卦」冇意義：佢生成嘅只係文字，唔係你嘅起卦；而口頭描述「一背兩字」畀 AI 裝卦，納甲世應好容易排錯，起卦當日嘅日辰旬空更加係靠估。正確分工係：你親手搖卦，工具負責裝卦排準，然後複製上面嘅「Prompt＋資料包」貼去 ChatGPT、Claude 或 Gemini，AI 只負責解讀一份已經排啱嘅結構化卦象。</p>
  <h2>六爻排盤常見誤解</h2>
  <p>第一，同一件事短時間內反覆搖：六爻重一事一問，心誠則靈，反覆問只會令自己更亂。第二，見到「官鬼」「白虎」就當係壞消息：六親六獸係功能符號，官鬼喺問事業時正正係工作同職位，吉凶要睇用神旺衰同動爻生剋，唔係睇名。第三，忽略旬空月破：爻落旬空或者月破，力量同應期都會唔同，資料包會逐爻標明，等 AI 唔使靠估。</p>
  <h2>常見問題</h2>
  <div class="faq-item"><h3>Q1　六爻要唔要輸入出生時間？</h3><p>唔需要。六爻以起卦時刻同卦象為準，唔使任何出生資料，所問之事先係主角。</p></div>
  <div class="faq-item"><h3>Q2　我未搖過卦，點入手？</h3><p>搵三枚一樣嘅硬幣，心入面諗定件事，兩手冚住啲硬幣搖勻擲落枱，記低有幾多個背面；重複六次，按先後次序由初爻錄到上爻。唔方便用硬幣，可以用「線上模擬搖卦」。</p></div>
  <div class="faq-item"><h3>Q3　乜嘢係世應？</h3><p>世爻代表自己（問事人），應爻代表對方或所問之事嘅另一方。工具按京房八宮構造法自動標出世應位置。</p></div>
  <div class="faq-item"><h3>Q4　乜嘢係伏神？</h3><p>當卦中六親唔齊（例如問財但卦中無財爻），就要去本宮首卦搵返所缺嘅六親，叫做伏神。資料包會列明伏神干支、伏喺邊一爻之下、飛神係乜。</p></div>
  <div class="faq-item"><h3>Q5　資料包貼畀 AI 之後，AI 會唔會亂補嘢？</h3><p>資料包附有使用規則：以資料包為唯一卦面事實、唔准重新裝卦、未列出嘅資料要直接講明。如果 AI 輸出嘅卦面同資料包唔一致，以資料包為準。</p></div>
  <div class="faq-item"><h3>Q6　呢個工具需要付費嗎？</h3><p>唔需要。六爻排盤同 AI 資料包全部免費，免登入免安裝。</p></div>
</section>

<footer>
  本工具只出可核對嘅卦面結構，唔出吉凶斷語；解讀屬命理參考，不構成專業意見。<br>
  命運解決師 陳卓賢 · destinysolver.com ｜ <a href="https://www.destinysolver.com/consultation" style="color:var(--cinnabar)">預約深度諮詢</a><br>
  © 2026 命運解決師 陳卓賢．本頁文案、資料包格式（ds-*-pack）、prompt 設計與介面均為原創作品，受版權保護；歡迎分享連結，未經授權請勿複製轉載。
</footer>
</div>
<div class="toast" id="toast">已複製 ✓ 去 ChatGPT／Claude／Gemini 貼上即可。</div>
`

export default function LiuyaoTool() {
  useEffect(() => {
    ;(window as any).__liuyaoInit?.()
    return setupToolAnalytics('liuyao')
  }, [])
  return (
    <div className="pt-24">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        src="/scripts/liuyao-tool.js"
        strategy="afterInteractive"
        onLoad={() => { ;(window as any).__liuyaoInit?.() }}
      />
    </div>
  )
}
