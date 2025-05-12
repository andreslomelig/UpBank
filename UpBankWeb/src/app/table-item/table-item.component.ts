import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-item',
  imports: [CommonModule],
  templateUrl: './table-item.component.html',
  styleUrl: './table-item.component.scss'
})
export class TableItemComponent {
  @Input() data: any[] = []
}
