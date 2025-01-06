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

    // First, get search results for the exact topic
    const searchResponse = await fetch(`https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(topic)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    const data = await searchResponse.json();
    console.log('RapidAPI response received');

    // Process and score the keywords based on competition level and context
    const processedKeywords = processKeywords(data, topic, competition);

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

function processKeywords(data: any, topic: string, competition: string): Array<{ keyword: string; score: number }> {
  const competitionMultiplier = {
    easy: 0.4,
    medium: 0.7,
    hard: 0.9,
  }[competition];

  // Extract keywords from video titles and descriptions
  const keywordMap = new Map<string, number>();
  const topicWords = new Set(topic.toLowerCase().split(' '));
  
  data.data?.forEach((item: any) => {
    if (item.title) {
      // Process title to extract relevant keywords
      const titleWords = item.title.toLowerCase().split(' ');
      let phrase = '';
      
      titleWords.forEach((word: string, index: number) => {
        // Build phrases that contain topic-related words
        if (topicWords.has(word) || phrase.includes(topic.toLowerCase())) {
          phrase = phrase ? `${phrase} ${word}` : word;
          if (phrase.length >= 3 && phrase.length <= 60) {
            const currentCount = keywordMap.get(phrase) || 0;
            keywordMap.set(phrase, currentCount + 1);
          }
        } else {
          phrase = '';
        }
        
        // Also add common tutorial-related phrases
        if (index < titleWords.length - 2) {
          const threeWordPhrase = `${titleWords[index]} ${titleWords[index + 1]} ${titleWords[index + 2]}`;
          if (threeWordPhrase.includes(topic.toLowerCase())) {
            keywordMap.set(threeWordPhrase, (keywordMap.get(threeWordPhrase) || 0) + 1);
          }
        }
      });
    }
  });

  // Convert to array and calculate scores
  return Array.from(keywordMap.entries())
    .map(([keyword, frequency]) => ({
      keyword,
      score: Math.min(
        Math.round(
          (
            frequency * 10 + // Base score from frequency
            (keyword.includes(topic.toLowerCase()) ? 20 : 0) + // Bonus for containing the topic
            (keyword.includes('how to') ? 15 : 0) + // Bonus for "how to"
            (keyword.includes('tutorial') ? 12 : 0) + // Bonus for tutorial
            (keyword.includes('guide') ? 10 : 0) + // Bonus for guide
            (keyword.includes('tips') ? 8 : 0) + // Bonus for tips
            (keyword.includes(new Date().getFullYear().toString()) ? 10 : 0) // Bonus for current year
          ) * competitionMultiplier
        ),
        100
      )
    }))
    .filter(item => 
      item.keyword.includes(topic.toLowerCase()) || // Must be related to topic
      topicWords.has(item.keyword.split(' ')[0]) || // Or start with a topic word
      item.keyword.includes('how to') // Or be a "how to" phrase
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // Get top 15 most relevant keywords
}