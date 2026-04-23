import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipContentResponseDTO } from '@shared/response/dip-details.response.dto';

@Component({
  selector: 'app-dip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dip-details.html',
  styleUrl: './dip-details.css',
})
export class DipDetails {
  @Input() dipInfo: DipContentResponseDTO | null = null;
}
