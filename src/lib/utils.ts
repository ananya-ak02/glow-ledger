export { cn } from 'cn';

/**
 * Truncate text to a max token budget (rough estimate: 1 token ≈ 4 chars).
 * Used to stay within AI model limits.
 */
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n[...truncated to fit token budget]';
}

/**
 * Deduplicate an array of strings (case-insensitive)
 */
export function dedupeStrings(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((s) => {
    const lower = s.toLowerCase().trim();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter.
 * Used for AI API retry logic.
 */
export function getBackoffDelay(
  attempt: number,
  baseMs = 1000,
  maxMs = 30000
): number {
  const delay = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  // Add jitter (±25%)
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Get today's date as YYYY-MM-DD string (UTC)
 */
export function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
