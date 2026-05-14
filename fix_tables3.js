const fs = require('fs');
const { execSync } = require('child_process');

const sqlFile = 'E:/26年应用软件系统开发/完整项目/模块二完整项目/sql/carbon.sql';
const lines = fs.readFileSync(sqlFile, 'utf8').split('\n');

const missing = [
  'bid_policylaw', 'bid_policylaw_files', 'chat_message_history', 'chat_qa',
  'distribusion_credit', 'distribusion_emission_cal', 'distribusion_enterprise_info',
  'distribusion_history', 'distribusion_message', 'distribusion_method',
  'distribusion_product', 'distribusion_total_emission',
  'mes_check_standard', 'mes_material_check', 'mes_material_requisition',
  'mes_process_check', 'mes_product_finish', 'wms_in_warehouse_apply', 'v_scm_purchase_return'
];

let allSql = '';

for (const table of missing) {
  // Find the line with table structure
  let startLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`-- Table structure for ${table}`) || 
        lines[i].includes(`-- View structure for ${table}`)) {
      startLine = i;
      break;
    }
  }
  
  if (startLine === -1) {
    console.log(`? ${table} (not found)`);
    continue;
  }
  
  // Find end - next table/view structure or dumping data
  let endLine = lines.length;
  for (let i = startLine + 1; i < lines.length; i++) {
    if (lines[i].match(/^-- (Table|View) structure for/) || lines[i].match(/^-- Dumping data/)) {
      endLine = i;
      break;
    }
  }
  
  // Get the block, take only up to the closing ");" of CREATE TABLE
  const block = lines.slice(startLine, endLine);
  let sql = '';
  let inCreate = false;
  let parenDepth = 0;
  
  for (const line of block) {
    if (line.startsWith('DROP')) { sql += line + '\n'; continue; }
    if (line.startsWith('CREATE')) { 
      sql += line + '\n'; 
      inCreate = true;
      parenDepth = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      continue; 
    }
    if (inCreate) {
      sql += line + '\n';
      parenDepth += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      if (parenDepth <= 0 || line.includes(');')) {
        inCreate = false;
        break;
      }
    }
  }
  
  allSql += sql + '\n';
  console.log(`+ ${table}`);
}

const tempFile = process.env.TEMP + '/create_tables_v3.sql';
fs.writeFileSync(tempFile, allSql, 'utf8');

try {
  execSync(`mysql -u root -p123456 carbon < "${tempFile}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('Success!');
} catch (e) {
  console.log('Error:', (e.stderr || e.message).substring(0, 300));
}

// Verify
const check = execSync(`mysql -u root -p123456 carbon -N -e "SHOW TABLES;"`, { encoding: 'utf8' });
const existing = new Set(check.trim().split('\n').map(s => s.trim()));
const stillMissing = missing.filter(t => !existing.has(t));
console.log(`\nStill missing: ${stillMissing.length}`);
if (stillMissing.length) console.log(stillMissing);
