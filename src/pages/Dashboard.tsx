import { useState } from "react";
import StudyCard from "@/components/StudyCard";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [sessions] = useState([
    { id: 1, title: "Mathematics Study Group", participants: 4, duration: "2h" },
    { id: 2, title: "Physics Prep", participants: 2, duration: "1h 30m" },
    { id: 3, title: "Literature Discussion", participants: 6, duration: "3h" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Study Dashboard</h1>
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Session</h2>
            <Timer />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Stats</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Connect to Supabase to view your stats</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <StudyCard
              key={session.id}
              title={session.title}
              participants={session.participants}
              duration={session.duration}
              onJoin={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;