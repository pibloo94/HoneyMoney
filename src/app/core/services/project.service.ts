import { Injectable, signal, computed, inject } from '@angular/core';
import { Project } from '../models/project.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiService = inject(ApiService);
  
  // Initialize with a default project if empty
  private defaultProject: Project = {
    id: 'default-project',
    name: 'General',
    members: ['Pablo', 'Partner'], // Default members
    description: 'General family expenses',
    color: '#3b82f6'
  };

  private projectsSignal = signal<Project[]>([]);
  
  projects = computed(() => this.projectsSignal());
  activeProject = signal<Project | null>(null);

  constructor() {
    this.loadProjects();
  }

  private loadProjects() {
    this.apiService.get<Project[]>('projects').subscribe({
      next: (projects) => {
        if (projects.length === 0) {
          // If no projects exist, create the default one
          this.addProject(this.defaultProject);
        } else {
          this.projectsSignal.set(projects);
          if (projects.length > 0) {
            this.activeProject.set(projects[0]);
          }
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Fallback to default project on error
        this.projectsSignal.set([this.defaultProject]);
        this.activeProject.set(this.defaultProject);
      }
    });
  }

  addProject(project: Omit<Project, 'id'> | Project) {
    const newProject: Project = 'id' in project ? project : {
      ...project,
      id: crypto.randomUUID()
    };
    
    this.apiService.post<Project>('projects', newProject).subscribe({
      next: (savedProject) => {
        this.projectsSignal.update(projects => [...projects, savedProject]);
      },
      error: (error) => console.error('Error adding project:', error)
    });
  }

  updateProject(id: string, updates: Partial<Omit<Project, 'id'>>) {
    this.apiService.put<Project>(`projects/${id}`, updates).subscribe({
      next: (updatedProject) => {
        this.projectsSignal.update(projects => 
          projects.map(p => p.id === id ? updatedProject : p)
        );
      },
      error: (error) => console.error('Error updating project:', error)
    });
  }

  deleteProject(id: string) {
    if (id === this.defaultProject.id) return; // Prevent deleting default
    
    this.apiService.delete(`projects/${id}`).subscribe({
      next: () => {
        this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
      },
      error: (error) => console.error('Error deleting project:', error)
    });
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }
}

