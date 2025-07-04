import * as core from '@actions/core';
import * as github from '@actions/github';
import { client } from '../sdk/client';
import { getConfig } from './config';
import { deployApplication } from './deploy/deploy-application';
import { deployCompose } from './deploy/deploy-compose';
import { destroyApplication } from './destroy/destroy-application';
import { destroyCompose } from './destroy/destroy-compose';
import { setPullRequestComment } from './github/comment-pr';
import { detectApplicationType } from './helpers/dokploy.helper';

const config = getConfig();
let octokit: ReturnType<typeof github.getOctokit>;
if (config.githubToken) {
  octokit = github.getOctokit(config.githubToken);
}
client.setConfig({
  baseUrl: `${config.dokployBaseUrl}/api`,
  headers: {
    'x-api-key': `${config.dokployToken}`,
  },
  throwOnError: true,
});

async function main() {
  try {
    if (config.action === 'deploy') {
      await deploy();
    } else {
      await destroy();
    }
  } catch (error) {
    core.error(error.stack);
    core.setFailed(error.message);
  }
}

async function deploy() {
  const applicationType = detectApplicationType(config);
  const { appName, appUrl, appSettingsUrl } =
    applicationType === 'application'
      ? await deployApplication(config)
      : await deployCompose(config);

  if (config.commentPr) {
    core.debug('Setting pull request comment...');
    await setPullRequestComment(octokit, {
      appName,
      appUrl,
      appSettingsUrl,
    });
  }
  core.info(`🚀 ${appName} successfully deployed to ${appUrl}`);
}

async function destroy() {
  const applicationType = detectApplicationType(config);

  const { appName } =
    applicationType === 'application'
      ? await destroyApplication(config)
      : await destroyCompose(config);

  core.info(`🚀 ${appName} successfully destroyed`);
}

main();
