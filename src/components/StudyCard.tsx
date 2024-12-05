import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

interface StudyCardProps {
  title: string;
  participants: number;
  duration: string;
  onJoin: () => void;
}

const StudyCard = ({ title, participants, duration, onJoin }: StudyCardProps) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">{participants} participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">{duration}</span>
          </div>
        </div>
        <Button 
          onClick={onJoin}
          className="w-full bg-primary hover:bg-primary-dark"
        >
          Join Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudyCard;