import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../features/header/header';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
