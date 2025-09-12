import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PagarComponent } from './pages/pagar/pagar.component';
import { ChatComponent } from './pages/chat/chat.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent, title: 'VeritasDei — Início' },
  { path: 'pagar', component: PagarComponent, title: 'Assinatura' },
  { path: 'chat', component: ChatComponent, title: 'Chat' },
  { path: 'perfil', component: PerfilComponent, title: 'Perfil' },
  { path: '**', redirectTo: 'inicio' }
];
