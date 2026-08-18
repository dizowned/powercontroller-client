import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
// Angular Material modules
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
// Shared Components
//import { SideNav } from './ui/shared/side-nav/side-nav';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    RouterOutlet,
    //SideNav
],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
constructor(
  private readonly matIconRegistry: MatIconRegistry,
  private readonly sanitizer: DomSanitizer
) {
  this.registerIcons();
}

protected readonly title = signal('POWER CONTROLLER APP');
isExpanded = signal(true);
showMenu = signal(true);
menuOpen = signal(true);

private registerIcons() {
  ['menu', 'expand_more', 'home', 'settings'].forEach((iconName) => {
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`)
    );
  });
}

toggleSidenav() {
  this.isExpanded.set(!this.isExpanded());
    this.menuOpen.set(!this.menuOpen());
    console.log("Sidenav toggled. isExpanded:", this.isExpanded(), "menuOpen:", this.menuOpen());
  }

  toggleMenu(){
    this.showMenu.set(!this.showMenu());
  }
}
