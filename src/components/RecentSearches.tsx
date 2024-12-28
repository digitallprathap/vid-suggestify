import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
}

export default function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-gray-500" />
        <h2 className="text-xl font-semibold">Recent Searches</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <Button
            key={index}
            variant="outline"
            className="hover:bg-youtube-red hover:text-white transition-colors"
            onClick={() => onSelect(search)}
          >
            {search}
          </Button>
        ))}
      </div>
    </Card>
  );
}