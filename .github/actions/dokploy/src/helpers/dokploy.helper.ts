import { applicationOne, composeOne, serverPublicIp } from '../../sdk/client';
import type { Application, Compose } from '../../sdk/types';
import type { getConfig } from '../config';
import { toKebabCase } from '../utils/string';

export function detectApplicationType(config: ReturnType<typeof getConfig>) {
  if (config.applicationId || config.applicationName) {
    return 'application';
  }
  if (config.composeId || config.composeName) {
    return 'compose';
  }
  throw new Error(
    'Please provide an application (id or name) or a compose (id or name)',
  );
}

export async function generateDomain({
  appName,
  projectName,
  domain = 'sslip.io',
}: {
  appName: string;
  projectName: string;
  domain?: string;
}) {
  const subdomain = toKebabCase(`${projectName}-${appName}`);

  if (domain === 'sslip.io') {
    const { data: publicIp } = await serverPublicIp();
    return `${subdomain}.${(publicIp as string).replace(/\./g, '-')}.${domain}`;
  }

  return `${subdomain}.${domain}`;
}

export async function waitForDeploymentToBeDone(
  id: string,
  type: 'application' | 'compose',
) {
  const res = await (type === 'application'
    ? applicationOne({
        query: { applicationId: id },
      })
    : composeOne({
        query: { composeId: id },
      }));
  const app = res.data as Application | Compose | undefined;
  if (!app) {
    throw new Error('Application not found');
  }
  const lastDeployment = getLastDeployment(app);
  if (lastDeployment.status === 'error') {
    throw new Error('Application deployment failed');
  }
  if (lastDeployment.status === 'done') {
    return;
  }

  // wait for 5 seconds before checking again
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await waitForDeploymentToBeDone(id, type);
}

function getLastDeployment(app: Application | Compose) {
  return app.deployments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
}
