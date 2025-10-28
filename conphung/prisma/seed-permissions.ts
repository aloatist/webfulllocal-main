import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

export const PERMISSIONS = {
  // Posts
  'post.view': { name: 'View posts', category: 'post', description: 'Can view all posts' },
  'post.create': { name: 'Create posts', category: 'post', description: 'Can create new posts' },
  'post.edit': { name: 'Edit posts', category: 'post', description: 'Can edit all posts' },
  'post.edit.own': { name: 'Edit own posts', category: 'post', description: 'Can only edit own posts' },
  'post.delete': { name: 'Delete posts', category: 'post', description: 'Can delete posts' },
  'post.publish': { name: 'Publish posts', category: 'post', description: 'Can publish posts' },
  
  // Media
  'media.view': { name: 'View media', category: 'media', description: 'Can view media library' },
  'media.upload': { name: 'Upload media', category: 'media', description: 'Can upload media files' },
  'media.delete': { name: 'Delete media', category: 'media', description: 'Can delete media files' },
  'media.edit': { name: 'Edit media', category: 'media', description: 'Can edit media metadata' },
  
  // Categories & Tags
  'category.view': { name: 'View categories', category: 'content', description: 'Can view categories' },
  'category.create': { name: 'Create categories', category: 'content', description: 'Can create categories' },
  'category.edit': { name: 'Edit categories', category: 'content', description: 'Can edit categories' },
  'category.delete': { name: 'Delete categories', category: 'content', description: 'Can delete categories' },
  'tag.view': { name: 'View tags', category: 'content', description: 'Can view tags' },
  'tag.create': { name: 'Create tags', category: 'content', description: 'Can create tags' },
  'tag.edit': { name: 'Edit tags', category: 'content', description: 'Can edit tags' },
  'tag.delete': { name: 'Delete tags', category: 'content', description: 'Can delete tags' },
  
  // Social Media
  'social_media.view': { name: 'View social media', category: 'social_media', description: 'Can view social media dashboard' },
  'social_media.connect': { name: 'Connect platforms', category: 'social_media', description: 'Can connect social media platforms' },
  'social_media.disconnect': { name: 'Disconnect platforms', category: 'social_media', description: 'Can disconnect social media platforms' },
  'social_media.post': { name: 'Post to social media', category: 'social_media', description: 'Can post to social media' },
  'social_media.schedule': { name: 'Schedule posts', category: 'social_media', description: 'Can schedule social media posts' },
  'social_media.delete': { name: 'Delete posts', category: 'social_media', description: 'Can delete social media posts' },
  'social_media.retry': { name: 'Retry failed posts', category: 'social_media', description: 'Can retry failed posts' },
  
  // Users
  'user.view': { name: 'View users', category: 'user', description: 'Can view users' },
  'user.create': { name: 'Create users', category: 'user', description: 'Can create users' },
  'user.edit': { name: 'Edit users', category: 'user', description: 'Can edit users' },
  'user.delete': { name: 'Delete users', category: 'user', description: 'Can delete users' },
  'user.manage_roles': { name: 'Manage roles', category: 'user', description: 'Can manage user roles' },
  'user.manage_permissions': { name: 'Manage permissions', category: 'user', description: 'Can manage user permissions' },
  
  // Teams
  'team.view': { name: 'View teams', category: 'team', description: 'Can view teams' },
  'team.create': { name: 'Create teams', category: 'team', description: 'Can create teams' },
  'team.edit': { name: 'Edit teams', category: 'team', description: 'Can edit teams' },
  'team.delete': { name: 'Delete teams', category: 'team', description: 'Can delete teams' },
  'team.manage_members': { name: 'Manage team members', category: 'team', description: 'Can manage team members' },
  
  // Analytics
  'analytics.view': { name: 'View analytics', category: 'analytics', description: 'Can view analytics dashboard' },
  'analytics.export': { name: 'Export analytics', category: 'analytics', description: 'Can export analytics data' },
  
  // Settings
  'settings.view': { name: 'View settings', category: 'settings', description: 'Can view settings' },
  'settings.edit': { name: 'Edit settings', category: 'settings', description: 'Can edit settings' },
  'settings.system': { name: 'System settings', category: 'settings', description: 'Can edit system settings' },
} as const

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.keys(PERMISSIONS), // All permissions
  
  ADMIN: [
    // Posts
    'post.view', 'post.create', 'post.edit', 'post.delete', 'post.publish',
    // Media
    'media.view', 'media.upload', 'media.edit', 'media.delete',
    // Categories & Tags
    'category.view', 'category.create', 'category.edit', 'category.delete',
    'tag.view', 'tag.create', 'tag.edit', 'tag.delete',
    // Social Media
    'social_media.view', 'social_media.connect', 'social_media.disconnect',
    'social_media.post', 'social_media.schedule', 'social_media.delete', 'social_media.retry',
    // Users
    'user.view', 'user.create', 'user.edit', 'user.delete', 'user.manage_roles',
    // Teams
    'team.view', 'team.create', 'team.edit', 'team.delete', 'team.manage_members',
    // Analytics
    'analytics.view', 'analytics.export',
    // Settings
    'settings.view', 'settings.edit',
  ],
  
  EDITOR: [
    // Posts
    'post.view', 'post.create', 'post.edit', 'post.delete', 'post.publish',
    // Media
    'media.view', 'media.upload', 'media.edit', 'media.delete',
    // Categories & Tags
    'category.view', 'category.create', 'category.edit',
    'tag.view', 'tag.create', 'tag.edit',
    // Social Media
    'social_media.view', 'social_media.post', 'social_media.schedule',
    // Analytics
    'analytics.view',
  ],
  
  MARKETING: [
    // Posts
    'post.view', 'post.create', 'post.edit.own',
    // Media
    'media.view', 'media.upload',
    // Categories & Tags
    'category.view', 'tag.view',
    // Social Media
    'social_media.view', 'social_media.connect', 'social_media.post', 
    'social_media.schedule', 'social_media.retry',
    // Analytics
    'analytics.view', 'analytics.export',
  ],
  
  USER: [
    'post.view',
    'media.view',
    'category.view',
    'tag.view',
  ],
}

export async function seedPermissions() {
  console.log('🔐 Seeding permissions...')

  // Create permissions
  for (const [code, data] of Object.entries(PERMISSIONS)) {
    const existing = await prisma.permission.findUnique({
      where: { code },
    })

    if (!existing) {
      await prisma.permission.create({
        data: {
          id: nanoid(),
          code,
          name: data.name,
          description: data.description,
          category: data.category,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log(`  ✅ Permission created: ${code}`)
    }
  }

  // Create role definitions
  for (const [roleCode, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const existing = await prisma.roleDefinition.findUnique({
      where: { code: roleCode },
    })

    const roleName = roleCode.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')

    if (!existing) {
      await prisma.roleDefinition.create({
        data: {
          id: nanoid(),
          code: roleCode,
          name: roleName,
          permissions,
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log(`  ✅ Role created: ${roleCode} with ${permissions.length} permissions`)
    } else {
      // Update permissions if role exists
      await prisma.roleDefinition.update({
        where: { code: roleCode },
        data: {
          permissions,
          updatedAt: new Date(),
        },
      })
      console.log(`  ✅ Role updated: ${roleCode}`)
    }
  }

  console.log('✅ Permissions seeding completed!')
}
