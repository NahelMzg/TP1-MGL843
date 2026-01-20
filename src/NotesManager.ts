import * as fs from 'fs';
import * as path from 'path';
import { Note, NotesData } from './types';

export class NotesManager {
  private dataFilePath: string;
  private notes: Note[] = [];

  constructor(dataFilePath?: string) {
    this.dataFilePath = dataFilePath || path.join(process.cwd(), 'notes.json');
    this.loadNotes();
  }

  private loadNotes(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed: NotesData = JSON.parse(data);
        this.notes = parsed.notes.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
      this.notes = [];
    }
  }

  private saveNotes(): void {
    try {
      const data: NotesData = { notes: this.notes };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Erreur lors de la sauvegarde des notes: ${error}`);
    }
  }

  createNote(title: string, content: string, tags: string[] = []): Note {
    const note: Note = {
      id: this.generateId(),
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notes.push(note);
    this.saveNotes();
    return note;
  }

  listNotes(): Note[] {
    return [...this.notes];
  }

  getNoteById(id: string): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    if (noteIndex === -1) return null;

    this.notes[noteIndex] = {
      ...this.notes[noteIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.saveNotes();
    return this.notes[noteIndex];
  }

  deleteNote(id: string): boolean {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    
    if (this.notes.length < initialLength) {
      this.saveNotes();
      return true;
    }
    return false;
  }

  searchNotes(query: string, searchInTags: boolean = true): Note[] {
    const lowerQuery = query.toLowerCase();
    return this.notes.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(lowerQuery);
      const contentMatch = note.content.toLowerCase().includes(lowerQuery);
      const tagMatch = searchInTags && note.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );

      return titleMatch || contentMatch || tagMatch;
    });
  }

  getNotesByTag(tag: string): Note[] {
    const lowerTag = tag.toLowerCase();
    return this.notes.filter(note => 
      note.tags.some(t => t.toLowerCase() === lowerTag)
    );
  }

  exportNotes(exportPath: string): void {
    try {
      const data: NotesData = { notes: this.notes };
      fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Erreur lors de l'export des notes: ${error}`);
    }
  }

  importNotes(importPath: string, merge: boolean = false): void {
    try {
      const data = fs.readFileSync(importPath, 'utf-8');
      const parsed: NotesData = JSON.parse(data);
      const importedNotes = parsed.notes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));

      if (merge) {
        this.notes.push(...importedNotes);
      } else {
        this.notes = importedNotes;
      }

      this.saveNotes();
    } catch (error) {
      throw new Error(`Erreur lors de l'import des notes: ${error}`);
    }
  }

  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearAllNotes(): void {
    this.notes = [];
    this.saveNotes();
  }
}