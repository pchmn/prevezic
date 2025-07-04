import { composeDelete } from '../../sdk/client';
import type { getConfig } from '../config';
import { getCompose } from '../helpers/compose.helper';

export async function destroyCompose(config: ReturnType<typeof getConfig>) {
  const { compose } = await getCompose({
    composeId: config.composeId,
    composeName: config.composeName,
    projectId: config.projectId,
  });

  if (!compose) {
    throw new Error('Compose not found');
  }

  await composeDelete({
    body: { composeId: compose.composeId, deleteVolumes: true },
  });

  return {
    appName: compose.name,
  };
}
