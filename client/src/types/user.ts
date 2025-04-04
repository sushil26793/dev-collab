export interface User {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
    githubId: string;
    createdAt: string;
  }
  
  export interface AuthenticatedUser {
    token: string;
    user: User;
  }