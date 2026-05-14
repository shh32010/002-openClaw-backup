const { execSync } = require('child_process');
const fs = require('fs');

const sql = `
CREATE TABLE IF NOT EXISTS cmt_article (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  category VARCHAR(50) DEFAULT NULL COMMENT '板块',
  title VARCHAR(200) DEFAULT NULL COMMENT '标题',
  content TEXT DEFAULT NULL COMMENT '内容',
  cover VARCHAR(500) DEFAULT NULL COMMENT '封面',
  location VARCHAR(200) DEFAULT NULL COMMENT '位置',
  comment_num INT DEFAULT 0 COMMENT '评论数',
  create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  create_time DATETIME DEFAULT NULL COMMENT '创建时间',
  update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
  update_time DATETIME DEFAULT NULL COMMENT '更新时间',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区帖子';

CREATE TABLE IF NOT EXISTS cmt_article_comment (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  article_id BIGINT DEFAULT NULL COMMENT '文章ID',
  content TEXT DEFAULT NULL COMMENT '内容',
  good_num BIGINT DEFAULT 0 COMMENT '点赞数',
  parent_id BIGINT DEFAULT 0 COMMENT '父级ID',
  create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  create_time DATETIME DEFAULT NULL COMMENT '创建时间',
  update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
  update_time DATETIME DEFAULT NULL COMMENT '更新时间',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章评论';

CREATE TABLE IF NOT EXISTS cmt_like_log (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  target_id BIGINT DEFAULT NULL COMMENT '目标ID',
  target_type VARCHAR(20) DEFAULT NULL COMMENT '目标类型(article/comment)',
  create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  create_time DATETIME DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞记录';

CREATE TABLE IF NOT EXISTS cmt_adv (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  title VARCHAR(200) DEFAULT NULL COMMENT '标题',
  content TEXT DEFAULT NULL COMMENT '内容',
  cover VARCHAR(500) DEFAULT NULL COMMENT '封面',
  url VARCHAR(500) DEFAULT NULL COMMENT '链接',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status CHAR(1) DEFAULT '0' COMMENT '状态',
  create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  create_time DATETIME DEFAULT NULL COMMENT '创建时间',
  update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
  update_time DATETIME DEFAULT NULL COMMENT '更新时间',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广告管理';
`;

const tmp = process.env.TEMP + '/create_cmt_tables.sql';
fs.writeFileSync(tmp, sql, 'utf8');
try {
  execSync(`mysql --default-character-set=utf8mb4 -u root -p123456 carbon < "${tmp}"`, { stdio: 'pipe' });
  console.log('Tables created successfully');
} catch (e) {
  console.log(e.stderr ? e.stderr.toString() : e.message);
}

// Verify
const r = execSync(`mysql -u root -p123456 carbon -N -e "SHOW TABLES LIKE 'cmt%'"`, { encoding: 'utf8' });
console.log('Tables:', r.trim());
