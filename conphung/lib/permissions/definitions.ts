// Permission definitions - should match seed-permissions.ts
export const PERMISSIONS = {
  // Posts
  'post.view': 'View posts',
  'post.create': 'Create posts',
  'post.edit': 'Edit posts',
  'post.edit.own': 'Edit own posts',
  'post.delete': 'Delete posts',
  'post.publish': 'Publish posts',
  
  // Media
  'media.view': 'View media',
  'media.upload': 'Upload media',
  'media.delete': 'Delete media',
  'media.edit': 'Edit media',
  
  // Categories & Tags
  'category.view': 'View categories',
  'category.create': 'Create categories',
  'category.edit': 'Edit categories',
  'category.delete': 'Delete categories',
  'tag.view': 'View tags',
  'tag.create': 'Create tags',
  'tag.edit': 'Edit tags',
  'tag.delete': 'Delete tags',
  
  // Social Media
  'social_media.view': 'View social media',
  'social_media.connect': 'Connect platforms',
  'social_media.disconnect': 'Disconnect platforms',
  'social_media.post': 'Post to social media',
  'social_media.schedule': 'Schedule posts',
  'social_media.delete': 'Delete posts',
  'social_media.retry': 'Retry failed posts',
  
  // Users
  'user.view': 'View users',
  'user.create': 'Create users',
  'user.edit': 'Edit users',
  'user.delete': 'Delete users',
  'user.manage_roles': 'Manage roles',
  'user.manage_permissions': 'Manage permissions',
  
  // Teams
  'team.view': 'View teams',
  'team.create': 'Create teams',
  'team.edit': 'Edit teams',
  'team.delete': 'Delete teams',
  'team.manage_members': 'Manage team members',
  
  // Analytics
  'analytics.view': 'View analytics',
  'analytics.export': 'Export analytics',
  
  // Settings
  'settings.view': 'View settings',
  'settings.edit': 'Edit settings',
  'settings.system': 'System settings',
} as const

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.keys(PERMISSIONS),
  
  ADMIN: [
    'post.view', 'post.create', 'post.edit', 'post.delete', 'post.publish',
    'media.view', 'media.upload', 'media.edit', 'media.delete',
    'category.view', 'category.create', 'category.edit', 'category.delete',
    'tag.view', 'tag.create', 'tag.edit', 'tag.delete',
    'social_media.view', 'social_media.connect', 'social_media.disconnect',
    'social_media.post', 'social_media.schedule', 'social_media.delete', 'social_media.retry',
    'user.view', 'user.create', 'user.edit', 'user.delete', 'user.manage_roles',
    'team.view', 'team.create', 'team.edit', 'team.delete', 'team.manage_members',
    'analytics.view', 'analytics.export',
    'settings.view', 'settings.edit',
  ],
  
  EDITOR: [
    'post.view', 'post.create', 'post.edit', 'post.delete', 'post.publish',
    'media.view', 'media.upload', 'media.edit', 'media.delete',
    'category.view', 'category.create', 'category.edit',
    'tag.view', 'tag.create', 'tag.edit',
    'social_media.view', 'social_media.post', 'social_media.schedule',
    'analytics.view',
  ],
  
  MARKETING: [
    'post.view', 'post.create', 'post.edit.own',
    'media.view', 'media.upload',
    'category.view', 'tag.view',
    'social_media.view', 'social_media.connect', 'social_media.post', 
    'social_media.schedule', 'social_media.retry',
    'analytics.view', 'analytics.export',
  ],
  
  USER: [
    'post.view',
    'media.view',
    'category.view',
    'tag.view',
  ],
} as const

export type PermissionCode = keyof typeof PERMISSIONS
export type RoleCode = keyof typeof ROLE_PERMISSIONS

// Helper to get all permissions for a role
export function getPermissionsForRole(role: RoleCode): readonly string[] {
  return ROLE_PERMISSIONS[role] || []
}

// Helper to check if a role has a permission
export function roleHasPermission(role: RoleCode, permission: string): boolean {
  const permissions = getPermissionsForRole(role)
  return permissions.includes(permission)
}

// Get all permission codes
export function getAllPermissions(): string[] {
  return Object.keys(PERMISSIONS)
}

// Permission categories based on naming convention
export const PERMISSION_CATEGORIES = {
  post: 'Posts & Content',
  media: 'Media Library',
  category: 'Categories',
  tag: 'Tags',
  social_media: 'Social Media',
  user: 'Users',
  team: 'Teams',
  analytics: 'Analytics',
  settings: 'Settings',
} as const

// Get permissions by category (based on prefix)
export function getPermissionsByCategory(category: string): string[] {
  return Object.keys(PERMISSIONS).filter(code => code.startsWith(`${category}.`))
}
