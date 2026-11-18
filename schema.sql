CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, scope TEXT NOT NULL DEFAULT 'private', updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','done')), updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS approvals (id TEXT PRIMARY KEY, description TEXT NOT NULL, category TEXT NOT NULL CHECK(category IN ('prepare_work','external','financial','critical')), status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')), updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY, title TEXT NOT NULL, due_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','done')), updated_at TEXT NOT NULL);
