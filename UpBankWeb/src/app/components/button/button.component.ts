import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'primary';

  @Input() icon: string = '';
  @Input() color: string = 'blue'
  @Input() status: string = 'inactive'

  @Output() action = new EventEmitter();

  emitAction() {
    this.action.emit();
  }
}
