import { constants } from 'node:fs';
import { access, copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pageCatalog, pagesPath } from '../src/pageCatalog';

const paths = new Set<string>([pagesPath]);
const ids = new Set(['home', 'pages', 'not-found']);
for (const { id, path, thumbnail } of pageCatalog) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) {
    throw new Error(`Invalid, duplicate, or reserved page ID: ${id}`);
  }
  if (
    !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)
  ) {
    throw new Error(`Expected a page URL made of lowercase slugs: ${path}`);
  }
  if (paths.has(path))
    throw new Error(`Duplicate or reserved page URL: ${path}`);
  if (thumbnail) {
    if (
      !/^\/(?:[\w-]+\/)*[\w-]+\.(avif|gif|jpe?g|png|svg|webp)$/i.test(thumbnail)
    ) {
      throw new Error(
        `Expected a local thumbnail URL for ${path}: ${thumbnail}`,
      );
    }
    await access(join('public', thumbnail.slice(1)));
  }
  ids.add(id);
  paths.add(path);
}

// Serve the React app on direct visits to registered routes on static hosts.
for (const path of paths) {
  const folder = join('dist', path.slice(1));
  await mkdir(folder, { recursive: true });
  await copyFile(
    'dist/index.html',
    join(folder, 'index.html'),
    constants.COPYFILE_EXCL,
  );
}

console.log(`Wrote ${paths.size} static page entry files.`);
