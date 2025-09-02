#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(full)
    } else if (/\.(tsx?|jsx?)$/.test(e.name)) {
      yield full
    }
  }
}

function toAlias(fromFile, source) {
  if (!source.startsWith('../')) return null
  const abs = path.resolve(path.dirname(fromFile), source)
  if (!abs.startsWith(SRC_ROOT)) return null
  // Do not aliasize imports within the same slice (e.g., entities/todo/*)
  const relFrom = path.relative(SRC_ROOT, fromFile)
  const seg = relFrom.split(path.sep)
  const sliceRoot = path.join(SRC_ROOT, seg[0] || '', seg[1] || '')
  if (abs.startsWith(sliceRoot)) return null
  let relToSrc = path.relative(SRC_ROOT, abs).replace(/\\/g, '/')
  if (!relToSrc) return null
  return `~/${relToSrc}`
}

const importRe = /(import|export)\s+[^'";]*?from\s+['"]([^'\"]+)['"];?/g
const sideEffectImportRe = /^\s*import\s+['"]([^'\"]+)['"];?/gm

function processFile(file) {
  if (
    !file.endsWith('.ts') &&
    !file.endsWith('.tsx') &&
    !file.endsWith('.js') &&
    !file.endsWith('.jsx')
  )
    return 0
  const abs = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
  if (!abs.startsWith(SRC_ROOT)) return 0
  if (!fs.existsSync(abs)) return 0
  const src = fs.readFileSync(abs, 'utf8')
  let out = src
  out = out.replace(importRe, (m, kw, spec) => {
    const alias = toAlias(abs, spec)
    if (!alias) return m
    return m.replace(spec, alias)
  })
  out = out.replace(sideEffectImportRe, (m, spec) => {
    const alias = toAlias(abs, spec)
    if (!alias) return m
    return m.replace(spec, alias)
  })
  if (out !== src) {
    fs.writeFileSync(abs, out, 'utf8')
    console.log(`Updated: ${path.relative(process.cwd(), abs)}`)
    return 1
  }
  return 0
}

const args = process.argv.slice(2)
let changed = 0
if (args.length) {
  for (const f of args) changed += processFile(f)
} else {
  for (const file of walk(SRC_ROOT)) {
    changed += processFile(file)
  }
}

console.log(changed ? `Done. ${changed} file(s) updated.` : 'No changes needed.')
