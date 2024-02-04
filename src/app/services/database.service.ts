import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: any = SQLiteObject;

  constructor(private sqlite: SQLite) { }

  async createDatabase() {
    try {
      this.database = await this.sqlite.create({
        name: 'mynewdatabase.db',
        location: 'default'
      });
      await this.createTable();
    } catch (error) {
      console.error('Error opening database', error);
    }
  }

  private createTable() {
    const query = 'CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT)';
    return this.database.executeSql(query, []);
  }

  async getItems() {
    const query = 'SELECT * FROM records';
    const result = await this.database.executeSql(query, []);
    const items = [];
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }
    return items;
  }

  async addItem(name: string, url: string) {
    const query = 'INSERT INTO records (name,url) VALUES (?,?)';
    return this.database.executeSql(query, [name, url]);
  }

  async deleteItem(id: any) {
    const query = 'DELETE FROM records WHERE id = ?';
    return this.database.executeSql(query, [id]);
  }
}