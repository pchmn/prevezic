import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { composeDeploy, composeUpdate } from '../../sdk/client';
import type { getConfig } from '../config';
import { getOrCreateCompose } from '../helpers/compose.helper';
import { waitForDeploymentToBeDone } from '../helpers/dokploy.helper';

export async function deployCompose(config: ReturnType<typeof getConfig>) {
  const compose = await getOrCreateCompose({
    composeId: config.composeId,
    composeName: config.composeName,
    composeDomain: config.composeDomain,
    projectId: config.projectId,
  });

  if (!compose) {
    throw new Error('Cannot get or create compose');
  }

  core.info(`Deploying compose ${compose.name}...`);
  const composeFile = await readFile(config.composeFile, 'utf8');
  core.debug(`Compose file content: ${composeFile}`);

  await composeUpdate({
    body: {
      composeId: compose.composeId,
      composeFile: composeFile,
      sourceType: 'raw',
      env: config.env.join('\n'),
    },
  });

  core.info(`Deploying ${compose.name}...`);
  const res = await composeDeploy({
    parseAs: 'text',
    body: { composeId: compose.composeId },
  });
  core.debug(`Deploy response: ${JSON.stringify(res, null, 2)}`);

  core.debug('Waiting for deployment to be done...');
  await waitForDeploymentToBeDone(compose.composeId, 'compose');

  const appSettingsUrl = `${config.dokployBaseUrl}/dashboard/project/${config.projectId}/services/compose/${compose.composeId}`;
  const composeUrl = config.appUrl ?? appSettingsUrl;

  return {
    appName: compose.name,
    appUrl: composeUrl,
    appSettingsUrl,
  };

  // if (config.commentPr) {
  //   core.debug('Setting pull request comment...');
  //   await setPullRequestComment(octokit, {
  //     appName: compose.name,
  //     appUrl: composeUrl,
  //     appSettingsUrl,
  //   });
  // }

  // core.info(`🚀 ${compose.name} successfully deployed to ${composeUrl}`);
}
