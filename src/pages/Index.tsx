import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Youtube } from "lucide-react";
import KeywordCard from "@/components/KeywordCard";
import RecentSearches from "@/components/RecentSearches";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Index() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<Array<{ keyword: string; score: number }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [competition, setCompetition] = useState("medium");
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
    // Simulate API call with dummy data adjusted by competition level
    setTimeout(() => {
      let baseScore = competition === "easy" ? 40 : competition === "medium" ? 70 : 90;
      const dummyKeywords = [
        { keyword: `${topic} tutorial`, score: baseScore + 5 },
        { keyword: `how to ${topic}`, score: baseScore },
        { keyword: `${topic} for beginners`, score: baseScore - 5 },
        { keyword: `${topic} tips and tricks`, score: baseScore - 10 },
        { keyword: `best ${topic} guide`, score: baseScore - 15 },
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

            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">Keyword Competition Level</Label>
              <RadioGroup
                value={competition}
                onValueChange={setCompetition}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
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