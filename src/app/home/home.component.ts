import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {NgForOf, SlicePipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';

// 定义列表项的数据结构
interface ListItem {
  id: number;
  title: string;
  description: string;
  avatarUrl: string;
}


@Component({
  selector: 'app-home',
  imports: [MatListModule, NgForOf, MatPaginator, SlicePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  // 列表项数据数组
  listItems: ListItem[] = [
    {
      id: 1,
      title: 'Item 1',
      description: 'Item 1 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      title: 'Item 2',
      description: 'Item 2 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 3,
      title: 'Item 3',
      description: 'Item 3 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      title: 'Item 4',
      description: 'Item 4 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    {
      id: 5,
      title: 'Item 5',
      description: 'Item 5 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
      id: 6,
      title: 'Item 6',
      description: 'Item 6 description goes here',
      avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg'
    }
  ];

  // 分页相关变量
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 2; // 每页显示的条数
  currentPage = 0; // 当前页码

  constructor() { }

  // 处理点击事件
  handleClick(event: Event, itemId: number): void {
    console.log(`Clicked on item ${itemId}`);
    // 在这里可以添加其他逻辑，比如导航到详情页面
  }

  ngAfterViewInit(): void {
    // 将数据源连接到分页器
    this.paginator.length = this.listItems.length;
    this.paginator.pageSize = this.pageSize;
  }

  // 处理分页事件
  handlePageEvent(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    console.log(`Page size: ${this.pageSize}, Page index: ${this.currentPage}`);
  }
}

