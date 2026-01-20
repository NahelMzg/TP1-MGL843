import { NotesManager } from '../src/NotesManager';
import * as fs from 'fs';
import * as path from 'path';

describe('Gestionnaire de Notes - Tests Fonctionnels', () => {
  const testDataPath = path.join(__dirname, 'test-notes.json');
  const exportPath = path.join(__dirname, 'export-notes.json');
  let manager: NotesManager;

  beforeEach(() => {
    if (fs.existsSync(testDataPath)) {
      fs.unlinkSync(testDataPath);
    }
    if (fs.existsSync(exportPath)) {
      fs.unlinkSync(exportPath);
    }
    manager = new NotesManager(testDataPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDataPath)) {
      fs.unlinkSync(testDataPath);
    }
    if (fs.existsSync(exportPath)) {
      fs.unlinkSync(exportPath);
    }
  });

  describe('Fonctionnalité: Créer des notes', () => {
    test('Doit créer une note avec titre et contenu', () => {
      const note = manager.createNote('Ma première note', 'Contenu de la note');

      expect(note).toBeDefined();
      expect(note.id).toBeDefined();
      expect(note.title).toBe('Ma première note');
      expect(note.content).toBe('Contenu de la note');
      expect(note.tags).toEqual([]);
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.updatedAt).toBeInstanceOf(Date);
    });

    test('Doit créer une note avec des tags', () => {
      const note = manager.createNote(
        'Note avec tags',
        'Contenu',
        ['travail', 'important']
      );

      expect(note.tags).toEqual(['travail', 'important']);
      expect(note.tags.length).toBe(2);
    });

    test('Doit créer plusieurs notes avec des IDs uniques', () => {
      const note1 = manager.createNote('Note 1', 'Contenu 1');
      const note2 = manager.createNote('Note 2', 'Contenu 2');
      const note3 = manager.createNote('Note 3', 'Contenu 3');

      expect(note1.id).not.toBe(note2.id);
      expect(note2.id).not.toBe(note3.id);
      expect(note1.id).not.toBe(note3.id);
    });

    test('Doit persister les notes créées dans le fichier JSON', () => {
      manager.createNote('Note persistée', 'Contenu persisté');

      expect(fs.existsSync(testDataPath)).toBe(true);

      const newManager = new NotesManager(testDataPath);
      const notes = newManager.listNotes();

      expect(notes.length).toBe(1);
      expect(notes[0].title).toBe('Note persistée');
    });
  });

  describe('Fonctionnalité: Afficher (lister) des notes', () => {
    test('Doit retourner une liste vide quand aucune note existe', () => {
      const notes = manager.listNotes();

      expect(notes).toEqual([]);
      expect(notes.length).toBe(0);
    });

    test('Doit lister toutes les notes créées', () => {
      manager.createNote('Note 1', 'Contenu 1');
      manager.createNote('Note 2', 'Contenu 2');
      manager.createNote('Note 3', 'Contenu 3');

      const notes = manager.listNotes();

      expect(notes.length).toBe(3);
      expect(notes[0].title).toBe('Note 1');
      expect(notes[1].title).toBe('Note 2');
      expect(notes[2].title).toBe('Note 3');
    });

    test('Doit récupérer une note spécifique par son ID', () => {
      const created = manager.createNote('Note spécifique', 'Contenu spécifique');
      const found = manager.getNoteById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Note spécifique');
    });

    test('Doit retourner undefined pour un ID inexistant', () => {
      const found = manager.getNoteById('id_inexistant');

      expect(found).toBeUndefined();
    });
  });

  describe('Fonctionnalité: Associer des étiquettes (tags)', () => {
    test('Doit créer une note avec plusieurs tags', () => {
      const note = manager.createNote(
        'Note taggée',
        'Contenu',
        ['urgent', 'travail', 'projet-x']
      );

      expect(note.tags).toContain('urgent');
      expect(note.tags).toContain('travail');
      expect(note.tags).toContain('projet-x');
      expect(note.tags.length).toBe(3);
    });

    test('Doit filtrer les notes par tag', () => {
      manager.createNote('Note 1', 'Contenu 1', ['urgent']);
      manager.createNote('Note 2', 'Contenu 2', ['travail']);
      manager.createNote('Note 3', 'Contenu 3', ['urgent', 'travail']);

      const urgentNotes = manager.getNotesByTag('urgent');
      const travailNotes = manager.getNotesByTag('travail');

      expect(urgentNotes.length).toBe(2);
      expect(travailNotes.length).toBe(2);
    });

    test('Doit être insensible à la casse lors de la recherche par tag', () => {
      manager.createNote('Note', 'Contenu', ['Urgent']);

      const results = manager.getNotesByTag('urgent');

      expect(results.length).toBe(1);
    });

    test('Doit retourner une liste vide pour un tag inexistant', () => {
      manager.createNote('Note', 'Contenu', ['tag1']);

      const results = manager.getNotesByTag('tag_inexistant');

      expect(results.length).toBe(0);
    });

    test('Doit pouvoir modifier les tags d\'une note existante', () => {
      const note = manager.createNote('Note', 'Contenu', ['tag1']);
      const updated = manager.updateNote(note.id, { tags: ['tag2', 'tag3'] });

      expect(updated).toBeDefined();
      expect(updated?.tags).toEqual(['tag2', 'tag3']);
      expect(updated?.tags).not.toContain('tag1');
    });
  });

  describe('Fonctionnalité: Rechercher des notes', () => {
    beforeEach(() => {
      manager.createNote('Réunion client', 'Discuter du projet X', ['travail', 'client']);
      manager.createNote('Liste de courses', 'Acheter du pain et du lait', ['personnel']);
      manager.createNote('Idée projet', 'Créer une app mobile', ['travail', 'projet']);
    });

    test('Doit rechercher dans les titres', () => {
      const results = manager.searchNotes('projet');

      expect(results.length).toBe(2);
      expect(results.some(n => n.title.includes('projet'))).toBe(true);
    });

    test('Doit rechercher dans le contenu', () => {
      const results = manager.searchNotes('pain');

      expect(results.length).toBe(1);
      expect(results[0].content).toContain('pain');
    });

    test('Doit rechercher dans les tags', () => {
      const results = manager.searchNotes('travail');

      expect(results.length).toBe(2);
    });

    test('Doit être insensible à la casse', () => {
      const results1 = manager.searchNotes('PROJET');
      const results2 = manager.searchNotes('projet');

      expect(results1.length).toBe(results2.length);
    });

    test('Doit retourner une liste vide si aucune correspondance', () => {
      const results = manager.searchNotes('xyz123nonexistant');

      expect(results.length).toBe(0);
    });

    test('Doit rechercher des mots partiels', () => {
      const results = manager.searchNotes('cour');

      expect(results.length).toBe(1);
      expect(results[0].title).toContain('courses');
    });
  });

  describe('Fonctionnalité: Sauvegarder (exporter) les notes', () => {
    beforeEach(() => {
      manager.createNote('Note 1', 'Contenu 1', ['tag1']);
      manager.createNote('Note 2', 'Contenu 2', ['tag2']);
    });

    test('Doit exporter les notes dans un fichier JSON', () => {
      manager.exportNotes(exportPath);

      expect(fs.existsSync(exportPath)).toBe(true);

      const exported = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
      expect(exported.notes).toBeDefined();
      expect(exported.notes.length).toBe(2);
    });

    test('Les notes exportées doivent contenir toutes les propriétés', () => {
      manager.exportNotes(exportPath);

      const exported = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
      const note = exported.notes[0];

      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('content');
      expect(note).toHaveProperty('tags');
      expect(note).toHaveProperty('createdAt');
      expect(note).toHaveProperty('updatedAt');
    });

    test('Doit pouvoir importer des notes depuis un fichier exporté', () => {
      manager.exportNotes(exportPath);

      const newManager = new NotesManager(path.join(__dirname, 'new-test.json'));
      newManager.importNotes(exportPath);

      const importedNotes = newManager.listNotes();

      expect(importedNotes.length).toBe(2);
      expect(importedNotes[0].title).toBe('Note 1');
      expect(importedNotes[1].title).toBe('Note 2');

      fs.unlinkSync(path.join(__dirname, 'new-test.json'));
    });

    test('Doit pouvoir fusionner des notes importées', () => {
      manager.exportNotes(exportPath);

      manager.createNote('Note 3', 'Contenu 3');
      manager.importNotes(exportPath, true);

      const notes = manager.listNotes();

      expect(notes.length).toBe(5);
    });

    test('L\'import sans fusion doit remplacer toutes les notes', () => {
      manager.exportNotes(exportPath);

      manager.createNote('Note 3', 'Contenu 3');
      manager.createNote('Note 4', 'Contenu 4');

      manager.importNotes(exportPath, false);

      const notes = manager.listNotes();

      expect(notes.length).toBe(2);
    });
  });

  describe('Fonctionnalités supplémentaires', () => {
    test('Doit pouvoir supprimer une note', () => {
      const note = manager.createNote('Note à supprimer', 'Contenu');
      const deleted = manager.deleteNote(note.id);

      expect(deleted).toBe(true);
      expect(manager.listNotes().length).toBe(0);
    });

    test('Doit retourner false lors de la suppression d\'une note inexistante', () => {
      const deleted = manager.deleteNote('id_inexistant');

      expect(deleted).toBe(false);
    });

    test('Doit pouvoir modifier une note existante', () => {
      const note = manager.createNote('Titre original', 'Contenu original');
      const updated = manager.updateNote(note.id, {
        title: 'Nouveau titre',
        content: 'Nouveau contenu'
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Nouveau titre');
      expect(updated?.content).toBe('Nouveau contenu');
      expect(updated?.id).toBe(note.id);
    });

    test('La date de modification doit être mise à jour lors d\'une modification', (done) => {
      const note = manager.createNote('Note', 'Contenu');
      const originalUpdatedAt = note.updatedAt;

      setTimeout(() => {
        const updated = manager.updateNote(note.id, { content: 'Nouveau contenu' });

        expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        done();
      }, 10);
    });

    test('Doit retourner null lors de la modification d\'une note inexistante', () => {
      const updated = manager.updateNote('id_inexistant', { title: 'Nouveau' });

      expect(updated).toBeNull();
    });
  });

  describe('Scénarios d\'utilisation complets', () => {
    test('Scénario: Gestion complète de notes de projet', () => {
      const note1 = manager.createNote(
        'Réunion initiale',
        'Définir les objectifs du projet',
        ['projet', 'reunion']
      );

      const note2 = manager.createNote(
        'Liste des tâches',
        'Tâche 1, Tâche 2, Tâche 3',
        ['projet', 'todo']
      );

      const note3 = manager.createNote(
        'Budget',
        '5000€ alloués',
        ['projet', 'finance']
      );

      expect(manager.listNotes().length).toBe(3);

      const projetNotes = manager.getNotesByTag('projet');
      expect(projetNotes.length).toBe(3);

      const searchResults = manager.searchNotes('tâche');
      expect(searchResults.length).toBe(1);

      manager.exportNotes(exportPath);
      expect(fs.existsSync(exportPath)).toBe(true);

      manager.deleteNote(note1.id);
      expect(manager.listNotes().length).toBe(2);
    });

    test('Scénario: Sauvegarde et récupération après redémarrage', () => {
      manager.createNote('Note persistante', 'Ne pas oublier', ['important']);

      const newManager = new NotesManager(testDataPath);
      const notes = newManager.listNotes();

      expect(notes.length).toBe(1);
      expect(notes[0].title).toBe('Note persistante');
      expect(notes[0].tags).toContain('important');
    });
  });
});