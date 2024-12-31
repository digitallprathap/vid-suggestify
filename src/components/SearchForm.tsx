import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface SearchFormProps {
  onSearch: (topic: string, competition: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [topic, setTopic] = useState("");
  const [competition, setCompetition] = useState("medium");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "The topic field cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSearch(topic, competition);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter your video topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-youtube-red hover:bg-red-600"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          Generate Keywords
        </Button>
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
    </div>
  );
}