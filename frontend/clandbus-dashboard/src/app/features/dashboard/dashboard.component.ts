import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AcumaticaService }
from '../../core/services/acumatica.service';

import { LoadingOverlayComponent }
from '../../shared/components/loading-overlay/loading-overlay.component';

import { ToastNotificationComponent }
from '../../shared/components/toast-notification/toast-notification.component';

import { LoginComponent }
from '../login/login.component';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    ToastNotificationComponent,
    LoginComponent
  ],

  templateUrl: './dashboard.component.html',

  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  orders: any[] = [];

  filteredOrders: any[] = [];

  availableStatuses: string[] = [];

  ordersLoaded = 0;

  openOrders = 0;

  completedOrders = 0;

  sessionStatus = 'Disconnected';

  lastOperation = '-';

  isLoading = false;

  isSaving = false;

  removingHold = false;

  showEditor = false;

  selectedOrder: any = null;

  editDescription = '';

  searchTerm = '';

  selectedStatus = 'ALL';

  visibleRows = 5;

  toastVisible = false;

  toastMessage = '';

  toastType:
    'success'
    | 'error'
    | 'info'
    = 'info';

  /* ======================================
     ERP LOGIN
  ====================================== */

  showLoginModal = false;

  isLoggedIn = false;

  constructor(
    private acumaticaService: AcumaticaService
  ) {
  }

  /* ======================================
     LOGIN MODAL
  ====================================== */

  openLoginModal() {

    this.showLoginModal = true;
  }

  closeLoginModal() {

    this.showLoginModal = false;
  }

  onLoginSuccess() {

    this.isLoggedIn = true;

    this.showLoginModal = false;

    this.sessionStatus =
      'Connected';

    this.lastOperation =
      'ERP Connected';

    this.showToast(
      'Sesión ERP iniciada correctamente',
      'success'
    );

    this.loadOrders();
  }

  showToast(
    message: string,
    type:
      'success'
      | 'error'
      | 'info'
  ) {

    this.toastMessage = message;

    this.toastType = type;

    this.toastVisible = true;

    setTimeout(() => {

      this.toastVisible = false;

    }, 3200);
  }

  loadOrders() {

    this.isLoading = true;

    this.lastOperation =
      'Conectando con ERP';

    this.acumaticaService
      .getOrders()
      .subscribe({

        next: (response: any) => {

          console.log(
            'ORDERS:',
            response
          );

          this.orders = response;

          this.updateDashboardStats();

          this.applyFilters();

          this.lastOperation =
            'Órdenes cargadas';

          setTimeout(() => {

            this.isLoading = false;

          }, 300);

          this.showToast(
            'Órdenes sincronizadas correctamente',
            'success'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.sessionStatus =
            'Disconnected';

          this.isLoading = false;

          this.showToast(
            'Error al obtener órdenes',
            'error'
          );
        }
      });
  }

  updateDashboardStats() {

    this.ordersLoaded =
      this.orders.length;

    this.openOrders =
      this.orders.filter(
        (x: any) =>
          x.status?.value === 'Open'
      ).length;

    this.completedOrders =
      this.orders.filter(
        (x: any) =>
          x.status?.value === 'Completed'
      ).length;

    const statuses =
      this.orders.map(
        (x: any) =>
          x.status?.value
      );

    this.availableStatuses =
      [...new Set(statuses)];
  }

  applyFilters() {

    let data = [...this.orders];

    if (
      this.searchTerm.trim()
    ) {

      const term =
        this.searchTerm
          .toLowerCase();

      data = data.filter(
        (order: any) =>
          order.orderNbr?.value
            ?.toLowerCase()
            ?.includes(term)

          ||

          order.customerID?.value
            ?.toLowerCase()
            ?.includes(term)

          ||

          order.description?.value
            ?.toLowerCase()
            ?.includes(term)
      );
    }

    if (
      this.selectedStatus !== 'ALL'
    ) {

      data = data.filter(
        (order: any) =>
          order.status?.value ===
          this.selectedStatus
      );
    }

    if (
      this.visibleRows !== -1
    ) {

      data = data.slice(
        0,
        this.visibleRows
      );
    }

    this.filteredOrders = data;
  }

  changeVisibleRows(
    rows: number
  ) {

    this.visibleRows =
      Number(rows);

    this.applyFilters();
  }

  openEditor(order: any) {

    this.selectedOrder = order;

    this.editDescription =
      order.description?.value || '';

    this.showEditor = true;
  }

  closeEditor() {

    this.showEditor = false;

    this.selectedOrder = null;
  }

  saveOrder() {

    if (!this.selectedOrder) {
      return;
    }

    this.isSaving = true;

    const payload = {

      orderNbr:
        this.selectedOrder
          .orderNbr?.value,

      description:
        this.editDescription
    };

    this.acumaticaService
      .updateOrder(payload)
      .subscribe({

        next: () => {

          this.selectedOrder
            .description.value =
              this.editDescription;

          this.showToast(
            'Orden actualizada correctamente',
            'success'
          );

          this.closeEditor();

          this.isSaving = false;
        },

        error: (error: any) => {

          console.error(error);

          this.isSaving = false;

          this.showToast(
            'Error al actualizar orden',
            'error'
          );
        }
      });
  }

  removeHold(order: any) {

    this.removingHold = true;

    const payload = {

      orderNbr:
        order.orderNbr?.value
    };

    this.acumaticaService
      .removeHold(payload)
      .subscribe({

        next: () => {

          order.status.value =
            'Open';

          this.updateDashboardStats();

          this.applyFilters();

          this.removingHold = false;

          this.showToast(
            'Hold removido correctamente',
            'success'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.removingHold = false;

          this.showToast(
            'Error al remover hold',
            'error'
          );
        }
      });
  }

  logout() {

    this.isLoading = true;

    this.acumaticaService
      .logout()
      .subscribe({

        next: () => {

          this.isLoggedIn = false;

          this.sessionStatus =
            'Disconnected';

          this.orders = [];

          this.filteredOrders = [];

          this.ordersLoaded = 0;

          this.openOrders = 0;

          this.completedOrders = 0;

          this.isLoading = false;

          this.showToast(
            'Sesión cerrada correctamente',
            'success'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.isLoading = false;

          this.showToast(
            'Error al cerrar sesión',
            'error'
          );
        }
      });
  }
}
