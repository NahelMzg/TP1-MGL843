#!/usr/bin/env node

import { Command } from 'commander';
import { NotesManager } from './NotesManager';
import * as path from 'path';

const program = new Command();
const manager = new NotesManager();

program
  .name('notes')
  .description('Gestionnaire de notes en ligne de commande')
  .version('1.0.0');

program
  .command('create')
  .description('Créer une nouvelle note')
  .requiredOption('-t, --title <title>', 'Titre de la note')
  .requiredOption('-c, --content <content>', 'Contenu de la note')
  .option('-g, --tags <tags>', 'Étiquettes séparées par des virgules', '')
  .action((options) => {
    const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [];
    const note = manager.createNote(options.title, options.content, tags);
    console.log('✓ Note créée avec succès!');
    console.log(`ID: ${note.id}`);
    console.log(`Titre: ${note.title}`);
    console.log(`Tags: ${note.tags.join(', ') || 'Aucun'}`);
  });

program
  .command('list')
  .description('Lister toutes les notes')
  .option('-v, --verbose', 'Afficher tous les détails')
  .action((options) => {
    const notes = manager.listNotes();
    
    if (notes.length === 0) {
      console.log('Aucune note trouvée.');
      return;
    }

    console.log(`\n${notes.length} note(s) trouvée(s):\n`);
    
    notes.forEach((note, index) => {
      console.log(`[${index + 1}] ${note.title}`);
      console.log(`    ID: ${note.id}`);
      
      if (options.verbose) {
        console.log(`    Contenu: ${note.content}`);
        console.log(`    Tags: ${note.tags.join(', ') || 'Aucun'}`);
        console.log(`    Créée le: ${note.createdAt.toLocaleString()}`);
        console.log(`    Modifiée le: ${note.updatedAt.toLocaleString()}`);
      } else {
        const preview = note.content.length > 50 
          ? note.content.substring(0, 50) + '...' 
          : note.content;
        console.log(`    ${preview}`);
        if (note.tags.length > 0) {
          console.log(`    Tags: ${note.tags.join(', ')}`);
        }
      }
      console.log('');
    });
  });

program
  .command('search')
  .description('Rechercher des notes')
  .requiredOption('-q, --query <query>', 'Terme de recherche')
  .action((options) => {
    const results = manager.searchNotes(options.query);
    
    if (results.length === 0) {
      console.log(`Aucune note trouvée pour "${options.query}".`);
      return;
    }

    console.log(`\n${results.length} note(s) trouvée(s) pour "${options.query}":\n`);
    
    results.forEach((note, index) => {
      console.log(`[${index + 1}] ${note.title}`);
      console.log(`    ID: ${note.id}`);
      const preview = note.content.length > 50 
        ? note.content.substring(0, 50) + '...' 
        : note.content;
      console.log(`    ${preview}`);
      if (note.tags.length > 0) {
        console.log(`    Tags: ${note.tags.join(', ')}`);
      }
      console.log('');
    });
  });

program
  .command('tag')
  .description('Filtrer les notes par étiquette')
  .requiredOption('-t, --tag <tag>', 'Étiquette à rechercher')
  .action((options) => {
    const results = manager.getNotesByTag(options.tag);
    
    if (results.length === 0) {
      console.log(`Aucune note avec l'étiquette "${options.tag}".`);
      return;
    }

    console.log(`\n${results.length} note(s) avec l'étiquette "${options.tag}":\n`);
    
    results.forEach((note, index) => {
      console.log(`[${index + 1}] ${note.title}`);
      console.log(`    ID: ${note.id}`);
      const preview = note.content.length > 50 
        ? note.content.substring(0, 50) + '...' 
        : note.content;
      console.log(`    ${preview}`);
      console.log('');
    });
  });

program
  .command('delete')
  .description('Supprimer une note')
  .requiredOption('-i, --id <id>', 'ID de la note à supprimer')
  .action((options) => {
    const deleted = manager.deleteNote(options.id);
    
    if (deleted) {
      console.log('✓ Note supprimée avec succès!');
    } else {
      console.log(`✗ Aucune note trouvée avec l'ID "${options.id}".`);
    }
  });

program
  .command('export')
  .description('Exporter les notes')
  .requiredOption('-o, --output <path>', 'Chemin du fichier de sortie')
  .action((options) => {
    try {
      manager.exportNotes(path.resolve(options.output));
      console.log(`✓ Notes exportées avec succès vers ${options.output}`);
    } catch (error) {
      console.error(`✗ Erreur lors de l'export: ${error}`);
    }
  });

program
  .command('import')
  .description('Importer des notes')
  .requiredOption('-i, --input <path>', 'Chemin du fichier à importer')
  .option('-m, --merge', 'Fusionner avec les notes existantes')
  .action((options) => {
    try {
      manager.importNotes(path.resolve(options.input), options.merge);
      console.log(`✓ Notes importées avec succès depuis ${options.input}`);
    } catch (error) {
      console.error(`✗ Erreur lors de l'import: ${error}`);
    }
  });

program
  .command('show')
  .description('Afficher une note par son ID')
  .requiredOption('-i, --id <id>', 'ID de la note')
  .action((options) => {
    const note = manager.getNoteById(options.id);
    
    if (!note) {
      console.log(`✗ Aucune note trouvée avec l'ID "${options.id}".`);
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log(note.title);
    console.log('='.repeat(60));
    console.log(`\n${note.content}\n`);
    console.log(`Tags: ${note.tags.join(', ') || 'Aucun'}`);
    console.log(`ID: ${note.id}`);
    console.log(`Créée: ${note.createdAt.toLocaleString()}`);
    console.log(`Modifiée: ${note.updatedAt.toLocaleString()}`);
    console.log('');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}