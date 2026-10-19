import type { RedditSnippet, ReviewSnippet } from '@/types/database';
import { truncateToTokenBudget } from '@/lib/utils';

interface SearchResult {
  redditSnippets: RedditSnippet[];
  reviewSnippets: ReviewSnippet[];
  sourceLinks: string[];
}

/**
 * Clean and sanitize untrusted review/search text.
 * Prevents prompt injection by stripping instruction prefixes.
 */
export function sanitizeSnippet(text: string): string {
  return text
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/(system prompt|ignore previous instructions|as an AI|DAN:)/gi, '[redacted]')
    .trim();
}

/**
 * Fetch public Reddit discussion snippets for a skincare product.
 * Uses public Reddit JSON search endpoints or Tavily if configured.
 */
export async function searchCommunityReviews(
  productName: string,
  userPastedSnippet?: string
): Promise<SearchResult> {
  const redditSnippets: RedditSnippet[] = [];
  const reviewSnippets: ReviewSnippet[] = [];
  const sourceLinks: string[] = [];

  // 1. If user provided their own pasted review/ingredient snippet, treat as first-class input
  if (userPastedSnippet && userPastedSnippet.trim()) {
    const cleanUserText = sanitizeSnippet(userPastedSnippet);
    reviewSnippets.push({
      source: 'User Provided Notes',
      snippet: truncateToTokenBudget(cleanUserText, 500),
      rating: null,
      url: null,
      trust_note: 'Direct user provided product review/ingredient text',
    });
  }

  // 2. Query Tavily Search API if key is set
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (tavilyKey && !tavilyKey.startsWith('your-')) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const query = `${productName} skincare review reddit site:reddit.com/r/SkincareAddiction OR site:reddit.com/r/AsianBeauty`;
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: 'basic',
          max_results: 3,
          include_answer: false,
        }),
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data?.results && Array.isArray(data.results)) {
          for (const item of data.results) {
            const cleanContent = sanitizeSnippet(item.content || item.title || '');
            if (cleanContent) {
              sourceLinks.push(item.url);
              if (item.url?.includes('reddit.com')) {
                redditSnippets.push({
                  subreddit: item.url.includes('AsianBeauty') ? 'r/AsianBeauty' : 'r/SkincareAddiction',
                  post_title: sanitizeSnippet(item.title || 'Community Discussion'),
                  snippet: cleanContent.slice(0, 300),
                  url: item.url,
                  upvotes: null,
                  date: null,
                });
              } else {
                reviewSnippets.push({
                  source: 'Web Discussion',
                  snippet: cleanContent.slice(0, 300),
                  rating: null,
                  url: item.url,
                  trust_note: 'Extracted web snippet',
                });
              }
            }
          }
        }
      }
    } catch {
      // Graceful fallback if search times out
    }
  }

  // 3. Fallback: Query public Reddit search directly if no snippets obtained
  if (redditSnippets.length === 0) {
    try {
      const encoded = encodeURIComponent(`${productName} review`);
      const url = `https://www.reddit.com/r/SkincareAddiction/search.json?q=${encoded}&restrict_sr=1&limit=2&sort=relevance`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'web:glowledger:v1.0.0 (portfolio demo)',
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const posts = json?.data?.children || [];
        for (const p of posts) {
          const postData = p?.data;
          if (postData) {
            const link = `https://reddit.com${postData.permalink}`;
            sourceLinks.push(link);
            redditSnippets.push({
              subreddit: 'r/SkincareAddiction',
              post_title: sanitizeSnippet(postData.title || ''),
              snippet: sanitizeSnippet(
                postData.selftext ? postData.selftext.slice(0, 280) : postData.title || ''
              ),
              url: link,
              upvotes: postData.score || null,
              date: postData.created_utc
                ? new Date(postData.created_utc * 1000).toISOString().split('T')[0]
                : null,
            });
          }
        }
      }
    } catch {
      // Network restrictions or Reddit rate limit
    }
  }

  // 4. Default honest note if no community snippets found
  if (redditSnippets.length === 0 && reviewSnippets.length === 0) {
    reviewSnippets.push({
      source: 'Cosmetic Formulation Database',
      snippet: `Public community discussions for "${productName}" are currently limited. Analysis is based primarily on INCI ingredient safety data, comedogenic profiles, and dermatological formulation standards.`,
      rating: null,
      url: 'https://world.openbeautyfacts.org',
      trust_note: 'Limited community discussion found — relying on formula composition',
    });
    sourceLinks.push('https://world.openbeautyfacts.org');
  }

  return {
    redditSnippets,
    reviewSnippets,
    sourceLinks,
  };
}
