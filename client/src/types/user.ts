export interface User {
    id: string;
    email: string;
    name?:string;
    username: string;
    avatarUrl: string;
    githubId: string;
    createdAt: string;
  }
  
  export interface AuthenticatedUser {
    token: string;
    user: User;
  }