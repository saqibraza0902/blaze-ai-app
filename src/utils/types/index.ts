import { RefObject } from "react";

interface CustomFields {
  "last-name": string;
  "first-name": string;
  company: string;
  personal: string;
  behaviour: string;
  "business-description": string;
}

interface AuthProvider {}

export interface IUser {
  auth: {
    email: string;
    hasPassword: boolean;
    providers: AuthProvider[];
  };
  createdAt: string;
  customFields: CustomFields;
  id: string;
  loginRedirect: string;
  metaData: Record<string, any>;
  permissions: string[];
  planConnections: any[];
  profileImage: string;
  stripeCustomerId: string | null;
  verified: boolean;
  _comments: Record<string, any>;
}

export interface ITokenPayload {
  id: string;
  type: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
export interface IMessageUser {
  email: string;
  first_name: string;
  id: string;
  member_id?: string;
  profile_image: string;
}
export interface IMessages {
  model_used?: string;
  content: string;
  image_path?: string;
  image?: {
    download_link: string;
    file_name: string;
  };
  loading: boolean;
  id?: string;
  sender: IMessageUser;
  citations: string[];
  pdf?: {
    download_link: string;
    file_name: string;
  };
  timestamp: string;
}

export interface IConversations {
  conversation_id: string;
  latest_message: string;
  timestamp: string;
  conversation_name: string;
  folder_color: string | null;
  folder_id: number | null;
  folder_name: string | null;
}
export interface IFolder {
  id: number;
  name: string;
  color: string;
  owner: boolean;
}

export interface IFolderItem {
  folder: IFolder;
  accordionOpen: number | null;
  setAccordionOpen: (id: number | any) => void;
  moveConvo: (convo: IConversations, folder?: IFolder | null) => void;
  hoveredConvo: string | null;
  popoverOpen: string | null;
  convoIconRef: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  convoPopoverRef: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  setHoveredConvo: (convoId: string | null) => void;
  handleMouseLeave: (convoId: string) => void;
  handleIconClick: (id: string) => void;
  toggleDelete: (id: string) => void;
  id: string | null;
  editOpen: (folder: IFolder) => void;
  dragId?: string | null;
  folderDelDialouge: (folderId: number) => void;
  sharedUsers: (f: IFolder | null, c: IConversations | null) => void;
}
export interface IConversationItem {
  convo: IConversations;
  id: string | null;
  hoveredConvo: string | null;
  setHoveredConvo: (id: string | null) => void;
  handleMouseLeave: (id: string) => void;
  popoverOpen: string | null;
  handleIconClick: (id: string) => void;
  moveConvo: (convo: IConversations, folder?: IFolder | null) => void;
  toggleDelete: (id: string) => void;
  convoIconRef: RefObject<HTMLDivElement[]> | any;
  convoPopoverRef: RefObject<HTMLDivElement[]> | any;
}

export interface IParticipant {
  email: string;
  id: string;
  is_admin: boolean;
}
