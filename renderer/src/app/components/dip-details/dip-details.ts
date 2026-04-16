import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipInfoModel } from '../../models/dip-info';

@Component({
  selector: 'app-dip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dip-details.html',
  styleUrl: './dip-details.css',
})
export class DipDetails {
  @Input() dipInfo: DipInfoModel | null = null;
}
