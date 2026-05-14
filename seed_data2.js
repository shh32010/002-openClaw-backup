const { execSync } = require('child_process');
const fs = require('fs');

function runSql(sql) {
  const tmp = process.env.TEMP + '/seed.sql';
  // Write with latin1 encoding to match MySQL connection
  fs.writeFileSync(tmp, sql, 'utf8');
  try {
    execSync(`mysql --default-character-set=utf8mb4 -u root -p123456 carbon < "${tmp}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.log(e.stderr ? e.stderr.toString().substring(0, 300) : e.message);
    return false;
  }
}

let sql = '';

const months = [
  '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'
];

const planAmounts = [500, 600, 550, 700, 650, 800, 750, 600, 500, 700, 850, 900];
const contractAmounts = [400, 550, 480, 650, 600, 700, 680, 500, 450, 600, 750, 800];

let planId = 100;
for (let i = 0; i < months.length; i++) {
  const m = months[i];
  const [y, mo] = m.split('-');
  const startDate = `${m}-01`;
  const lastDay = new Date(parseInt(y), parseInt(mo), 0).getDate();
  const endDate = `${m}-${String(lastDay).padStart(2, '0')}`;
  
  planId++;
  sql += `INSERT INTO scm_sale_plan (id, plan_no, title, type, start_date, end_date, create_by, create_time) VALUES (${planId}, 'XSJH${y}${mo}001', '${y}-${mo} Plan', '3', '${startDate}', '${endDate}', '1', NOW());\n`;
  sql += `INSERT INTO scm_sale_plan_detail (plan_id, material_id, sale_amount) VALUES (${planId}, 1, ${planAmounts[i] * 10000});\n`;
}

let contractId = 100;
for (let i = 0; i < months.length; i++) {
  const m = months[i];
  const signDate = `${m}-15`;
  
  contractId++;
  sql += `INSERT INTO scm_sale_contract (id, contract_no, customer_id, contract_amount, sign_date, audit_status, apply_time) VALUES (${contractId}, 'HT${m.replace('-','')}001', 1, ${contractAmounts[i] * 10000}, '${signDate}', '1', '${signDate}');\n`;
}

const ok = runSql(sql);
if (ok) {
  console.log(`Inserted ${months.length} plans + ${months.length} contracts`);
  
  // Verify
  const r = execSync(`mysql -u root -p123456 carbon -N -e "SELECT COUNT(*) FROM scm_sale_plan WHERE type='3' AND start_date >= '2025-06-01'"`, { encoding: 'utf8' });
  console.log(`Plans in range: ${r.trim()}`);
}
