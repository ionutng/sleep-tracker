import { Routes } from '@angular/router';
import { CreateComponent } from './sleep-record/create/create.component';
import { IndexComponent } from './sleep-record/index/index.component';
import { ViewComponent } from './sleep-record/view/view.component';
import { EditComponent } from './sleep-record/edit/edit.component';
import { DeleteComponent } from './sleep-record/delete/delete.component';

export const routes: Routes = [
    { path: '', redirectTo: 'sleep-record/index', pathMatch: 'full'},
    { path: 'sleep-record', redirectTo: 'sleep-record/index', pathMatch: 'full'},
    { path: 'sleep-record/index', component: IndexComponent},
    { path: 'sleep-record/create', component: CreateComponent},
    { path: 'sleep-record/:id/view', component: ViewComponent},
    { path: 'sleep-record/:id/edit', component: EditComponent},
    { path: 'sleep-record/:id/delete', component: DeleteComponent}
];
