const fs = require('fs');
const { execSync } = require('child_process');

const sqlFile = 'E:/26年应用软件系统开发/完整项目/模块二完整项目/sql/carbon.sql';
const lines = fs.readFileSync(sqlFile, 'utf8').split('\n');

const missing = [
  'bid_policylaw', 'bid_policylaw_files', 'chat_message_history', 'chat_qa',
  'cmt_adv', 'cmt_article', 'cmt_article_comment', 'cmt_like_log',
  'com_area', 'com_city', 'demo_user', 'distribusion_credit',
  'distribusion_emission_cal', 'distribusion_enterprise_info',
  'distribusion_history', 'distribusion_message', 'distribusion_method',
  'distribusion_product', 'distribusion_total_emission',
  'mes_check_standard', 'mes_material_check', 'mes_material_requisition',
  'mes_process_check', 'mes_product_finish', 'my_wms_in_warehouse_apply',
  'v_scm_purchase_return', 'wms_in_warehouse_apply'
];

let allSql = '';

for (const table of missing) {
  const pattern = `-- Table structure for ${table}`;
  let startLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) { startLine = i; break; }
  }
  
  if (startLine === -1) {
    console.log(`? ${table} (not found)`);
    continue;
  }
  
  let endLine = lines.length;
  for (let i = startLine + 1; i < lines.length; i++) {
    if (lines[i].includes('-- Table structure for') || lines[i].includes('-- View structure for')) {
      endLine = i;
      break;
    }
  }
  
  const block = lines.slice(startLine, endLine).join('\n');
  allSql += block + '\n';
  console.log(`+ ${table}`);
}

const tempFile = process.env.TEMP + '/create_all_tables.sql';
fs.writeFileSync(tempFile, allSql, 'utf8');
console.log(`\nWrote ${tempFile}`);

try {
  const result = execSync(`mysql -u root -p123456 carbon < "${tempFile}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('Success!');
} catch (e) {
  console.log('Errors:', e.stderr || e.message);
}

// Verify
const check = execSync(`mysql -u root -p123456 carbon -N -e "SHOW TABLES;"`, { encoding: 'utf8' });
const existing = new Set(check.trim().split('\n').map(s => s.trim()));
const stillMissing = missing.filter(t => !existing.has(t));
console.log(`\nStill missing: ${stillMissing.length}`);
if (stillMissing.length) console.log(stillMissing);
