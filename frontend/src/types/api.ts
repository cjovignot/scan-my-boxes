import { Example } from "./example";

/**
 * Structure standard de réponse d'API
 */
export interface ApiResponse<T = unknown> {
  message?: string;
  document?: T;
  documents?: T[]; // pour les endpoints de liste
  error?: string;
}

/**
 * Exemple de réponse spécifique à la création d’un Example
 */
export type CreateExampleResponse = ApiResponse<Example>;
