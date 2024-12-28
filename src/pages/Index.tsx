import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Youtube } from "lucide-react";
import KeywordCard from "@/components/KeywordCard";
import RecentSearches from "@/components/RecentSearches";

export default function Index() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<Array<{ keyword: string; score: number }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  const generateKeywords = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "The topic field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyKeywords = [
        { keyword: `${topic} tutorial`, score: 95 },
        { keyword: `how to ${topic}`, score: 90 },
        { keyword: `${topic} for beginners`, score: 85 },
        { keyword: `${topic} tips and tricks`, score: 80 },
        { keyword: `best ${topic} guide`, score: 75 },
      ];
      setKeywords(dummyKeywords);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
      setIsLoading(false);
    }, 1500);
  };

  const copyAllKeywords = () => {
    const keywordText = keywords.map((k) => k.keyword).join(", ");
    navigator.clipboard.writeText(keywordText);
    toast({
      title: "Keywords copied!",
      description: "All keywords have been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-youtube-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center space-x-2 text-youtube-red">
          <Youtube size={40} />
          <h1 className="text-3xl font-bold">YouTube Keywords Generator</h1>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your video topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={generateKeywords}
                disabled={isLoading}
                className="bg-youtube-red hover:bg-red-600"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Generate Keywords
              </Button>
            </div>

            {keywords.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Suggested Keywords</h2>
                  <Button
                    variant="outline"
                    onClick={copyAllKeywords}
                    className="flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Copy All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keywords.map((keyword, index) => (
                    <KeywordCard
                      key={index}
                      keyword={keyword.keyword}
                      score={keyword.score}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <RecentSearches searches={recentSearches} onSelect={setTopic} />
      </div>
    </div>
  );
}