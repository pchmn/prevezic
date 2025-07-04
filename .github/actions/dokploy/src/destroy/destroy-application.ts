import * as core from '@actions/core';
import { applicationDelete } from '../../sdk/client';
import type { getConfig } from '../config';
import { getApplication } from '../helpers/application.helper';

export async function destroyApplication(config: ReturnType<typeof getConfig>) {
  core.info('Destroying application...');

  const { application } = await getApplication({
    applicationId: config.applicationId,
    applicationName: config.applicationName,
    projectId: config.projectId,
  });

  if (!application) {
    throw new Error('Application not found');
  }

  await applicationDelete({
    body: { applicationId: application.applicationId },
  });

  return {
    appName: application.name,
  };
}
