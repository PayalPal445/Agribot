import { Specialist } from '../types';

export const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Ramesh Gupta',
    field: 'Crop',
    experience: '15 Years',
    languages: ['en', 'hi', 'gu'],
    isOnline: true,
    image: 'https://ui-avatars.com/api/?name=Ramesh+Gupta&background=166534&color=fff'
  },
  {
    id: '2',
    name: 'Ms. Anita Deshmukh',
    field: 'Pest',
    experience: '8 Years',
    languages: ['en', 'hi', 'mr'],
    isOnline: true,
    image: 'https://ui-avatars.com/api/?name=Anita+Deshmukh&background=e11d48&color=fff'
  },
  {
    id: '3',
    name: 'Dr. S. Perumal',
    field: 'Veterinary',
    experience: '12 Years',
    languages: ['en', 'ta', 'te'],
    isOnline: false,
    image: 'https://ui-avatars.com/api/?name=S+Perumal&background=0284c7&color=fff'
  },
  {
    id: '4',
    name: 'Mr. Rajesh Patel',
    field: 'Soil',
    experience: '20 Years',
    languages: ['en', 'gu', 'hi'],
    isOnline: true,
    image: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=d97706&color=fff'
  },
  {
    id: '5',
    name: 'KVK Officer Sharma',
    field: 'General',
    experience: '10 Years',
    languages: ['en', 'hi', 'mr', 'gu', 'ta', 'te'],
    isOnline: true,
    image: 'https://ui-avatars.com/api/?name=KVK+Sharma&background=4b5563&color=fff'
  }
];

export const getExpertsByLanguage = (lang: string): Specialist[] => {
  // If english, return all, otherwise filter by language support
  // Also always return the KVK officer
  return MOCK_SPECIALISTS.filter(s => 
    s.languages.includes(lang) || s.languages.includes('en')
  );
};