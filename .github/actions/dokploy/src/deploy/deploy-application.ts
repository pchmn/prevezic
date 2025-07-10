import { getApplicationUrl } from '../helpers/application.helper';

import * as core from '@actions/core';
import {
  applicationDeploy,
  applicationSaveDockerProvider,
  applicationSaveEnvironment,
} from '../../sdk/client';
import type { getConfig } from '../config';
import { getOrCreateApplication } from '../helpers/application.helper';
import { waitForDeploymentToBeDone } from '../helpers/dokploy.helper';

export async function deployApplication(config: ReturnType<typeof getConfig>) {
  const application = await getOrCreateApplication({
    applicationId: config.applicationId,
    applicationName: config.applicationName,
    applicationDomain: config.applicationDomain,
    projectId: config.projectId,
    dockerPort: config.dockerPort,
  });
  core.debug(`Application: ${JSON.stringify(application, null, 2)}`);

  if (!application) {
    throw new Error('Cannot get or create application');
  }

  core.info(`Updating docker image of ${application.name}...`);
  await applicationSaveDockerProvider({
    body: {
      applicationId: application.applicationId,
      dockerImage: config.dockerImage,
      username: config.dockerUsername,
      password: config.dockerPassword,
    },
  });

  core.info(`Updating environment variables of ${application.name}...`);
  await applicationSaveEnvironment({
    body: {
      applicationId: application.applicationId,
      env: config.env.join('\n'),
    },
  });

  core.info(`Deploying ${application.name}...`);
  await applicationDeploy({
    parseAs: 'text',
    body: { applicationId: application.applicationId },
  });

  core.debug('Waiting for deployment to be done...');
  await waitForDeploymentToBeDone(application.applicationId, 'application');

  const applicationUrl = await getApplicationUrl(application.applicationId);

  return {
    appName: application.name,
    appUrl: applicationUrl,
    appSettingsUrl: `${config.dokployBaseUrl}/dashboard/project/${config.projectId}/services/application/${application.applicationId}`,
  };

  // if (config.commentPr) {
  //   core.debug('Setting pull request comment...');
  //   await setPullRequestComment(octokit, {
  //     appName: application.name,
  //     appUrl: applicationUrl,
  //     appSettingsUrl: `${config.dokployBaseUrl}/dashboard/project/${config.projectId}/services/application/${application.applicationId}`,
  //   });
  // }

  // core.info(
  //   `🚀 ${application.name} successfully deployed to ${applicationUrl}`,
  // );
}
