import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Youtube, Key } from "lucide-react";
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
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const { toast } = useToast();

  useEffect(() => {
    // Load AdSense script
    const loadAdSense = () => {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };
    loadAdSense();
  }, []);

  const generateKeywords = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "The topic field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to generate keywords",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a YouTube SEO expert. Generate a list of 20 keyword ideas with their competition scores (0-100). Format as JSON array with 'keyword' and 'score' properties.",
            },
            {
              role: "user",
              content: `Generate YouTube keyword ideas for: ${topic}. Competition level preference: ${competition}. Include long-tail variations and trending topics.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate keywords");
      }

      const data = await response.json();
      console.log("OpenAI response:", data);

      const keywordsList = JSON.parse(data.choices[0].message.content);
      setKeywords(keywordsList);
      setRecentSearches((prev) => [topic, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Error generating keywords:", error);
      toast({
        title: "Error",
        description: "Failed to generate keywords. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAllKeywords = () => {
    const keywordText = keywords.map((k) => k.keyword).join(", ");
    navigator.clipboard.writeText(keywordText);
    toast({
      title: "Keywords copied!",
      description: "All keywords have been copied to your clipboard",
    });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem("openai_api_key", newKey);
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                <Key className="text-gray-500" size={20} />
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key..."
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="flex-1"
                />
              </div>
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
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Generate Keywords
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">
                Keyword Competition Level
              </Label>
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
