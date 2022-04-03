import { Component, Self } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { NAME_REGEXP, PASSPORT_REGEXP, PHONE_REGEXP, TAX_ID_REGEXP } from "@thesis/api-interfaces";
import { RegistryService } from "apps/front/src/app/components/registry/registry.service";

@Component({
  selector: "thesis-registry-add-user-dialog",
  templateUrl: "./add-user-dialog.component.html",
  styleUrls: ["./add-user-dialog.component.scss"],
  providers: [RegistryService]
})
export class AddUserDialogComponent {
  public readonly newUserForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(NAME_REGEXP)]),
    last_name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(NAME_REGEXP)]),
    middle_name: new FormControl(null, [Validators.minLength(2), Validators.maxLength(45), Validators.pattern(NAME_REGEXP)]),
    birthday: new FormControl(null, Validators.required),
    phone: new FormControl("+380", [Validators.required, Validators.pattern(PHONE_REGEXP)]),
    tax_id: new FormControl(null, [Validators.required, Validators.pattern(TAX_ID_REGEXP)]),
    passport: new FormControl(null, [Validators.required, Validators.pattern(PASSPORT_REGEXP)]),
    address: new FormControl(null, [Validators.maxLength(128), Validators.required])
  });

  constructor(
    @Self() private readonly registryService: RegistryService,
    private readonly dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public hasErrors(formControl: string): boolean {
    return !!this.newUserForm.get(formControl)?.errors;
  }

  public getInputError(formControl: string): string {
    const fc = this.newUserForm.get(formControl);

    if (!fc) {
      return "Form control not found!";
    }

    if (!fc.errors) {
      return "";
    }

    if (fc.errors["required"]) {
      return "Обов'язкове поле!";
    }

    if (fc.errors["minlength"]) {
      return `Мінімальна довжина: ${ fc.errors["minlength"].requiredLength }`;
    }

    if (fc.errors["maxlength"]) {
      return `Максимальна довжина: ${ fc.errors["maxlength"].requiredLength }`;
    }

    if (fc.errors["pattern"]) {
      return `Поле повинно відповідати патерну: ${ fc.errors["pattern"].requiredPattern }`;
    }

    return "err";
  }

  onAddClick(): void {
    if (this.newUserForm.valid) {
      const payload = Object.assign({}, this.newUserForm.value);

      Object.keys(payload).forEach(key => {
        if (!payload[key]) {
          delete payload[key];
        }
      });

      this.registryService.createUser(payload).subscribe({
        next: () => this.dialogRef.close(true)
      });
    }
  }
}
