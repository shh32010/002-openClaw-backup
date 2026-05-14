const fs = require('fs');
const { execSync } = require('child_process');

const lines = fs.readFileSync('E:/26年应用软件系统开发/完整项目/模块二完整项目/sql/carbon.sql', 'utf8').split('\n');

const missing = ['v_wms_in_warehouse_detail', 'v_wms_out_warehouse_detail'];

let allSql = '';
for (const view of missing) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`View structure for ${view}`)) { start = i; break; }
  }
  if (start === -1) { console.log(`? ${view}`); continue; }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].match(/^-- (Table|View) structure/)) { end = i; break; }
  }
  const sql = lines.slice(start, end).filter(l => l.startsWith('DROP') || l.startsWith('CREATE')).join('\n');
  allSql += sql + '\n';
  console.log(`+ ${view}`);
}

const tmp = process.env.TEMP + '/fix_views.sql';
fs.writeFileSync(tmp, allSql, 'utf8');
try {
  execSync(`mysql -u root -p123456 carbon < "${tmp}"`, { stdio: 'pipe' });
  console.log('OK');
} catch (e) {
  console.log(e.stderr ? e.stderr.toString().substring(0, 300) : e.message.substring(0, 300));
}
