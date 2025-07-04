import { composeOne } from '../../sdk/client';

import * as core from '@actions/core';
import { composeCreate, domainCreate, projectOne } from '../../sdk/client';
import type { Compose, Project } from '../../sdk/types';

export async function getOrCreateCompose({
  composeId,
  composeName,
  composeDomain,
  projectId,
}: {
  composeId: string;
  composeName: string;
  composeDomain?: Record<string, string>;
  projectId: string;
}) {
  const { compose: existingCompose } = await getCompose({
    composeId,
    composeName,
    projectId,
  });

  if (existingCompose) {
    return existingCompose;
  }

  core.info(`Creating compose ${composeName}...`);
  const { data: compose } = await composeCreate({
    body: { projectId, name: composeName },
  });

  if (compose) {
    if (composeDomain) {
      for (const [serviceName, domainAndPort] of Object.entries(
        composeDomain,
      )) {
        const [domain, port] = domainAndPort.split(':');
        await domainCreate({
          body: {
            serviceName,
            host: domain,
            composeId: (compose as Compose).composeId,
            https: true,
            certificateType: 'letsencrypt',
            port: Number.parseInt(port ?? '80'),
          },
        });
      }
    }
    return compose as Compose;
  }
}

export async function getCompose({
  composeId,
  composeName,
  projectId,
}: {
  composeId: string;
  composeName: string;
  projectId: string;
}) {
  if (composeId) {
    const { data: compose } = await composeOne({
      query: { composeId },
    });

    if (compose) {
      core.info(`Compose ${composeName} found`);
      return { compose: compose as Compose };
    }
  }

  const { data: project } = await projectOne({
    query: { projectId },
  });

  if (!project) {
    return {
      application: undefined,
      project: undefined,
    };
  }

  for (const composeItem of (project as Project).compose) {
    if (composeItem.name === composeName) {
      core.info(`Compose ${composeName} found`);
      return {
        compose: composeItem as Compose,
      };
    }
  }

  return {
    project: project as Project,
  };
}
