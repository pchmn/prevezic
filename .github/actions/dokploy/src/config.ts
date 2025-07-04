import * as core from '@actions/core';

export function getConfig() {
  return {
    githubToken: core.getInput('github-token'),
    dokployBaseUrl: core.getInput('dokploy-base-url', { required: true }),
    dokployToken: core.getInput('dokploy-token', { required: true }),
    projectId: core.getInput('project-id', { required: true }),
    applicationId: core.getInput('application-id'),
    applicationName: core.getInput('application-name'),
    applicationDomain: core.getInput('application-domain'),
    dockerImage: core.getInput('docker-image'),
    dockerUsername: core.getInput('docker-username'),
    dockerPassword: core.getInput('docker-password'),
    dockerPort: core.getInput('docker-port'),
    env: core.getMultilineInput('env'),
    commentPr: core.getBooleanInput('comment-pr'),
    appUrl: core.getInput('app-url'),
    action: core.getInput('action', { required: true }) as 'deploy' | 'destroy',
    composeFile: core.getInput('compose-file'),
    composeId: core.getInput('compose-id'),
    composeName: core.getInput('compose-name'),
    composeDomain: getRecordFromMultilineInput(
      core.getMultilineInput('compose-domain'),
    ),
  };
}

function getRecordFromMultilineInput(input: string[]) {
  return input.reduce(
    (acc, line) => {
      const [key, value] = line.split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );
}
