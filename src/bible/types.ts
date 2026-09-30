import type { PassageReference } from '../content/schema';
export type Inline =
  | { kind: 'text'; text: string; poem?: number; wordsOfJesus?: boolean }
  | { kind: 'break' }
  | { kind: 'heading'; text: string }
  | { kind: 'note'; id: number; text: string };
export type Verse = {
  chapter: number;
  number: number;
  content: Inline[];
  paragraphStart: boolean;
  headings: string[];
  subtitle: Inline[];
};
export type Passage = {
  reference: PassageReference;
  translation: { id: string; name: string; attribution: string; url: string };
  verses: Verse[];
};
export interface BibleProvider {
  getPassage(
    reference: PassageReference,
    translation?: string,
  ): Promise<Passage>;
  clearCache(): void;
}
