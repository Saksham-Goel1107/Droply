"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import VoiceButton from './VoiceButton';
import type { SpeechRecognition } from '../types/speech-recognition';
import { Download } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp?: number;
}

interface Command {
  command: string;
  description: string;
}

const formatMessageContent = (content: string) => {
  // Handle bold text
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle links - matches URLs starting with http:// or https://
  content = content.replace(
    /(https?:\/\/[^\s]+)/g,
    (match) => {
      // Only create link if it's a valid URL
      try {
        new URL(match);
        return `<a href="${match}" class="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">${match}</a>`;
      } catch {
        return match;
      }
    }
  );

  // First, split the content into lines
  const lines = content.split('\n');
  const formattedLines = lines.map(line => {
    // Handle main bullet points
    if (line.match(/^- /)) {
      return line.replace(
        /^- (.*?)$/,
        '<div class="flex mb-2"><span class="mr-2">•</span><div class="flex-1">$1</div></div>'
      );
    }
    // Handle sub-points (indented content)
    else if (line.match(/^ {2}- /)) {
      return line.replace(
        /^ {2}- (.*?)$/,
        '<div class="flex mb-2 ml-6"><span class="mr-2">◦</span><div class="flex-1">$1</div></div>'
      );
    }
    return line;
  });
  
  // Join the lines back together
  content = formattedLines.join('\n');
  
  return content;
};

export default function AiChatSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const [matchedCommand, setMatchedCommand] = useState<string>('');
  
  const commands: Command[] = [
    { command: '@image', description: 'Generate an image(may Take Extra Time)' }
  ];

  const handleCommandSelection = (command: string) => {
    setMessage(command + ' ');
    setShowCommandSuggestions(false);
    setMatchedCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      setShowCommandSuggestions(true);
      setMatchedCommand('');
    } else if (e.key === 'Tab' && showCommandSuggestions) {
      e.preventDefault();
      const currentText = message.slice(message.lastIndexOf('@') + 1).toLowerCase();
      const matchingCommand = commands.find(cmd => 
        cmd.command.slice(1).toLowerCase().startsWith(currentText)
      );
      if (matchingCommand) {
        const beforeCommand = message.slice(0, message.lastIndexOf('@'));
        setMessage(beforeCommand + matchingCommand.command + ' ');
        setShowCommandSuggestions(false);
        setMatchedCommand('');
      }
    } else if (showCommandSuggestions && e.key === 'Escape') {
      setShowCommandSuggestions(false);
      setMatchedCommand('');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    const lastAtIndex = newValue.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const currentCommand = newValue.slice(lastAtIndex).toLowerCase();
      const matchingCommand = commands.find(cmd => 
        cmd.command.toLowerCase().startsWith(currentCommand)
      );
      
      if (matchingCommand) {
        setShowCommandSuggestions(true);
        setMatchedCommand(currentCommand.slice(1)); 
      } else {
        setShowCommandSuggestions(false);
        setMatchedCommand('');
      }
    } else {
      setShowCommandSuggestions(false);
      setMatchedCommand('');
    }
  };

  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    const newSessionId = savedSessionId || crypto.randomUUID();
    setSessionId(newSessionId);
    
    if (!savedSessionId) {
      localStorage.setItem('chatSessionId', newSessionId);
    }

    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('chatHistory'); 
    }    
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript as string)
          .join('');
        setMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;    const userMessage = message;
    setMessage('');
    
    setChatHistory(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now()
    }]);
    setIsLoading(true);

    try {      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }      const data = await response.json();
        setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        imageUrl: data.imageUrl,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Maybe be because you are not authenticated Please try again later After Authentication"
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
  };

  const toggleVoice = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleImageDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `droply-image-${Date.now()}.jpg`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`p-4 border-b border-gray-700 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Image src="/gemini.png" alt="Gemini" width={24} height={24} />
              <h2 className={`font-semibold text-white`}>Droply Assistant</h2>
            </div>            <div className="flex items-center space-x-2">
              <button
                onClick={clearHistory}
                className={`p-2 rounded-full hover:bg-gray-800`}
                title="Clear chat history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-gray-800`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>          <div className={`flex-1 overflow-y-auto p-4 text-gray-100`}>
            {chatHistory.length === 0 && (             <div className={`text-center text-gray-400 mt-2`}>
                <p>👋 Hi! I&apos;m your Droply assistant.</p>
                <p className="mt-2">Ask me anything about the platform!</p>
                <p className="mt-2">Try typing @ to see available commands</p>
              </div>
            )}            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } w-full`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? `bg-blue-500 text-white`
                      : 'bg-gray-800'
                  } max-w-[95%] relative break-words whitespace-pre-wrap`}
                >
                  <div 
                    className="text-sm leading-relaxed message-content" 
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(msg.content) 
                    }}
                  />
                  {msg.imageUrl && (
                    <div className="relative group mt-3 mb-4">
                      <Image 
                        src={msg.imageUrl} 
                        alt="Generated image"
                        width={400}
                        height={400}
                        className="rounded-lg max-w-full h-auto"
                      />
                      <button
                        onClick={() => handleImageDownload(msg.imageUrl!)}
                        className="absolute bottom-2 right-2 p-2 bg-black bg-opacity-50 rounded-full 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          hover:bg-opacity-70"
                        title="Download image"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="text-[10px] opacity-70 select-none flex items-center gap-1 mt-1">
                    {msg.role === 'assistant' && <span className="w-2 h-2 bg-green-400 rounded-full"/>}
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            )}
          </div>          <div className={`p-4 border-t border-gray-700`}>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Ask me anything... (Type @ for commands)"
                  rows={1}
                  className={`w-full p-2 pr-10 rounded-lg border 
                      bg-gray-800 border-gray-700 text-white
                      resize-none
                      focus:outline-none focus:ring-2 focus:ring-blue-500 scrollbar-hide`}
                  suppressHydrationWarning
                />
                {showCommandSuggestions && (
                  <div className="absolute bottom-full mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    {commands.map((cmd) => {
                      const commandText = cmd.command.slice(1); 
                      const matchLength = matchedCommand.length;
                      const isMatching = commandText.toLowerCase().startsWith(matchedCommand.toLowerCase());
                      
                      if (!isMatching) return null;
                      
                      return (
                        <button
                          key={cmd.command}
                          onClick={() => handleCommandSelection(cmd.command)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 focus:outline-none"
                        >
                          <span className="font-mono">
                            {matchLength > 0 ? (
                              <>
                                <span className="text-blue-400">@{commandText.slice(0, matchLength)}</span>
                                <span>{commandText.slice(matchLength)}</span>
                              </>
                            ) : (
                              <>@{commandText}</>
                            )}
                          </span>
                          <span className="ml-2 text-gray-400">{cmd.description}</span>
                        </button>
                      );
                    })}
                  </div>
                )}<div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {
                    <VoiceButton
                      isListening={isListening}
                      onClick={toggleVoice}
                    />
                  }
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
