import { DBConfig } from 'ngx-indexed-db';

export const DB_CONFIG: DBConfig = {
  name: 'Angular19DB',
  version: 2,
  objectStoresMeta: [{
    store: 'tasks',
    storeConfig: {
      keyPath: 'id',
      autoIncrement: true
    },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'status', keypath: 'status', options: { unique: false } }
    ]
  }]
};
