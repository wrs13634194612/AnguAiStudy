import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
}

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // 生成测试数据
    const users = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `User_${i + 1}`,
      email: `user${i + 1}@demo.com`,
      role: this.getRole(i)
    }));
    this.dataSource = new MatTableDataSource<UserData>(users);
  }

  private getRole(index: number): 'Admin' | 'User' | 'Guest' {
    if (index % 3 === 0) return 'Admin';
    if (index % 2 === 0) return 'User';
    return 'Guest';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
