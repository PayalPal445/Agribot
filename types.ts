import React from 'react';

export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export enum MessageType {
  Text = 'text',
  Chart = 'chart',
  Error = 'error'
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  type: MessageType;
  chartData?: ChartDataPoint[]; // For market prices or weather data
  image?: string; // Base64 string for user uploaded images
  audioData?: string; // Base64 string for cached Cloud TTS audio
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

export interface User {
  name: string;
  location?: string;
}

export type ViewMode = 'dashboard' | 'chat' | 'settings' | 'profile';

export interface AppState {
  isLoggedIn: boolean;
  hasSelectedLanguage: boolean;
  language: string; // 'en', 'hi', 'es', 'mr', 'ta', 'te', 'gu'
  user: User | null;
  customLogo: string | null;
  currentView: ViewMode;
}

export interface AgriFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  requiresCamera?: boolean;
  category: 'Crop' | 'Market' | 'Tech' | 'Support' | 'Finance';
}

export interface AgriTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  promptPrefix: string;
  requiresCamera?: boolean;
}

// Specialist Connect Interfaces
export type SpecialistField = 'Crop' | 'Pest' | 'Veterinary' | 'Soil' | 'General';

export interface Specialist {
  id: string;
  name: string;
  field: SpecialistField;
  experience: string;
  languages: string[];
  isOnline: boolean;
  image: string; // URL or placeholder
}

export interface Consultation {
  id: string;
  specialistId: string;
  specialistName: string;
  type: 'Chat' | 'Call' | 'Callback';
  status: 'Pending' | 'Completed' | 'Accepted';
  problem: string;
  timestamp: number;
}