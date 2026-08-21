export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Module {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'pdf' | 'assignment' | 'zoom';
  videoId?: string; // YouTube video ID
  pdfUrl?: string;
  zoomLink?: string;
  assignmentLink?: string;
  content?: string;
  order: number;
  viewCount?: number;
}

export interface VideoAnalytics {
  lessonId: string;
  userId: string;
  watchedAt: Date;
  watchDuration?: number;
}

export interface OnlineUser {
  uid: string;
  email: string;
  lastSeen: Date;
}
