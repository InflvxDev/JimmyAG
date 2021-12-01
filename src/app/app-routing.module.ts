import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrenamientoRedComponent } from './Components/entrenamiento-red/entrenamiento-red.component';



const routes: Routes = [
{path: '', component: EntrenamientoRedComponent, pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
