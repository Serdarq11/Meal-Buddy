import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, EyeOff, MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

const messageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)')
    .transform(val => val.trim())
});

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  isAnonymous: boolean;
  lastMessage: string;
  unread: number;
  userId: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load conversations (for now showing demo data, will be connected to real data)
  useEffect(() => {
    if (user) {
      // Demo conversations - will be replaced with real data when matches are created
      setConversations([]);
    }
  }, [user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user || !selectedConversation) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === user.id || newMsg.sender_id === selectedConversation.userId) &&
            (newMsg.sender_id === selectedConversation.userId || newMsg.sender_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const sendMessage = async () => {
    if (!user || !selectedConversation) return;

    try {
      const validated = messageSchema.parse({ content: newMessage });

      const { error } = await supabase.from('messages').insert({
        content: validated.content,
        sender_id: user.id,
        receiver_id: selectedConversation.userId,
      });

      if (error) {
        toast.error('Failed to send message');
      } else {
        setNewMessage("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Messages | MealBuddy</title>
        <meta name="description" content="Chat with your meal buddies." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex gap-6 h-[calc(100vh-180px)]">
              {/* Conversation List */}
              <div className={`w-full md:w-80 flex-shrink-0 ${selectedConversation ? 'hidden md:block' : ''}`}>
                <div className="bg-card rounded-2xl border border-border h-full overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Messages</h2>
                  </div>
                  <div className="overflow-y-auto h-[calc(100%-60px)]">
                    {conversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm">No conversations yet</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          Match with someone to start chatting!
                        </p>
                        <Button 
                          className="mt-4 gradient-warm text-primary-foreground"
                          onClick={() => navigate('/dashboard')}
                        >
                          Find a Match
                        </Button>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                            selectedConversation?.id === conv.id ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="gradient-warm text-primary-foreground">
                                {conv.isAnonymous ? <EyeOff className="w-4 h-4" /> : conv.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground truncate">{conv.name}</span>
                                {conv.isAnonymous && (
                                  <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                              <Badge className="gradient-warm text-primary-foreground border-0">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className={`flex-1 ${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-col bg-card rounded-2xl border border-border overflow-hidden`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-accent rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <Avatar>
                        <AvatarFallback className="gradient-warm text-primary-foreground">
                          {selectedConversation.isAnonymous ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            selectedConversation.name[0]
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                        {selectedConversation.isAnonymous && (
                          <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                        )}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              msg.sender_id === user.id
                                ? 'gradient-warm text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} className="gradient-warm text-primary-foreground">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Messages;
