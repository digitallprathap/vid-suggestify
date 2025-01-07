import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchForm from "@/components/SearchForm";
import KeywordResults from "@/components/KeywordResults";
import RecentSearches from "@/components/RecentSearches";
import AdSense from "@/components/AdSense";
import { supabase } from "@/integrations/supabase/client";

type KeywordResult = {
  keyword: string;
  score: number;
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  const generateKeywords = async (topic: string, competition: string) => {
    setIsLoading(true);
    try {
      // First, check if we have cached results
      console.log('Checking cache for:', { topic, competition });
      const { data: cachedResults } = await supabase
        .from('search_results')
        .select('keywords')
        .eq('topic', topic.toLowerCase())
        .eq('competition', competition)
        .maybeSingle();

      if (cachedResults) {
        console.log('Found cached results:', cachedResults);
        const typedKeywords = cachedResults.keywords as KeywordResult[];
        setKeywords(typedKeywords);
        setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
        toast({
          title: "Keywords Retrieved",
          description: `Retrieved ${typedKeywords.length} cached keyword suggestions`,
        });
        return;
      }

      console.log('No cache found, calling YouTube API for:', { topic, competition });
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { topic, competition },
      });

      if (error) throw error;
      
      console.log('Received keywords from API:', data.keywords);
      
      // Store the results in the database
      const { error: insertError } = await supabase
        .from('search_results')
        .insert({
          topic: topic.toLowerCase(),
          competition,
          keywords: data.keywords,
        });

      if (insertError) {
        console.error('Error caching results:', insertError);
      }

      setKeywords(data.keywords);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${data.keywords.length} keyword suggestions from YouTube`,
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
          <h1 className="text-3xl font-bold">YT Keywords Generator</h1>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <SearchForm onSearch={generateKeywords} isLoading={isLoading} />
            
            <AdSense
              className="my-4"
              adSlot="1450711874"
              style={{ display: 'block', minHeight: '100px' }}
            />
            
            <KeywordResults keywords={keywords} />
          </div>
        </Card>

        <RecentSearches searches={recentSearches} onSelect={(topic) => generateKeywords(topic, "medium")} />
      </div>
    </div>
  );
}