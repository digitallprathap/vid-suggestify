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
    const loadAdSense = () => {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };
    loadAdSense();
  }, []);

  const generateKeywords = async (topic: string, competition: string) => {
    setIsLoading(true);
    try {
      console.log('Calling generate-keywords function with:', { topic, competition });
      const { data, error } = await supabase.functions.invoke('generate-keywords', {
        body: { topic, competition }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Generated keywords:', data);
      setKeywords(data.keywords);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${data.keywords.length} keyword suggestions`,
      });
    } catch (error) {
      console.error("Error generating keywords:", error);
      toast({
        title: "Error",
        description: "Failed to generate keywords. Please try again later.",
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

            {/* AdSense Ad Container */}
            <div className="my-6">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="YOUR-AD-CLIENT-ID"
                data-ad-slot="YOUR-AD-SLOT-ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>

            <KeywordResults keywords={keywords} />
          </div>
        </Card>

        <RecentSearches searches={recentSearches} onSelect={(topic) => generateKeywords(topic, "medium")} />
      </div>
    </div>
  );
}