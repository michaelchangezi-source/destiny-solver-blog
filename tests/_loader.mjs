// 把 src/lib 的 TS 轉成可直接 import 的 mjs（用 repo 已有的 typescript，零新依賴）
// 產物落 tests/.build/，已列入 .gitignore
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')
const out = resolve(here, '.build')

// 呼叫方自己列要載入的 src/lib 模組名（相依模組要一齊列出）
export async function loadLib(modules = ['bazi-calc', 'bazi-compat']) {
  const MODULES = modules
  mkdirSync(out, { recursive: true })
  for (const name of MODULES) {
    const src = readFileSync(resolve(repo, 'src/lib', `${name}.ts`), 'utf8')
    const js = ts.transpileModule(src, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText
    // 相對 import 補回 .mjs 副檔名
    const fixed = js.replace(/from ['"]\.\/([\w-]+)['"]/g, "from './$1.mjs'")
    writeFileSync(resolve(out, `${name}.mjs`), fixed)
  }
  const mods = {}
  for (const name of MODULES) {
    mods[name] = await import(pathToFileURL(resolve(out, `${name}.mjs`)).href)
  }
  return mods
}
