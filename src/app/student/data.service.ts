import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db!: IDBDatabase;
  private readonly dbName = 'AngularDB';
  private readonly storeName = 'tasks';

  // 添加数据库准备状态追踪
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          const store = this.db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('title', 'title', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  // 所有方法添加等待初始化
  async getAllTasks(): Promise<Task[]> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addTask(task: Omit<Task, 'id'>): Promise<number> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(task);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(task: Task): Promise<void> {
    await this.dbReady;
    if (task.id === undefined) {
      throw new Error('Cannot update task without ID');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(task);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
