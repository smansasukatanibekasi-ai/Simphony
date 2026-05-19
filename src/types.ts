import { Timestamp } from 'firebase/firestore';

export enum ConsultationCategory {
  BULLYING = 'Bullying',
  KELUARGA = 'Keluarga',
  CIRCLE = 'Circle Pertemanan',
  PRIBADI = 'Masalah Pribadi',
  DIRECT_BK = 'Direct Guru BK'
}

export enum ConsultationStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  treeLevel: number;
  treeCount?: number;
  lastWatered: Timestamp | null;
  createdAt?: Timestamp;
  isAdmin?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
}

export interface Post {
  id?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
  comments: Comment[];
}

export interface Message {
  text: string;
  senderId: string;
  senderName: string;
  createdAt: Timestamp;
}

export interface Consultation {
  id?: string;
  userId: string;
  userName: string;
  category: ConsultationCategory;
  status: ConsultationStatus;
  messages: Message[];
  updatedAt: Timestamp;
}

export interface PeerMessage {
  id?: string;
  senderId: string;
  senderName: string;
  receiverId: 'Abdul' | 'Zahra' | 'Raghat';
  content: string;
  response?: string;
  createdAt: Timestamp;
}

export interface MoodEntry {
  id?: string;
  userId: string;
  moodScore: number; // 0-10
  note: string;
  createdAt: Timestamp;
}

export interface Counselor {
  name: string;
  position: string;
  id: string;
}

export interface PeerSupporter {
  name: string;
  id: string;
  email: string;
}
