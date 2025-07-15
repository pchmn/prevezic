import { Migrations } from '@convex-dev/migrations';
import { components, internal } from './_generated/api.js';
import type { DataModel } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);

export const runAll = migrations.runner([
  internal.migrations.setDefaultMediaDate,
]);

export const setDefaultMediaDate = migrations.define({
  table: 'medias',
  migrateOne: async (ctx, doc) => {
    if (doc.date === undefined) {
      await ctx.db.patch(doc._id, { date: doc._creationTime });
    }
  },
});
