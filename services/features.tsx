import React from 'react';
import { 
  Bug, CloudSun, Tractor, BookOpen, LineChart, Droplets, Calendar, 
  Wallet, TrendingUp, PhoneCall, ShieldCheck, Sprout, ClipboardCheck, 
  ThermometerSun, Leaf, Warehouse, Truck, Users, Activity, ScanLine 
} from 'lucide-react';
import { AgriFeature } from '../types';

export const AGRI_FEATURES: AgriFeature[] = [
  {
    id: 'disease_detect',
    title: 'Disease Detection',
    description: 'Identify crop diseases using AI camera analysis.',
    icon: <ScanLine className="w-6 h-6 text-red-500" />,
    prompt: 'I want to detect a disease in my crop. I will upload a photo.',
    requiresCamera: true,
    category: 'Tech'
  },
  {
    id: 'weather',
    title: 'Weather Forecast',
    description: 'Real-time rain, temperature & humidity alerts.',
    icon: <CloudSun className="w-6 h-6 text-blue-500" />,
    prompt: 'What is the detailed weather forecast for my farm location for the next 7 days?',
    category: 'Crop'
  },
  {
    id: 'market_price',
    title: 'Mandi Prices',
    description: 'Live market rates for crops in nearby mandis.',
    icon: <LineChart className="w-6 h-6 text-green-600" />,
    prompt: 'What are the current market prices (Mandi Bhav) for major crops in my district?',
    category: 'Market'
  },
  {
    id: 'crop_calendar',
    title: 'Crop Calendar',
    description: 'Month-wise farming activities planner.',
    icon: <Calendar className="w-6 h-6 text-orange-500" />,
    prompt: 'Create a crop calendar for this month. What tasks should I prioritize?',
    category: 'Crop'
  },
  {
    id: 'gov_schemes',
    title: 'Govt Schemes',
    description: 'Latest subsidies & financial aid for farmers.',
    icon: <BookOpen className="w-6 h-6 text-purple-600" />,
    prompt: 'List the latest government agricultural schemes and subsidies I am eligible for.',
    category: 'Finance'
  },
  {
    id: 'soil_health',
    title: 'Soil Health',
    description: 'Recommendations for soil testing & nutrients.',
    icon: <Activity className="w-6 h-6 text-amber-700" />,
    prompt: 'How do I improve my soil health? Recommend fertilizers based on general soil types.',
    category: 'Crop'
  },
  {
    id: 'pest_control',
    title: 'Pest Control',
    description: 'Organic & chemical solutions for pest attacks.',
    icon: <Bug className="w-6 h-6 text-red-600" />,
    prompt: 'Suggest effective pest control methods (organic and chemical) for common pests.',
    category: 'Crop'
  },
  {
    id: 'water_mgmt',
    title: 'Water Mgmt',
    description: 'Smart irrigation & water conservation tips.',
    icon: <Droplets className="w-6 h-6 text-cyan-500" />,
    prompt: 'Give me tips for efficient water management and irrigation techniques.',
    category: 'Tech'
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer Calc',
    description: 'Calculate exact fertilizer dosage for crops.',
    icon: <ClipboardCheck className="w-6 h-6 text-emerald-600" />,
    prompt: 'Help me calculate the right amount of NPK fertilizer for one acre of land.',
    category: 'Crop'
  },
  {
    id: 'expert_connect',
    title: 'Expert Connect',
    description: 'Chat or call with agriculture specialists.',
    icon: <PhoneCall className="w-6 h-6 text-rose-500" />,
    prompt: 'I need to connect with an agriculture expert for a consultation.',
    category: 'Support'
  },
  {
    id: 'expense_track',
    title: 'Expense Tracker',
    description: 'Monitor farm income and daily expenses.',
    icon: <Wallet className="w-6 h-6 text-indigo-600" />,
    prompt: 'I want to track my farm expenses. Help me categorize costs like seeds, labor, and fuel.',
    category: 'Finance'
  },
  {
    id: 'yield_predict',
    title: 'Yield Prediction',
    description: 'Estimate harvest quantity based on conditions.',
    icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
    prompt: 'Can you help predict my crop yield based on current weather and soil conditions?',
    category: 'Tech'
  },
  {
    id: 'machinery',
    title: 'Machinery & Fuel',
    description: 'Maintenance tips and fuel saving guide.',
    icon: <Tractor className="w-6 h-6 text-slate-600" />,
    prompt: 'Provide maintenance tips for tractors and farm machinery to save fuel.',
    category: 'Tech'
  },
  {
    id: 'organic_farm',
    title: 'Organic Farming',
    description: 'Guide to natural farming and certification.',
    icon: <Leaf className="w-6 h-6 text-green-500" />,
    prompt: 'Guide me on how to start organic farming and get certification.',
    category: 'Crop'
  },
  {
    id: 'livestock',
    title: 'Livestock Care',
    description: 'Health & feed management for cattle.',
    icon: <ThermometerSun className="w-6 h-6 text-orange-600" />,
    prompt: 'What are the best practices for managing cattle health and feed?',
    category: 'Crop'
  },
  {
    id: 'storage',
    title: 'Storage & Ware',
    description: 'Post-harvest storage and cold chain info.',
    icon: <Warehouse className="w-6 h-6 text-amber-800" />,
    prompt: 'How can I store my harvested crops properly to prevent spoilage?',
    category: 'Market'
  },
  {
    id: 'logistics',
    title: 'Logistics',
    description: 'Transportation and supply chain support.',
    icon: <Truck className="w-6 h-6 text-blue-700" />,
    prompt: 'Find me information on transporting agricultural goods to the market.',
    category: 'Market'
  },
  {
    id: 'crop_insurance',
    title: 'Crop Insurance',
    description: 'Protect crops against natural calamities.',
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    prompt: 'Explain the process to apply for crop insurance (Pradhan Mantri Fasal Bima Yojana).',
    category: 'Finance'
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Connect with other farmers and forums.',
    icon: <Users className="w-6 h-6 text-pink-500" />,
    prompt: 'Are there any farmer communities or forums I can join?',
    category: 'Support'
  },
  {
    id: 'seed_vault',
    title: 'Seed Selection',
    description: 'Choose the best seed varieties for your region.',
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    prompt: 'How do I select the best high-yield seed varieties for my soil type?',
    category: 'Crop'
  }
];