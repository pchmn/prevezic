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
    updatedAt: v.optional(v.number()),
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
    updatedAt: v.optional(v.number()),
  })
    .index('by_project', ['projectId'])
    .index('by_user', ['userId'])
    .index('by_project_and_user', ['projectId', 'userId']),

  // Medias table - uploaded photos for each project
  medias: defineTable({
    projectId: v.id('projects'),
    uploaderId: v.id('users'),
    storageId: v.id('_storage'),
    contentType: v.string(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
    date: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    // Photo metadata
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    // GPS coordinates if available
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    // EXIF data
    cameraMake: v.optional(v.string()),
    cameraModel: v.optional(v.string()),
  })
    .index('by_project', ['projectId'])
    .index('by_uploader', ['uploaderId'])
    // Compound index for filtering by project and then ordering by date
    .index('by_project_and_date', ['projectId', 'date']),
});
