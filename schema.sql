CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, scope TEXT NOT NULL DEFAULT 'private', updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','done')), updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS approvals (id TEXT PRIMARY KEY, description TEXT NOT NULL, category TEXT NOT NULL CHECK(category IN ('prepare_work','external','financial','critical')), status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')), updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY, title TEXT NOT NULL, due_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','done')), updated_at TEXT NOT NULL);

-- XENO 3.1 additive migration: run on existing D1 without dropping existing tables.
CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, goal TEXT NOT NULL DEFAULT '', target_date TEXT, updated_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS project_items (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, due_at TEXT, updated_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_project_items_project ON project_items(project_id);
CREATE TABLE IF NOT EXISTS life_entries (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, category TEXT NOT NULL, occurred_at TEXT NOT NULL, updated_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_life_entries_category ON life_entries(category,updated_at);
CREATE TABLE IF NOT EXISTS routines (id TEXT PRIMARY KEY, name TEXT NOT NULL, schedule TEXT NOT NULL, notes TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, last_completed_at TEXT, updated_at TEXT NOT NULL, created_at TEXT NOT NULL);

-- XENO 3.2 private file library (R2 objects, D1 metadata)
CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, project_id TEXT, created_at TEXT NOT NULL);


-- XENO 3.5 additive project command center migration (run once, safe to repeat)
CREATE TABLE IF NOT EXISTS project_notes (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
 title TEXT NOT NULL, content TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'note',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_project_notes_project ON project_notes(project_id,updated_at);
CREATE TABLE IF NOT EXISTS project_task_tree (
 item_id TEXT PRIMARY KEY REFERENCES project_items(id), parent_item_id TEXT REFERENCES project_items(id),
 priority TEXT NOT NULL DEFAULT 'normal', phase TEXT NOT NULL DEFAULT '',
 CHECK(item_id <> parent_item_id)
);
CREATE TABLE IF NOT EXISTS project_activity (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
 action TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_project_activity_project ON project_activity(project_id,created_at);
CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id);

-- XENO 3.6 additive R&D migration
CREATE TABLE IF NOT EXISTS rd_artifacts (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', revision INTEGER NOT NULL DEFAULT 1, content TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rd_artifacts_project ON rd_artifacts(project_id,updated_at);
CREATE TABLE IF NOT EXISTS rd_revisions (id TEXT PRIMARY KEY, artifact_id TEXT NOT NULL REFERENCES rd_artifacts(id), revision INTEGER NOT NULL, content TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(artifact_id,revision));
CREATE TABLE IF NOT EXISTS rd_sources (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, url TEXT NOT NULL, summary TEXT NOT NULL, quality TEXT NOT NULL DEFAULT 'unverified', created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rd_sources_project ON rd_sources(project_id,created_at);

-- XENO 3.7 additive intelligence and reliability migration
CREATE TABLE IF NOT EXISTS project_memories (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, content TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'fact', confidence TEXT NOT NULL DEFAULT 'unverified', archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_project_memories_scope ON project_memories(project_id,archived,updated_at);
CREATE TABLE IF NOT EXISTS intelligence_audit (id TEXT PRIMARY KEY, project_id TEXT, action TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_intelligence_audit_scope ON intelligence_audit(project_id,created_at);

-- XENO 3.8 additive ecosystem migration
CREATE TABLE IF NOT EXISTS ecosystem_runs (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), request TEXT NOT NULL, specialists TEXT NOT NULL, status TEXT NOT NULL, reports TEXT NOT NULL, synthesis TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_ecosystem_runs_project ON ecosystem_runs(project_id,created_at);
