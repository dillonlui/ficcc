import type { StructureResolver } from 'sanity/structure';

/**
 * Custom desk structure for FICCC Sanity Studio.
 * Singleton handling and document type grouping will be added in T02.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(S.documentTypeListItems());
