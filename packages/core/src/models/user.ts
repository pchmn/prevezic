export type UserRole = 'owner' | 'editor' | 'member';

export interface UserDocument {
  rights?: Record<string, UserRole>;
}
