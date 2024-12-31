import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import KeywordCard from "./KeywordCard";

interface KeywordResult {
  keyword: string;
  score: number;
}

interface KeywordResultsProps {
  keywords: KeywordResult[];
}

export default function KeywordResults({ keywords }: KeywordResultsProps) {
  const { toast } = useToast();

  const copyAllKeywords = () => {
    const keywordText = keywords.map((k) => k.keyword).join(", ");
    navigator.clipboard.writeText(keywordText);
    toast({
      title: "Keywords copied!",
      description: "All keywords have been copied to your clipboard",
    });
  };

  if (keywords.length === 0) return null;

  return (
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
  );
}