import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface KeywordCardProps {
  keyword: string;
  score: number;
}

export default function KeywordCard({ keyword, score }: KeywordCardProps) {
  const { toast } = useToast();

  const copyKeyword = () => {
    navigator.clipboard.writeText(keyword);
    toast({
      title: "Keyword copied!",
      description: "The keyword has been copied to your clipboard",
    });
  };

  return (
    <Card className="p-4 flex justify-between items-center bg-white hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="font-medium">{keyword}</p>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-youtube-red rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{score}%</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={copyKeyword}>
        <Copy size={16} />
      </Button>
    </Card>
  );
}