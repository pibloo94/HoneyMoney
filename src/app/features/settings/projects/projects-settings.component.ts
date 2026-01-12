import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-projects-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, InputText, TableModule, Dialog, Chip],
  templateUrl: './projects-settings.component.html',
  styleUrl: './projects-settings.component.css'
})
export class ProjectsSettingsComponent {
    private projectService = inject(ProjectService);
    private fb = inject(FormBuilder);

    projects = this.projectService.projects;
    displayDialog = false;
    editingId: string | null = null;

    form = this.fb.group({
        name: ['', Validators.required],
        membersString: ['Pablo, Partner', Validators.required]
    });

    showAddDialog() {
        this.editingId = null;
        this.form.reset({ name: '', membersString: 'Pablo, Partner' });
        this.displayDialog = true;
    }

    showEditDialog(project: any) {
        this.editingId = project.id;
        this.form.patchValue({
            name: project.name,
            membersString: project.members.join(', ')
        });
        this.displayDialog = true;
    }

    saveProject() {
        if (this.form.valid) {
            const val = this.form.value;
            const members = val.membersString!.split(',').map(s => s.trim()).filter(s => s.length > 0);
            
            // Generate a random color for the project
            const randomColor = this.getRandomColor();
            
            if (this.editingId) {
                this.projectService.updateProject(this.editingId, {
                    name: val.name!,
                    members: members,
                });
            } else {
                this.projectService.addProject({
                    name: val.name!,
                    members: members,
                    description: '',
                    color: randomColor
                });
            }
            this.displayDialog = false;
        }
    }

    private getRandomColor(): string {
        const colors = [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#ef4444', // red
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#14b8a6', // teal
            '#f97316', // orange
            '#6366f1', // indigo
            '#06b6d4'  // cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    deleteProject(id: string) {
        if(confirm('Are you sure? This will not delete associated transactions but they will show as Unknown project.')) {
            this.projectService.deleteProject(id);
        }
    }
}
