import { Component } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-settings',
  imports: [Header],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {}
