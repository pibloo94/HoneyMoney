import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsSettingsComponent } from './projects/projects-settings.component';
import { CategoriesSettingsComponent } from './categories/categories-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ProjectsSettingsComponent, CategoriesSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  activeTab: 'projects' | 'categories' = 'projects';
}
