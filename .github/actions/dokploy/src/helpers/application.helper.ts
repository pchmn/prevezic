import * as core from '@actions/core';
import {
  applicationCreate,
  applicationOne,
  domainByApplicationId,
  domainCreate,
  projectOne,
} from '../../sdk/client';
import type { Application, Domain, Project } from '../../sdk/types';
import { generateDomain } from './dokploy.helper';

export async function getOrCreateApplication({
  applicationId,
  applicationName,
  applicationDomain,
  projectId,
  dockerPort,
}: {
  applicationId: string;
  applicationName: string;
  applicationDomain?: string;
  projectId: string;
  dockerPort: string;
}) {
  const { application: existingApplication, project } = await getApplication({
    applicationId,
    applicationName,
    projectId,
  });

  if (existingApplication) {
    return existingApplication;
  }

  core.info(`Creating application ${applicationName}...`);
  const { data: application } = await applicationCreate({
    body: {
      projectId,
      name: applicationName,
      appName: applicationName,
    },
  });

  if (application) {
    const domain =
      applicationDomain ||
      (await generateDomain({
        appName: (application as Application).name,
        projectName: (project as Project).name,
      }));

    await domainCreate({
      body: {
        host: domain,
        applicationId: (application as Application).applicationId,
        https: true,
        certificateType: 'letsencrypt',
        port: Number.parseInt(dockerPort ?? '80'),
      },
    });
    return application as Application;
  }
}

export async function getApplication({
  applicationId,
  applicationName,
  projectId,
}: {
  applicationId: string;
  applicationName: string;
  projectId: string;
}) {
  if (applicationId) {
    const { data: application } = await applicationOne({
      query: { applicationId },
    });

    if (application) {
      core.info(`Application ${applicationName} found`);
      return {
        application: application as Application,
      };
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

  for (const application of (project as Project).applications) {
    if (application.name === applicationName) {
      core.info(`Application ${applicationName} found`);
      return {
        application,
      };
    }
  }

  return {
    project: project as Project,
  };
}

export async function getApplicationUrl(applicationId: string) {
  const { data } = await domainByApplicationId({
    query: { applicationId },
  });
  return `https://${(data as Domain[])[0].host}`;
}
