import { Platform } from 'react-native';

let database: any = null;

// Mock database for web
class WebMockDatabase {
  private todos: any[] = [];
  private nextId: number = 1;
  
  async execAsync(query: string): Promise<any> {
    console.log('Mock DB exec:', query);
    return Promise.resolve();
  }
  
  async getAllAsync(query: string): Promise<any[]> {
    console.log('Mock DB getAll:', query);
    
    if (query.includes('ORDER BY created_at DESC')) {
      return [...this.todos].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    }
    
    return [...this.todos];
  }
  
  async runAsync(query: string, ...params: any[]): Promise<any> {
    console.log('Mock DB run:', query, params);
    
    if (query.includes('INSERT INTO todos') && query.includes('id, text, completed')) {
      const newTodo = {
        id: params[0],
        text: params[1],
        completed: params[2] || 0,
        created_at: new Date().toISOString()
      };
      this.todos.push(newTodo);
      this.nextId = Math.max(this.nextId, params[0] + 1);
    } else if (query.includes('INSERT INTO todos') && query.includes('text, completed')) {
      const newTodo = {
        id: this.nextId++,
        text: params[0],
        completed: params[1] || 0,
        created_at: new Date().toISOString()
      };
      this.todos.push(newTodo);
      return { changes: 1, lastInsertRowId: newTodo.id };
    } else if (query.includes('UPDATE')) {
      const completed = params[0];
      const id = params[1];
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = completed;
      }
    } else if (query.includes('DELETE FROM todos WHERE')) {
      const id = params[0];
      this.todos = this.todos.filter(t => t.id !== id);
    } else if (query.includes('DELETE FROM todos')) {
      this.todos = [];
      this.nextId = 1;
    }
    
    return Promise.resolve({ changes: 1, lastInsertRowId: this.nextId - 1 });
  }
  
  async closeAsync(): Promise<void> {
    return Promise.resolve();
  }
}

export const initDatabase = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      console.warn('⚠️ Web: Using mock database (data lost on refresh)');
      database = new WebMockDatabase();
      return;
    }


    const SQLite = require('expo-sqlite');
    database = await SQLite.openDatabaseAsync('todos.db');

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ SQLite database initialized');
  } catch (error) {
    console.error('❌ Database init error:', error);
    throw error;
  }
};

export const getDatabase = async (): Promise<any> => {
  if (!database) {
    await initDatabase();
  }
  
  if (!database) {
    throw new Error('Database not initialized');
  }

  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.closeAsync();
    database = null;
  }
};