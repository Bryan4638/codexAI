export interface Badge {
  id: string;
  name: string;
  icon: string;
}

export interface BadgeWithDescription extends Badge {
  description: string;
}

export interface UserBadgeData {
  badges: Badge[];
  unlocked: number; // Assuming unlocked is a count?
}
