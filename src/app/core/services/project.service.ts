import { Injectable, signal, computed, effect } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private STORAGE_KEY = 'honeymoney_projects';
  
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
    this.loadFromStorage();
    
    // Auto-save effect
    effect(() => {
        this.saveToStorage(this.projectsSignal());
    });
  }

  addProject(project: Omit<Project, 'id'>) {
    const newProject: Project = {
        ...project,
        id: crypto.randomUUID()
    };
    this.projectsSignal.update(projects => [...projects, newProject]);
  }

  updateProject(id: string, updates: Partial<Omit<Project, 'id'>>) {
    this.projectsSignal.update(projects => 
        projects.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }

  deleteProject(id: string) {
    if (id === this.defaultProject.id) return; // Prevent deleting default
    this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
        try {
            this.projectsSignal.set(JSON.parse(data));
        } catch (e) {
            console.error('Failed to parse projects', e);
            this.projectsSignal.set([this.defaultProject]);
        }
    } else {
        this.projectsSignal.set([this.defaultProject]);
    }
    
    // Set active project to first one by default
    if (this.projectsSignal().length > 0) {
        this.activeProject.set(this.projectsSignal()[0]);
    }
  }

  private saveToStorage(projects: Project[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
