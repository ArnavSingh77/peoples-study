import { useState, useEffect } from "react";
import StudyCard from "@/components/StudyCard";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface StudySession {
  id: string;
  title: string;
  duration: string;
  created_by: string;
  _count?: {
    participants: number;
  }
}

const Dashboard = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          session_participants (
            count
          )
        `);

      if (error) {
        toast.error("Failed to load study sessions");
        throw error;
      }

      return sessions.map(session => ({
        ...session,
        _count: {
          participants: session.session_participants[0]?.count || 0
        }
      }));
    }
  });

  const handleJoinSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('session_participants')
      .insert([
        { session_id: sessionId, user_id: (await supabase.auth.getUser()).data.user?.id }
      ]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast.error("You've already joined this session");
      } else {
        toast.error("Failed to join session");
      }
      return;
    }

    toast.success("Successfully joined session");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

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
              <p className="text-gray-600">Total Sessions: {sessions?.length || 0}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session) => (
            <StudyCard
              key={session.id}
              title={session.title}
              participants={session._count?.participants || 0}
              duration={session.duration}
              onJoin={() => handleJoinSession(session.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;