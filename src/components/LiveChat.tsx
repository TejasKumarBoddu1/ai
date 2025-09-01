import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, Minus, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

interface LiveChatProps {
  onClose?: () => void;
}

const LiveChat = ({ onClose }: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you with your resume today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };
  
  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setMessage('');
    
    // Simulate support response after a short delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message. Our team will get back to you shortly.',
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };
  
  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button (always visible) */}
      <Button
        onClick={handleClose}
        className={`rounded-full w-12 h-12 shadow-lg flex items-center justify-center bg-red-500 hover:bg-red-600`}
      >
        <X size={20} />
      </Button>
      
      {/* Chat box */}
      {isOpen && (
        <Card className={`absolute bottom-16 right-0 w-80 shadow-xl transition-all duration-300 ${
          isMinimized ? 'h-12' : 'h-96'
        }`}>
          <CardHeader className={`p-3 border-b flex flex-row items-center justify-between ${
            isMinimized ? 'rounded-b-lg' : ''
          }`}>
            <CardTitle className="text-sm font-medium">Resume Builder Support</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={minimizeChat}>
              {isMinimized ? <Plus size={16} /> : <Minus size={16} />}
            </Button>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <ScrollArea className="h-[calc(100%-7rem)]">
                <CardContent className="p-3 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
              </ScrollArea>
              
              <CardFooter className="p-3 pt-0">
                <form onSubmit={sendMessage} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send size={16} />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default LiveChat;
