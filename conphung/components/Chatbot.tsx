'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Xin chào! Tôi là trợ lý ảo của Khu du lịch Cồn Phụng. Tôi có thể giúp bạn tìm hiểu về các tour du lịch, đặt tour, hoặc trả lời các câu hỏi về khu du lịch. Bạn cần hỗ trợ gì?',
    isUser: false,
    timestamp: new Date(),
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple rule-based responses
    if (lowerMessage.includes('tour') || lowerMessage.includes('đặt tour')) {
      return 'Chúng tôi có nhiều tour hấp dẫn tại Cồn Phụng. Bạn có thể xem chi tiết tại trang Tours hoặc liên hệ hotline 0917.645.039 để được tư vấn cụ thể.';
    }

    if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return 'Giá tour phụ thuộc vào số lượng khách và thời gian. Vui lòng xem chi tiết từng tour hoặc liên hệ chúng tôi để nhận báo giá chính xác nhất.';
    }

    if (lowerMessage.includes('đặt phòng') || lowerMessage.includes('khách sạn')) {
      return 'Để đặt phòng tại Cồn Phụng, bạn có thể liên hệ trực tiếp qua hotline hoặc truy cập website cocoisland.vn để đặt phòng Coco Island.';
    }

    if (lowerMessage.includes('liên hệ') || lowerMessage.includes('hotline')) {
      return 'Thông tin liên hệ: Hotline: 0917.645.039 | Email: conphung87@yahoo.com.vn | Website: conphungtourist.com';
    }

    if (lowerMessage.includes('địa chỉ') || lowerMessage.includes('location')) {
      return 'Khu du lịch Cồn Phụng nằm tại Tờ bản đồ số 3, thửa đất số 32, ấp 10 (ấp Tân Vinh), xã Phú Túc, tỉnh Vĩnh Long.';
    }

    // Default response
    return 'Cảm ơn bạn đã quan tâm đến Khu du lịch Cồn Phụng! Để được hỗ trợ tốt nhất, vui lòng liên hệ hotline 0917.645.039 hoặc để lại thông tin để chúng tôi tư vấn chi tiết.';
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await generateBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-80 h-96 flex flex-col shadow-2xl border-2 border-primary/20 bg-background rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Trợ lý Cồn Phụng</h3>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
