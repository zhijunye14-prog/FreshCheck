
export enum FreshnessLevel {
  FRESH = '新鲜',
  AVERAGE = '一般',
  CRITICAL = '临界',
  SPOILED = '不建议食用'
}

export type StorageZone = 'fridge' | 'freezer';

export interface FreshnessDiagnostic {
  level: '非常新鲜' | '一般' | '已变质';
  visual: string;
  feel: string;
}

export interface IngredientInfo {
  id: string;
  name: string;
  category: string;
  selectionTips: string[];
  spoilageSigns: string[];
  storageAdvice: string;
  storageLife: string;
  icon: string;
  diagnostics: FreshnessDiagnostic[];
}

export interface AssessmentResult {
  ingredientName: string;
  category: string;
  freshness: FreshnessLevel;
  remainingDays: string;
  reasoning: string;
  cookingTips: string;
  timestamp: number;
  icon: string;
}

export interface HistoryItem extends AssessmentResult {
  id: string;
  imageUrl?: string;
}

export interface FridgeItem {
  id: string;
  name: string;
  category: string;
  addedDate: number;
  expiryDate: number;
  remainingDays: number;
  icon: string;
  quantity: number;
  unit: string;
  zone: StorageZone;
  cookingTips?: string;
  storageAdvice?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  region: 'north' | 'south' | 'unknown';
}
