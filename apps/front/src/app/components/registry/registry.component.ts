import { formatDate } from "@angular/common";
import { Component, OnInit, Self } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IUser } from "@thesis/api-interfaces";
import {
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModelUpdatedEvent
} from "ag-grid-community";
import { catchError, Observable, throwError } from "rxjs";
import { AG_GRID_LOCALE_UA } from "../../shared/i18n/ag-grid";
import { RegistryService } from "../registry/registry.service";
import { AddUserDialogComponent } from "./add-user-dialog/add-user-dialog.component";

const dateCellRenderer = ({ value }: { value: Date }) => formatDate(value, "MM/dd/y", "en");

const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const cellValueDate = new Date(cellValue);
    if (filterLocalDateAtMidnight.getTime() === cellValueDate.getTime()) {
      return 0;
    }
    if (cellValueDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellValueDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
  browserDatePicker: true
};

@Component({
  selector: "thesis-registry",
  templateUrl: "./registry.component.html",
  styleUrls: ["./registry.component.scss"],
  providers: [RegistryService]
})
export class RegistryComponent implements OnInit {
  public readonly colsDef: (ColDef | ColGroupDef)[] = RegistryComponent.getCellsDef();
  public readonly gridOptions: GridOptions = RegistryComponent.getGridOptions();

  public rowData$?: Observable<IUser[]> | null = null;
  private gridAPI!: GridApi;

  constructor(
    @Self() private readonly registryService: RegistryService,
    private readonly matDialog: MatDialog
  ) {

  }

  get isRowsSelected(): boolean {
    return !!this.gridAPI?.getSelectedRows().length;
  }

  private static getCellsDef(): (ColDef | ColGroupDef)[] {
    return [
      {
        headerName: "ID",
        field: "id",
        minWidth: 220,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        suppressMenu: true
      },
      {
        headerName: "Клієнт",
        children: [
          {
            headerName: "Ім'я",
            field: "first_name",
            minWidth: 100,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true
          },
          {
            headerName: "Прізвище",
            field: "last_name",
            minWidth: 100,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true
          },
          {
            headerName: "По-батькові",
            field: "middle_name",
            minWidth: 100,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true
          },
          {
            headerName: "Дата народження",
            field: "birthday",
            minWidth: 120,
            sortable: true,
            filter: "agDateColumnFilter",
            filterParams: dateFilterParams,
            floatingFilter: true,
            suppressMenu: true,
            cellRenderer: dateCellRenderer,
            columnGroupShow: "open"
          },
          {
            headerName: "Номер телефону",
            field: "phone",
            minWidth: 100,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true,
            columnGroupShow: "open"
          },
          {
            headerName: "Адреса реєстрації",
            field: "address",
            minWidth: 500,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true,
            columnGroupShow: "open"
          }
        ]
      },
      {
        headerName: "Банківська інформація",
        children: [
          {
            headerName: "ІПН",
            field: "tax_id",
            minWidth: 60,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true
          },
          {
            headerName: "Номер паспорту",
            field: "passport",
            minWidth: 60,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            suppressMenu: true,
            editable: true
          }
        ]
      },
      {
        headerName: "Системна информація",
        children: [
          {
            headerName: "Створено",
            field: "createdAt",
            minWidth: 120,
            sortable: true,
            filter: "agDateColumnFilter",
            filterParams: dateFilterParams,
            floatingFilter: true,
            suppressMenu: true,
            cellRenderer: dateCellRenderer
          },
          {
            headerName: "Оновлено",
            field: "updatedAt",
            minWidth: 120,
            sortable: true,
            filter: "agDateColumnFilter",
            filterParams: dateFilterParams,
            floatingFilter: true,
            suppressMenu: true,
            cellRenderer: dateCellRenderer
          }
        ]
      }
    ];
  }

  private static getGridOptions(): GridOptions {
    return {
      pagination: true,
      paginationPageSize: 20,
      animateRows: true,
      defaultColDef: {
        suppressMenu: true,
        resizable: true,
        sortable: false,
        filter: false,
        floatingFilterComponentParams: {
          suppressFilterButton: true
        }
      },
      rowSelection: "multiple",
      localeText: AG_GRID_LOCALE_UA
    };
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridAPI = event.api;

    // Sets columns to adjust in size to fit the grid horizontally
    // Or more than available but with horizontal scrolling.
    event.api.sizeColumnsToFit();
  }

  onModelUpdated(event: ModelUpdatedEvent): void {
    if (event.api.getDisplayedRowCount() == 0) {
      event.api.showNoRowsOverlay();
    }

    if (event.api.getDisplayedRowCount() > 0) {
      event.api.hideOverlay();
    }
  }

  onDeleteUsersClick(): void {
    const ids = (this.gridAPI.getSelectedRows() as IUser[]).map((user) => user.id);
    this.registryService.deleteById(ids).subscribe((users) => {
      this.gridAPI.setRowData(users);
    });
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const { id, first_name, last_name, middle_name, phone, passport, address } = event.data as IUser;
    this.registryService.updateById(id, { first_name, last_name, middle_name, phone, passport, address })
      .pipe(catchError((err) => {
        event.api.undoCellEditing();
        return throwError(err);
      }))
      .subscribe();
  }

  onAddUserClick(): void {
    this.matDialog.open(AddUserDialogComponent).afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.fetchUsers();
      }
    });
  }

  private fetchUsers(): void {
    this.registryService.getAllUsers().subscribe((users) => {
      this.gridAPI.setRowData(users);
    });
  }
}
