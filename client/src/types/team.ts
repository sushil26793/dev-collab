export interface Member {
    id: string;
    user:{
      username:string,
      id:string,
    }
    email: string;
    role: 'ADMIN' | 'DEVELOPER' | 'VIEWER';
    avatarUrl?: string;
  }
  
  export interface Team {
    id: string;
    name: string;
    description: string;
    owner: {
      id: string;
      username: string;
      email: string;
    };
    members: Member[];
    projects: number;
    createdAt: string;
    updatedAt: string;
  }

  
export interface NotificationType  {
  notificationId: string;
  invitationId:string;
  type: 'invitation' | 'alert' | 'system';
  content: string;
  status: 'read' | 'unread';
  createdAt: Date;
  recipientId:string;
  metadata?: {
    invitationId?: string;
    teamId?: string;
    inviterId?: string;
  };
};


  