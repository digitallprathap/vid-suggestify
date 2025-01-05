import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
const RAPIDAPI_HOST = 'yt-api.p.rapidapi.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, competition } = await req.json();
    console.log('Searching YouTube for:', { topic, competition });

    const response = await fetch(`https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(topic)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    const data = await response.json();
    console.log('RapidAPI response received');

    // Process and score the keywords based on competition level
    const processedKeywords = processKeywords(data, competition);

    return new Response(JSON.stringify({ keywords: processedKeywords }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in youtube-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function processKeywords(data: any, competition: string): Array<{ keyword: string; score: number }> {
  const competitionMultiplier = {
    easy: 0.4,
    medium: 0.7,
    hard: 0.9,
  }[competition];

  // Extract and process keywords from video titles and tags
  const keywords = new Set<string>();
  
  data.data?.forEach((item: any) => {
    if (item.title) {
      keywords.add(item.title.toLowerCase());
    }
    if (item.tags) {
      item.tags.forEach((tag: string) => keywords.add(tag.toLowerCase()));
    }
  });

  return Array.from(keywords)
    .filter(keyword => keyword.length <= 60) // YouTube title length limit
    .map(keyword => ({
      keyword,
      score: Math.min(
        Math.round(
          (
            keyword.split(' ').length * 8 + // More words = higher score
            (keyword.includes('how to') ? 15 : 0) + // Bonus for "how to"
            (keyword.includes(new Date().getFullYear().toString()) ? 10 : 0) + // Bonus for current year
            (keyword.includes('tutorial') ? 12 : 0) + // Bonus for tutorial
            (keyword.length > 20 ? 5 : 0) // Bonus for longer phrases
          ) * competitionMultiplier
        ),
        100
      )
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // Get top 15 keywords
}