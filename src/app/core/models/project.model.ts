export interface Project {
    id: string;
    name: string;
    members: string[]; // List of names, e.g., ['Pablo', 'Maria']
    description?: string;
    color?: string;
}
