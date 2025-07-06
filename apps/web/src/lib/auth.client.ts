import {
  convexClient,
  crossDomainClient,
} from '@convex-dev/better-auth/client/plugins';
import { anonymousClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { appConfig } from '~/config/config';

export const authClient = createAuthClient({
  baseURL: appConfig.convexSiteUrl,
  plugins: [convexClient(), crossDomainClient(), anonymousClient()],
});
