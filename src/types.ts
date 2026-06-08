/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string; // lucide icon name
  highlights: string[];
  gradientClass: string;
  imageUrl?: string;
}

export type GalleryCategory = 'ALL' | 'PODCAST' | 'CREATIVE' | 'SOCIAL';

export interface GalleryItem {
  id: string;
  title: string;
  client: string;
  category: GalleryCategory;
  description: string;
  image: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    spotify?: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  timestamp: string;
  read: boolean;
}
