import { Component, signal, WritableSignal } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { Header } from '../header/header';

@Component({
  selector: 'app-current',
  imports: [InputNumberModule, Header],
  templateUrl: './current.html',
  styleUrl: './current.scss',
})
export class Current {
  public readonly currentDate: WritableSignal<string>;

  constructor() {
    this.currentDate = signal(
      new Date().toLocaleString('default', { month: 'long' }) 
      + ' ' 
      + new Date().getFullYear(),
    );
  }

  public submit(): void {
    console.log('submit');
  }
}
