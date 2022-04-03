import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistryComponent } from "./components/registry/registry.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "registry"
  },
  {
    path: "registry",
    component: RegistryComponent
  },
  {
    path: "**",
    redirectTo: "registry"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
