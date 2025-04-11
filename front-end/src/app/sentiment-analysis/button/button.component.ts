import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() class: string = 'submit';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() width: number = 150;
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
