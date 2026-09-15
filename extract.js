// Extracts getBezierPath, getSmoothStepPath, and Position from the latest @xyflow/system into
// xyflow-fns.js — a dependency-free script. Test-runs the result before writing; fails if xyflow
// changes break the extraction.
const { writeFile } = require('node:fs/promises')
const { join } = require('node:path')

const base = 'https://cdn.jsdelivr.net/npm/@xyflow/system'
const roots = ['getBezierPath', 'getSmoothStepPath', 'Position']

;(async () => {
  const version = await fetch(`${base}/package.json`).then(r => r.json()).then(p => p.version)
  const src = await fetch(`${base}@${version}/dist/esm/index.js`).then(r => r.ok ? r.text() : Promise.reject(new Error(`${r.status}`)))
  const body = src.replace(/^import .*$/gm, '').replace(/^export .*$/gm, '')
  const names = [...new Set([...body.matchAll(/^(?:function|const|let|var|class) ([\w$]+)/gm)].map(m => m[1]))]
  const top = new Function(`${body}\nreturn { ${names.join(', ')} }`)()

  const source = name => typeof top[name] !== 'function' ? `const ${name} = ${JSON.stringify(top[name])}` : /^(function|class)\b/.test(`${top[name]}`) ? `${top[name]}` : `const ${name} = ${top[name]}`
  const uses = (code, name) => new RegExp(`(?<![\\w$.])${name.replace(/\$/g, '\\$')}(?![\\w$])`).test(code)

  const deps = new Set()
  const visit = name => deps.has(name) || (deps.add(name), names.filter(n => n !== name && uses(source(name), n)).forEach(visit))
  roots.forEach(visit)

  const code = names.filter(n => deps.has(n)).map(source).join('\n\n')
  const out = `// Extracted from @xyflow/system@${version} (MIT) by mattborn/xyflow-fns.\n${code}\n`

  const { getSmoothStepPath } = new Function(`${out}\nreturn { ${roots.join(', ')} }`)()
  if (!getSmoothStepPath({ sourcePosition: 'bottom', sourceX: 0, sourceY: 0, targetPosition: 'left', targetX: -200, targetY: 50 })[0].startsWith('M')) throw new Error('Extracted getSmoothStepPath failed')

  await writeFile(join(__dirname, 'xyflow-fns.js'), out)
  console.log(`xyflow-fns.js ← @xyflow/system@${version}: ${[...deps].join(', ')}`)
})()
