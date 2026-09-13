export type MediaType = "poster" | "infografis" | "flashcard" | "slide" | "video";

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface PosterElement {
  step: number;
  title: string;
  description: string;
  icon?: string;
  tag?: string;
}

export interface FlashcardItem {
  id: number;
  term: string;
  category: string;
  visualPrompt: string;
  definition: string;
  example: string;
  quizQuestion: string;
  quizAnswer: string;
}

export interface SlideItem {
  id: number;
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  visualConcept: string;
  teacherNote: string;
  icon?: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  time: string;
  title: string;
  visualDescription: string;
  voiceover: string;
  soundFx: string;
}

export interface GeneratedMediaData {
  mediaType: MediaType;
  topic: string;
  title: string;
  subtitle: string;
  theme?: string;
  category?: string;
  badge?: string;
  conceptSummary: string;
  funFact?: string;
  palette?: PaletteColor[];
  posterElements?: PosterElement[];
  flashcards?: FlashcardItem[];
  slides?: SlideItem[];
  storyboard?: StoryboardScene[];
  rawPrompt?: string;
  imageUrl?: string;
}
