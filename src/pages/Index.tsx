import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchForm from "@/components/SearchForm";
import KeywordResults from "@/components/KeywordResults";
import RecentSearches from "@/components/RecentSearches";

// Function to fetch YouTube search suggestions
const fetchYouTubeSuggestions = async (query: string): Promise<string[]> => {
  try {
    console.log('Fetching YouTube suggestions for:', query);
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`,
      { mode: 'cors' }
    );
    const data = await response.json();
    console.log('Received suggestions:', data[1]);
    return data[1] || [];
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error);
    return [];
  }
};

// Enhanced keyword generation with YouTube suggestions
const generateLocalKeywords = async (topic: string, competition: string) => {
  console.log('Generating keywords for:', { topic, competition });
  
  const baseKeywords = new Set<string>();
  
  // Common YouTube prefixes to get more varied suggestions
  const prefixes = [
    '',
    'how to',
    'best',
    'top',
    competition === 'easy' ? 'beginner' : 'advanced',
    'guide'
  ];

  // Fetch suggestions for each prefix
  for (const prefix of prefixes) {
    const searchQuery = prefix ? `${prefix} ${topic}` : topic;
    const suggestions = await fetchYouTubeSuggestions(searchQuery);
    
    suggestions.forEach(suggestion => {
      baseKeywords.add(suggestion.toLowerCase());
    });
  }

  // Add the original topic
  baseKeywords.add(topic.toLowerCase());

  // Calculate competition scores
  const competitionMultiplier = {
    easy: 0.4,
    medium: 0.7,
    hard: 0.9
  }[competition];

  const keywordsArray = Array.from(baseKeywords)
    .filter(keyword => keyword.length <= 60) // YouTube title length limit
    .map(keyword => ({
      keyword,
      // Score based on multiple factors
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
    .sort((a, b) => b.score - a.score) // Sort by score
    .slice(0, 15); // Get top 15 keywords

  console.log('Generated keywords with scores:', keywordsArray);
  return keywordsArray;
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<Array<{ keyword: string; score: number }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      if (!(window as any).adsbygoogle) {
        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error("Error loading AdSense:", error);
    }
  }, []);

  const generateKeywords = async (topic: string, competition: string) => {
    setIsLoading(true);
    try {
      const generatedKeywords = await generateLocalKeywords(topic, competition);
      console.log('Generated keywords:', generatedKeywords);
      
      setKeywords(generatedKeywords);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${generatedKeywords.length} keyword suggestions from YouTube`,
      });
    } catch (error) {
      console.error("Error generating keywords:", error);
      toast({
        title: "Error",
        description: "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center space-x-2 text-youtube-red">
          <Youtube size={40} />
          <h1 className="text-3xl font-bold">YouTube Keywords Generator</h1>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <SearchForm onSearch={generateKeywords} isLoading={isLoading} />
            <KeywordResults keywords={keywords} />
          </div>
        </Card>

        <RecentSearches searches={recentSearches} onSelect={(topic) => generateKeywords(topic, "medium")} />
      </div>
    </div>
  );
}