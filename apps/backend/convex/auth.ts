import {
  type AuthFunctions,
  BetterAuth,
  convexAdapter,
} from '@convex-dev/better-auth';
import { convex, crossDomain } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import { components, internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { type GenericCtx, query } from './_generated/server';

// Typesafe way to pass Convex functions defined in this file
const authFunctions: AuthFunctions = internal.auth;
const siteUrl = process.env.SITE_URL || 'http://localhost:3500';

// Initialize the component
export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
  // verbose: true,
});

export const createAuth = (ctx: GenericCtx) =>
  // Configure your Better Auth instance here
  betterAuth({
    baseURL: process.env.CONVEX_SITE_URL,
    database: convexAdapter(ctx, betterAuthComponent),

    trustedOrigins: [siteUrl],
    // Simple non-verified email/password to get started
    // socialProviders: {
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID || '',
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    //   },
    // },
    plugins: [
      // The Convex plugin is required
      convex(),
      // The cross domain plugin is required for client side frameworks
      crossDomain({
        siteUrl,
      }),
      anonymous(),
    ],
  });

export const { createUser, deleteUser, updateUser, createSession } =
  betterAuthComponent.createAuthFunctions({
    // Must create a user and return the user id
    onCreateUser: async (ctx, user) => {
      const userId = await ctx.db.insert('users', {});

      // The user id must be returned
      return userId;
    },

    onUpdateUser: async (ctx, user) => {
      await ctx.db.patch(user.userId as Id<'users'>, {});
    },

    // Delete the user when they are deleted from Better Auth
    // You can also omit this and use Better Auth's
    // auth.api.deleteUser() function to trigger user deletion
    // from within your own user deletion logic.
    onDeleteUser: async (ctx, userId) => {
      await ctx.db.delete(userId as Id<'users'>);

      // Optionally delete any related data
    },
  });

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get user data from Better Auth - email, name, image, etc.
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    // Get user data from your application's database
    // (skip this if you have no fields in your users table schema)
    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    return {
      ...user,
      ...userMetadata,
    };
  },
});
