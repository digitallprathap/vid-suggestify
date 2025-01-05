import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SearchForm from "@/components/SearchForm";
import KeywordResults from "@/components/KeywordResults";
import RecentSearches from "@/components/RecentSearches";
import { supabase } from "@/integrations/supabase/client";

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
      console.log('Calling YouTube API for:', { topic, competition });
      
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { topic, competition },
      });

      if (error) throw error;
      
      console.log('Received keywords from API:', data.keywords);
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