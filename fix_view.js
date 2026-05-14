const fs = require('fs');
const { execSync } = require('child_process');

const lines = fs.readFileSync('E:/26年应用软件系统开发/完整项目/模块二完整项目/sql/carbon.sql', 'utf8').split('\n');
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('View structure for v_scm_purchase_return')) { start = i; break; }
}
let end = lines.length;
for (let i = start + 1; i < lines.length; i++) {
  if (lines[i].match(/^-- (Table|View) structure/)) { end = i; break; }
}
const sql = lines.slice(start, end).filter(l => l.startsWith('DROP') || l.startsWith('CREATE')).join('\n');
const tmp = process.env.TEMP + '/v_scm_purchase_return.sql';
fs.writeFileSync(tmp, sql, 'utf8');
try {
  execSync(`mysql -u root -p123456 carbon < "${tmp}"`, { stdio: 'pipe' });
  console.log('OK');
} catch (e) {
  console.log(e.stderr.toString());
}
const r = execSync('mysql -u root -p123456 carbon -N -e "SHOW TABLES LIKE \'v_scm_purchase_return\'"', { encoding: 'utf8' });
console.log('Result:', r.trim());
