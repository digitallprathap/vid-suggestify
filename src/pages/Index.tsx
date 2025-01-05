import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchForm from "@/components/SearchForm";
import KeywordResults from "@/components/KeywordResults";
import RecentSearches from "@/components/RecentSearches";

// Local keyword generation logic
const generateLocalKeywords = (topic: string, competition: string) => {
  console.log('Generating local keywords for:', { topic, competition });
  
  // Remove special characters and split into words
  const words = topic.toLowerCase().replace(/[^\w\s]/gi, '').split(' ');
  const baseKeywords = new Set<string>();
  
  // Generate variations
  words.forEach(word => {
    // Add single word
    baseKeywords.add(word);
    
    // Add with "how to" prefix
    baseKeywords.add(`how to ${word}`);
    
    // Add with "best" prefix
    baseKeywords.add(`best ${word}`);
    
    // Add with "tutorial" suffix
    baseKeywords.add(`${word} tutorial`);
    
    // Combine words for longer phrases
    words.forEach(otherWord => {
      if (word !== otherWord) {
        baseKeywords.add(`${word} ${otherWord}`);
        baseKeywords.add(`best ${word} ${otherWord}`);
        baseKeywords.add(`${word} ${otherWord} tutorial`);
      }
    });
  });

  // Convert to array and add competition scores
  const competitionMultiplier = {
    easy: 0.3,
    medium: 0.6,
    hard: 0.9
  }[competition];

  return Array.from(baseKeywords).map(keyword => ({
    keyword,
    // Generate a semi-random but consistent score based on keyword length and competition
    score: Math.min(
      Math.round((keyword.length * 3 + keyword.split(' ').length * 10) * competitionMultiplier),
      100
    )
  })).slice(0, 10); // Limit to 10 keywords
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<Array<{ keyword: string; score: number }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      // Initialize AdSense only if it hasn't been initialized yet
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
      // Generate keywords locally
      const generatedKeywords = generateLocalKeywords(topic, competition);
      console.log('Generated keywords:', generatedKeywords);
      
      setKeywords(generatedKeywords);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${generatedKeywords.length} keyword suggestions`,
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