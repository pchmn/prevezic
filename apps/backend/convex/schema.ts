import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table - basic profile information
  users: defineTable({
    name: v.optional(v.string()),
  }).index('by_name', ['name']),

  // Projects table - private photo collections for events
  projects: defineTable({
    name: v.string(), // e.g., "Anniversaire Paul", "Wedding Reception"
    description: v.optional(v.string()),
    creatorId: v.id('users'),
    invitationToken: v.string(), // unique token for invitation links
    isActive: v.boolean(), // whether project is still accepting photos
    coverPhotoId: v.optional(v.id('_storage')), // featured photo for the project
  })
    .index('by_creator', ['creatorId'])
    .index('by_invitation_token', ['invitationToken'])
    .index('by_active', ['isActive']),

  // Project members - who can access and contribute to each project
  members: defineTable({
    projectId: v.id('projects'),
    userId: v.id('users'),
    role: v.union(v.literal('creator'), v.literal('member')),
    joinedViaInvitation: v.boolean(),
  })
    .index('by_project', ['projectId'])
    .index('by_user', ['userId'])
    .index('by_project_and_user', ['projectId', 'userId']),

  // Photos table - uploaded photos for each project
  photos: defineTable({
    projectId: v.id('projects'),
    uploaderId: v.id('users'),
    storageId: v.id('_storage'),
    contentType: v.string(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
    // Photo metadata
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    // GPS coordinates if available
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    // EXIF data
    cameraMake: v.optional(v.string()),
    cameraModel: v.optional(v.string()),
  })
    .index('by_project', ['projectId'])
    .index('by_uploader', ['uploaderId']),
});
