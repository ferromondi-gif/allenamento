export type ActivityCategory = 'Sport Specifico' | 'Altro Sport' | 'Preparazione Atletica';

export interface WorkoutData {
  athleteName: string;
  category: ActivityCategory | null;
  rpe: number;
  
  // Specifico
  discipline?: 'Slalom' | 'Gigante' | 'Discipline Veloci' | 'Altro';
  type?: 'Campo Libero' | 'Addestramento' | 'Specifico' | 'Gara';
  rounds?: number;
  mancheDuration?: number;
  sessionDuration?: number;
  requests?: string[]; // Tecnica, Tattica, Performance, Svago
  summary?: string;

  // Altro Sport
  description?: string;
  funFactor?: number; // 0-3

  // Preparazione
  prepTypes?: string[]; // Forza, Pliometria, etc.
  intensity?: number; // 0-4
  volume?: number; // 0-4
  
  timestamp: string;
}
