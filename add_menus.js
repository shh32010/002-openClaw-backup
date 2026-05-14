const { execSync } = require('child_process');
const fs = require('fs');

function runSql(sql) {
  const tmp = process.env.TEMP + '/menu.sql';
  fs.writeFileSync(tmp, sql, 'utf8');
  try {
    execSync(`mysql --default-character-set=utf8mb4 -u root -p123456 carbon < "${tmp}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.log(e.stderr ? e.stderr.toString().substring(0, 200) : e.message);
    return false;
  }
}

// Insert parent menu
runSql(`INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time) VALUES ('member_service', 0, 10, 'member', NULL, 'M', '0', '0', '', 'shopping', 'admin', NOW());`);

const parentId = execSync(`mysql -u root -p123456 carbon -N -e "SELECT menu_id FROM sys_menu WHERE path='member' AND parent_id=0"`, { encoding: 'utf8' }).trim();
console.log('Parent ID:', parentId);

// Insert child menus
runSql(`INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time) VALUES
('member_list', ${parentId}, 1, 'list', 'member/list', 'C', '0', '0', '', 'list', 'admin', NOW()),
('member_recharge', ${parentId}, 2, 'recharge', 'member/recharge', 'C', '0', '0', '', 'money', 'admin', NOW()),
('member_compare', ${parentId}, 3, 'product-equity-comparison', 'member/product-equity-comparison', 'C', '0', '0', '', 'chart', 'admin', NOW());`);

// Also add community menu entries for community post/detail/publish
const communityParentId = execSync(`mysql -u root -p123456 carbon -N -e "SELECT menu_id FROM sys_menu WHERE path='article' AND parent_id=2798"`, { encoding: 'utf8' }).trim();
console.log('Community Parent ID:', communityParentId);

// Verify
const r = execSync(`mysql -u root -p123456 carbon -e "SELECT menu_id, menu_name, path, component, parent_id FROM sys_menu WHERE menu_name LIKE '%member%' OR (parent_id=${parentId})"`, { encoding: 'utf8' });
console.log(r);
