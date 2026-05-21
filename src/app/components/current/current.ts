import { HttpService } from './../../services/http.service';
import { Component, signal, WritableSignal } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [InputNumberModule],
  templateUrl: './current.html',
  styleUrl: './current.scss',
})
export class Current {
  public readonly currentDate: WritableSignal<string>;

  constructor(private http: HttpService) {
    this.currentDate = signal(
      new Date().toLocaleString('default', { month: 'long' }) 
      + ' ' 
      + new Date().getFullYear(),
    );
  }

  ngOnInit(): void {
    this.http.getLatestRecord().subscribe();
  }

  public submit(): void {
    console.log('submit');
  }
}
