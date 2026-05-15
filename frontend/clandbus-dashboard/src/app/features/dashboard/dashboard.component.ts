import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AcumaticaService }
from '../../core/services/acumatica.service';

import { LoadingOverlayComponent }
from '../../shared/components/loading-overlay/loading-overlay.component';

import { ToastNotificationComponent }
from '../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingOverlayComponent,
    ToastNotificationComponent
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

  sessionStatus = 'Offline';

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

  constructor(
    private acumaticaService: AcumaticaService
  ) {
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

          this.sessionStatus =
            'Online';

          this.lastOperation =
            'Órdenes cargadas';

          this.applyFilters();

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
            'Offline';

          this.lastOperation =
            'Error API';

          this.isLoading = false;

          this.showToast(
            'No fue posible conectar con Acumatica ERP',
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
        (o: any) =>
          o.status?.value === 'Open'
      ).length;

    this.completedOrders =
      this.orders.filter(
        (o: any) =>
          o.status?.value === 'Completed'
      ).length;

    const statuses: string[] =
      this.orders
        .map(
          (o: any) =>
            o.status?.value
        )
        .filter(
          (status: any) =>
            !!status
        );

    this.availableStatuses =
      Array.from(
        new Set(statuses)
      );
  }

  applyFilters() {

    let data = [...this.orders];

    if (this.searchTerm.trim()) {

      const search =
        this.searchTerm
          .toLowerCase();

      data = data.filter(order =>

        order.orderNbr?.value
          ?.toLowerCase()
          .includes(search)

        ||

        order.customerID?.value
          ?.toLowerCase()
          .includes(search)

        ||

        order.description?.value
          ?.toLowerCase()
          .includes(search)

        ||

        order.status?.value
          ?.toLowerCase()
          .includes(search)
      );
    }

    if (
      this.selectedStatus !== 'ALL'
    ) {

      data = data.filter(order =>

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

    this.visibleRows = rows;

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

    this.editDescription = '';
  }

  saveOrder() {

    if (!this.selectedOrder) {

      this.showToast(
        'No hay orden seleccionada',
        'error'
      );

      return;
    }

    this.isSaving = true;

    this.isLoading = true;

    this.lastOperation =
      'Actualizando orden';

    const payload = {

      orderType:
        this.selectedOrder
          .orderType?.value,

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

          this.isSaving = false;

          this.isLoading = false;

          this.lastOperation =
            'Orden actualizada';

          /* ======================================
             UPDATE LOCAL REAL TIME
          ====================================== */

          this.selectedOrder.description.value =
            this.editDescription;

          this.applyFilters();

          this.closeEditor();

          this.showToast(
            'Orden actualizada correctamente',
            'success'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.isSaving = false;

          this.isLoading = false;

          this.showToast(
            'No fue posible actualizar la orden',
            'error'
          );
        }
      });
  }

  removeHold(order: any) {

    if (
      order.status?.value !==
      'On Hold'
    ) {

      this.showToast(
        'La orden no está en estado On Hold',
        'info'
      );

      return;
    }

    this.removingHold = true;

    this.isLoading = true;

    this.lastOperation =
      'Ejecutando Remove Hold';

    const payload = {

      orderType:
        order.orderType?.value,

      orderNbr:
        order.orderNbr?.value
    };

    this.acumaticaService
      .removeHold(payload)
      .subscribe({

        next: () => {

          this.removingHold = false;

          this.isLoading = false;

          this.lastOperation =
            'Remove Hold ejecutado';

          /* ======================================
             UPDATE LOCAL REAL TIME
          ====================================== */

          order.status.value =
            'Open';

          this.updateDashboardStats();

          this.applyFilters();

          this.showToast(
            'La orden cambió a estado Open',
            'success'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.removingHold = false;

          this.isLoading = false;

          this.showToast(
            'No fue posible ejecutar Remove Hold',
            'error'
          );
        }
      });
  }

  logout() {

    this.isLoading = true;

    this.lastOperation =
      'Cerrando sesión';

    this.acumaticaService
      .logout()
      .subscribe({

        next: () => {

          this.sessionStatus =
            'Offline';

          this.lastOperation =
            'Logout';

          this.orders = [];

          this.filteredOrders = [];

          this.ordersLoaded = 0;

          this.openOrders = 0;

          this.completedOrders = 0;

          this.availableStatuses = [];

          setTimeout(() => {

            this.isLoading = false;

          }, 250);

          this.showToast(
            'Sesión cerrada correctamente',
            'info'
          );
        },

        error: (error: any) => {

          console.error(error);

          this.isLoading = false;

          this.showToast(
            'No fue posible cerrar sesión',
            'error'
          );
        }
      });
  }
}
