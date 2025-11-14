// This is a placeholder implementation for the database module.
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export interface Task {
	id: number;
	title: string | null;
	priority: string | null;
	status: string | null;
	progress: number | null;
}

// Ensure a data directory exists next to the project root
const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
	fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'tasks.db');

// Open a synchronous connection (better-sqlite3 is synchronous by design)
const db = new Database(DB_PATH);

// Use WAL for better concurrency and set some pragmas for sane defaults
try {
	db.pragma('journal_mode = WAL');
	db.pragma('synchronous = NORMAL');
} catch (err) {
	// If pragmas fail, continue — not fatal for this basic implementation
	console.warn('Failed to set pragmas for sqlite:', err);
}

// Create tasks table if it doesn't exist
db.prepare(
	`CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		priority TEXT,
		status TEXT,
		progress INTEGER
	)`
).run();

// Seed the database with default tasks if the table is empty
const seedDatabase = () => {
	const count = (db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number }).count;
	
	if (count === 0) {
		const defaultTasks = [
			{ title: 'Go to gym', priority: 'high', status: 'To Do', progress: 0 },
			{ title: 'Read a book', priority: 'low', status: 'Done', progress: 100 },
			{ title: 'Go to market', priority: 'medium', status: 'In Progress', progress: 50 },
			{ title: 'Restart Learning Solidworks', priority: 'high', status: 'To Do', progress: 0 },
			{ title: 'change slider to scroll', priority: 'high', status: 'Done', progress: 100 },
			{ title: 'To publish the article', priority: 'medium', status: 'In Progress', progress: 50 },
		];
		
		const insertStmt = db.prepare(
			`INSERT INTO tasks (title, priority, status, progress)
			 VALUES (@title, @priority, @status, @progress)`
		);
		
		for (const task of defaultTasks) {
			insertStmt.run(task);
		}
		
		console.log(`✓ Seeded database with ${defaultTasks.length} default tasks`);
	}
};

seedDatabase();

export const listTasks = (): Task[] => {
	const rows = db.prepare('SELECT id, title, priority, status, progress FROM tasks').all();
	return rows as Task[];
};

export const getTask = (id: number): Task | null => {
	const row = db.prepare('SELECT id, title, priority, status, progress FROM tasks WHERE id = ?').get(id);
	return (row as Task) || null;
};

export const upsertTask = (task: Omit<Task, 'id'> | Task): Task => {
	if ('id' in task && task.id) {
		// Update existing task
		const stmt = db.prepare(
			`UPDATE tasks SET title = @title, priority = @priority, status = @status, progress = @progress WHERE id = @id`
		);
		stmt.run(task);
		return getTask((task as Task).id)!;
	} else {
		// Insert new task (let id auto-increment)
		const stmt = db.prepare(
			`INSERT INTO tasks (title, priority, status, progress)
			 VALUES (@title, @priority, @status, @progress)`
		);
		const result = stmt.run(task);
		return getTask(result.lastInsertRowid as number)!;
	}
};

export const deleteTask = (id: number): boolean => {
	const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
	return result.changes > 0;
};

export const close = (): void => {
	try {
		db.close();
	} catch (err) {
		console.warn('Error closing database:', err);
	}
};

// Export the raw db for low-level access if needed
export { db };

// Minimal default export for convenience
export default {
	listTasks,
	getTask,
	upsertTask,
	deleteTask,
	close,
};
