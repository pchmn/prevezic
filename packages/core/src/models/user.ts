export type UserType = 'anonymous' | 'account';

export type UserRole = 'owner' | 'editor' | 'member';

export interface UserDocument {
  type: UserType;
  rights?: Record<string, UserRole>;
}
