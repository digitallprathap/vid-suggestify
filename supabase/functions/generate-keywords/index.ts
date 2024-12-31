import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Generating keywords for:', { topic, competition });

    const prompt = `Generate 20 YouTube keyword ideas for the topic: "${topic}". 
    Focus on ${competition} competition keywords.
    For each keyword, provide a competition score between 0-100.
    Format the response as a JSON array of objects with 'keyword' and 'score' properties.
    Include a mix of:
    - Exact topic matches
    - Related questions
    - Long-tail variations
    - Trending angles`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a YouTube SEO expert that generates keyword ideas with competition scores.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received');
    
    let keywords;
    try {
      keywords = JSON.parse(data.choices[0].message.content);
      console.log('Parsed keywords:', keywords);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      keywords = [];
    }

    return new Response(JSON.stringify({ keywords }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-keywords function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});