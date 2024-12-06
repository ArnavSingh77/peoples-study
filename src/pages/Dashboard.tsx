import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyCard from "@/components/StudyCard";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSession, setNewSession] = useState({
    title: "",
    duration: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { error } = await supabase
        .from('study_sessions')
        .insert([
          { 
            title: newSession.title,
            duration: newSession.duration,
            created_by: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study session created successfully",
      });
      
      setNewSession({ title: "", duration: "" });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create study session",
        variant: "destructive",
      });
    }
  };

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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Session</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={newSession.title}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter session title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newSession.duration}
                    onChange={(e) => setNewSession(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2h 30m"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Session
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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