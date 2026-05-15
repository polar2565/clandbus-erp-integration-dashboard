import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AcumaticaService }
from '../../core/services/acumatica.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output()
  close =
    new EventEmitter<void>();

  @Output()
  loginSuccess =
    new EventEmitter<void>();

  /* ======================================
     ERP LOGIN
  ====================================== */

  erpUsername = '';

  erpPassword = '';

  /*
    Estos valores ya NO los
    ingresa el usuario.
    Se mandan ocultos al backend.
  */

  private erpCompany =
    'Company';

  private erpBranch =
    'PUEBLA';

  isLoading = false;

  loginError = '';

  constructor(
    private acumaticaService: AcumaticaService
  ) {}

  /* ======================================
     LOGIN
  ====================================== */

  connectERP() {

    this.loginError = '';

    if (
      !this.erpUsername.trim()
      ||
      !this.erpPassword.trim()
    ) {

      this.loginError =
        'Ingresa usuario y contraseña';

      return;
    }

    this.isLoading = true;

    const payload = {

      username:
        this.erpUsername,

      password:
        this.erpPassword,

      company:
        this.erpCompany,

      branch:
        this.erpBranch
    };

    this.acumaticaService
      .login(payload)
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.loginSuccess.emit();
        },

        error: (error: any) => {

          console.error(error);

          this.isLoading = false;

          this.loginError =
            'Credenciales inválidas o ERP no disponible';
        }
      });
  }

  /* ======================================
     CLOSE
  ====================================== */

  closeModal() {

    this.close.emit();
  }
}
