import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyCard from "@/components/StudyCard";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/');
        return;
      }
    });

    // Fetch study sessions
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .select(`
            *,
            session_participants (
              count
            )
          `);

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load study sessions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    // Subscribe to changes
    const subscription = supabase
      .channel('study_sessions_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'study_sessions' 
      }, fetchSessions)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleJoinSession = async (sessionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { error } = await supabase
        .from('session_participants')
        .insert([
          { session_id: sessionId, user_id: user.id }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully joined the session",
      });
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: "Error",
        description: "Failed to join session",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading sessions...</p>
      </div>
    );
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
              <p className="text-gray-600">Total sessions: {sessions.length}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session: any) => (
            <StudyCard
              key={session.id}
              title={session.title}
              participants={session.session_participants?.[0]?.count || 0}
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