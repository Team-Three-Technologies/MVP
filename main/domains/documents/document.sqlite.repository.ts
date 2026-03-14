import { injectable, inject } from 'tsyringe';
import { DatabaseProvider } from '../../infrastructure/database.provider';
import type { IDocumentRepository } from './document.repository.interface';
import type { Document } from './document.model';

interface DocumentRow {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

@injectable()
export class SqliteDocumentRepository implements IDocumentRepository {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider
  ) { }

  findAll(): Document[] {
    const rows = this.db.instance
      .prepare('SELECT * FROM documents ORDER BY updated_at DESC')
      .all() as DocumentRow[];
    return rows.map(this.toModel);
  }

  findById(id: string): Document | null {
    const row = this.db.instance
      .prepare('SELECT * FROM documents WHERE id = ?')
      .get(id) as DocumentRow | undefined;
    return row ? this.toModel(row) : null;
  }

  save(document: Document): Document {
    this.db.instance
      .prepare(`
        INSERT INTO documents (id, title, content, updated_at)
        VALUES (@id, @title, @content, @updatedAt)
        ON CONFLICT(id) DO UPDATE SET
          title = @title,
          content = @content,
          updated_at = @updatedAt
      `)
      .run({
        id: document.id,
        title: document.title,
        content: document.content,
        updatedAt: document.updatedAt.toISOString(),
      });
    return document;
  }

  delete(id: string): void {
    this.db.instance
      .prepare('DELETE FROM documents WHERE id = ?')
      .run(id);
  }

  private toModel(row: DocumentRow): Document {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      updatedAt: new Date(row.updated_at),
    };
  }
}