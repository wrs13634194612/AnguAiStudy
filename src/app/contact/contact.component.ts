import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {NgForOf} from '@angular/common';

interface Contact {
  name: string;
  phone: string;
  avatar: string;
}

@Component({
  selector: 'app-contact',
  imports: [
    NgForOf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent  implements OnInit, AfterViewInit {
  contacts: { [key: string]: Contact[] } = {};
  letters: string[] = [];
  currentLetter: string = 'A';
  private letterPositions: { [key: string]: number } = {};
  private touchStartY: number = 0;
  private itemHeight: number = 48; // 默认高度

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;
  @ViewChildren('letterItem') letterItems!: QueryList<ElementRef>;

  mockData: Contact[] = [
    { name: 'Alice', phone: '13800138000', avatar: '👩' },
    { name: 'Bob', phone: '13912345678', avatar: '👨' },
    { name: 'Charlie', phone: '13698765432', avatar: '👨' },
    { name: 'dabing', phone: '13698765432', avatar: '👨' },
    { name: 'gongming', phone: '13698765432', avatar: '👨' },

    { name: 'meiguo', phone: '13800138000', avatar: '👩' },
    { name: 'songguo', phone: '13912345678', avatar: '👨' },
    { name: 'zhaoguo', phone: '13698765432', avatar: '👨' },
    { name: 'iboy', phone: '13800138000', avatar: '👩' },
    { name: 'jack', phone: '13698765432', avatar: '👨' },

    { name: 'kfc', phone: '13912345678', avatar: '👨' },
    { name: 'long', phone: '13912345678', avatar: '👨' },
    { name: 'nan', phone: '13912345678', avatar: '👨' },
    { name: 'oppo', phone: '13698765432', avatar: '👨' },
    { name: 'fuyu', phone: '13800138000', avatar: '👩' },
    { name: 'yelang', phone: '13912345678', avatar: '👨' },
    { name: 'tianqi', phone: '13698765432', avatar: '👨' },
    { name: 'rile', phone: '13698765432', avatar: '👨' },

    { name: 'uyun', phone: '13698765432', avatar: '👨' },
    { name: 'vivo', phone: '13698765432', avatar: '👨' },
    { name: 'wow', phone: '13698765432', avatar: '👨' },


    { name: 'qiming', phone: '13800138000', avatar: '👩' },
    { name: 'eguo', phone: '13912345678', avatar: '👨' },
    { name: 'yingjili', phone: '13698765432', avatar: '👨' },


    { name: 'falanxi', phone: '13698765432', avatar: '👨' },
    { name: 'xibanya', phone: '13800138000', avatar: '👩' },
    { name: 'putaoya', phone: '13912345678', avatar: '👨' },
    { name: 'xiongyali', phone: '13698765432', avatar: '👨' },

    { name: 'saierweiya', phone: '13800138000', avatar: '👩' },
    { name: 'suomali', phone: '13912345678', avatar: '👨' },
    { name: 'aiji', phone: '13698765432', avatar: '👨' },

    { name: 'sudan', phone: '13800138000', avatar: '👩' },
    { name: 'hasake', phone: '13912345678', avatar: '👨' },
    { name: 'yilang', phone: '13698765432', avatar: '👨' },
  ];

  ngOnInit() {
    this.groupContacts();
  }

  ngAfterViewInit(): void {
    this.calculateLetterPositions();
    this.calcItemHeight();
    this.setupScrollListener();
  }

  // 新增滚动监听
  private setupScrollListener() {
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.updateCurrentLetterByScroll();
    });
  }

  // 根据滚动位置更新当前字母
  private updateCurrentLetterByScroll() {
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    const containerHeight = this.scrollContainer.nativeElement.clientHeight;

    // 查找当前可见的第一个完整分组
    const currentGroup = this.letters.find(letter => {
      const position = this.letterPositions[letter];
      return position >= scrollTop && position < scrollTop + containerHeight;
    });

    if (currentGroup && currentGroup !== this.currentLetter) {
      this.currentLetter = currentGroup;
    }
  }

  private groupContacts() {
    this.contacts = this.mockData.reduce((acc, contact) => {
      const initial = contact.name[0].toUpperCase();
      if (!acc[initial]) acc[initial] = [];
      acc[initial].push(contact);
      return acc;
    }, {} as { [key: string]: Contact[] });

    this.letters = Object.keys(this.contacts).sort();
  }

  private calcItemHeight() {
    if (this.letterItems?.first) {
      this.itemHeight = this.letterItems.first.nativeElement.offsetHeight;
    }
  }

  // 优化后的字母位置计算方法
  private calculateLetterPositions() {
    setTimeout(() => {
      let cumulativeHeight = 0;
      this.letters.forEach(letter => {
        const element = document.getElementById(`group-${letter}`);
        if (element) {
          this.letterPositions[letter] = cumulativeHeight;
          cumulativeHeight += element.offsetHeight;
        }
      });
    }, 200); // 增加延迟确保DOM完全渲染
  }


  handleTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.updateCurrentLetter(event);
  }

  handleTouchMove(event: TouchEvent) {
    this.updateCurrentLetter(event);
  }

  handleTouchEnd() {
    // 添加触摸结束处理
    this.updateCurrentLetterByScroll();
  }

  // 优化后的触摸处理
  private updateCurrentLetter(event: TouchEvent) {
    const containerRect = this.scrollContainer.nativeElement.getBoundingClientRect();
    const touchY = event.touches[0].clientY - containerRect.top;
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    const adjustedTouchY = touchY + scrollTop;  // 考虑当前滚动位置

    // 二分查找优化性能
    let low = 0;
    let high = this.letters.length - 1;
    let targetIndex = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midPosition = this.letterPositions[this.letters[mid]];

      if (midPosition < adjustedTouchY) {
        low = mid + 1;
        targetIndex = mid;
      } else {
        high = mid - 1;
      }
    }

    const targetLetter = this.letters[targetIndex];
    if (targetLetter !== this.currentLetter) {
      this.currentLetter = targetLetter;
      this.smoothScrollTo(targetLetter);
    }
  }

  // 优化后的滚动方法
  private smoothScrollTo(letter: string) {
    const position = this.letterPositions[letter];
    if (position !== undefined) {
      requestAnimationFrame(() => {
        this.scrollContainer.nativeElement.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      });
    }
  }

  scrollTo(letter: string) {
    this.currentLetter = letter;
    this.smoothScrollTo(letter);
  }
}
