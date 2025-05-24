import { Component, forwardRef, Input, NgModule } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    }
  ]
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() icon: string = "";
  @Input() iconPassword = "";
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;

  
  isPasswordVisible: boolean = false;
  iconEye: string = 'assets/eye.svg';
  iconEyeOff: string = 'assets/eye-off.svg';
  value: any = '';

  constructor(){}

  // Función que se llama cuando el valor cambia
  onChange: any = (value: any) => {};
  onTouched: any = () => {};

  // Función de escritura para sincronizar el valor con el formulario
  writeValue(value: any): void {
    this.value = value;
  }

  // Registrar la función que se llama cuando el valor cambia
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registrar la función que se llama cuando el input es tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Manejar el cambio de valor en el input
  handleInputChange(value: string) {
      this.value = value;
      this.onChange(this.value);
  }

  setDisabledState(isDisabled: boolean): void {
  this.disabled = isDisabled;
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  enforceTwoDecimals(event: Event) {
  const input = event.target as HTMLInputElement;
  let val = input.value;

  if (/^\d*(\.\d{0,2})?$/.test(val)) {
    this.value = val;
    this.onChange(this.value);
  } else {
    input.value = this.value;
  }
}



}
