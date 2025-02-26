// src/app/models/task.model.ts
export interface Task {
  id?: number;  // 将id改为可选属性
  title: string;
  status: 'pending' | 'completed';
}
