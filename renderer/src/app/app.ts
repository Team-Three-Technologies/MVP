import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private api = (window as any).electronAPI;
  message: string = 'prova';

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) { }

  async test(): Promise<string> {
    const res = await this.api.dip.autoImport();
    if (res.error) throw new Error(res.error);
    return res.data.dipUuid;
  }

  async ngOnInit() {
    try {
      this.message = await this.test();
    } catch (e) {
      this.message = (e as Error).message;
    } finally {
      this.cdr.detectChanges();
    }
  }
}