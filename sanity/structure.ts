import type { StructureResolver } from 'sanity/structure';
import { singletonTypes, singletonDocIds } from './schemas';

/**
 * Custom desk structure for FICCC Sanity Studio.
 * - Singletons shown as single-doc editors at top (one per language)
 * - Document types shown as filterable lists below
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- Singletons ---
      S.listItem()
        .title('Settings & Navigation')
        .child(
          S.list()
            .title('Settings & Navigation')
            .items(
              singletonDocIds.map((singleton) =>
                S.listItem()
                  .title(singleton.title)
                  .id(singleton.id)
                  .child(
                    S.document()
                      .schemaType(singleton.type)
                      .documentId(singleton.id)
                      .title(singleton.title),
                  ),
              ),
            ),
        ),

      S.divider(),

      // --- Document types (excluding singletons) ---
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() as string),
      ),
    ]);
