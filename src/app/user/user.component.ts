import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  todos: Todo[] = [];
  dialogData: Todo = {task: '', description: ''};

  getClick(name: string) {
    console.log('you click this button')
    console.log(name)
    names = name
  }

  getLoginClick(name: string) {
    console.log(this.dialogData.task, this.dialogData.description)
  }

  animal() {
    return names
  }

  protected readonly names = names;

  ngOnInit(): void {
  }
}

var names = ''

interface Todo {
  task: string;
  description: string;
}

