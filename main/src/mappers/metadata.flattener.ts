import { Metadata } from '../domain/metadata.model';
import { MetadataPathPolicy } from './metadata-path.policy';
import { MetadataTypePolicy } from './metadata-type.policy';

export class MetadataFlattener {
  constructor(
    private readonly pathPolicy = new MetadataPathPolicy(),
    private readonly typePolicy = new MetadataTypePolicy(),
  ) {}

  private isLeaf(v: unknown): v is string | number | boolean | null {
    return v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
  }

  public flatten(root: Record<string, unknown>, rootPath = ''): Metadata[] {
    const out: Metadata[] = [];

    const visit = (node: unknown, path: string): void => {
      if (node === undefined) return;

      if (this.isLeaf(node)) {
        if (node === null) return;
        if (!this.pathPolicy.include(path)) return;

        out.push(new Metadata(path, String(node), this.typePolicy.type(path)));
        return;
      }

      if (Array.isArray(node)) {
        node.forEach((item, i) => visit(item, path ? `${path}.${i}` : `${i}`));
        return;
      }

      const obj = node as Record<string, unknown>;
      for (const [k, v] of Object.entries(obj)) {
        const next = path ? `${path}.${k}` : k;
        visit(v, next);
      }
    };

    visit(root, rootPath);
    return out;
  }
}
