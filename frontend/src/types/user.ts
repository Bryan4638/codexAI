export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  current_level?: number;
  [key: string]: any;
}
