import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentsComponent } from './features/documents/documents.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DocumentsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}