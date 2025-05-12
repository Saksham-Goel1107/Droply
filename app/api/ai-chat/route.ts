import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getChat, setChat } from "@/utils/redis";
import { generateImage } from "@/utils/imageGeneration";
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key length:', apiKey?.length || 0); 
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not properly configured in environment variables. Please check your .env.local file.');
}
if (typeof apiKey !== 'string' || apiKey.trim() === '') {
  throw new Error('GEMINI_API_KEY is empty or invalid');
}
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_CONTEXT = `You are an AI assistant for Droply, a modern and secure file storage platform. Droply allows users to manage their files in the cloud with advanced features and security. You can also generate images using @image command.

Key Features:
• Secure Authentication
  - Enterprise-grade security with Clerk
  - Social login support
  - Password recovery and reset functionality

• Advanced File Management
  - Fast CDN-powered file uploads via ImageKit
  - Intuitive folder structure and organization
  - Star important files for quick access
  - Trash bin with file recovery options
  - Bulk file operations
  - Real-time upload progress tracking

• Smart File Sharing
  - Generate secure sharing links
  - Password protection for shared files
  - Link expiration settings

• AI-Powered Features
  - Voice commands for file operations
  - AI chat assistant for help
  - Smart file organization
  - Content summarization
  - write @image to generate images

• Modern User Experience
  - Responsive design for all devices
  - Drag-and-drop file uploads
  - Beautiful UI with HeroUI components

Technical Stack:
• Frontend: Next.js 14+ with App Router
• Authentication: Clerk
• Database: Neon (Serverless PostgreSQL)
• ORM: Drizzle
• Storage: ImageKit CDN
• AI: Google Gemini
• Source Code:https://github.com/Saksham-goel1107/Droply
• Linkedin Of the Creator:https://www.linkedin.com/in/saksham-goel-88b74b33a/


I can help users with:
1. File Management
   - Uploading and organizing files
   - Creating folder structures
   - Managing shared files
   - Recovering deleted files
   - Bulk file operations

2. Security & Sharing
   - Setting up secure file sharing
   - Managing access permissions
   - Password protecting files
   - Setting link expiration

3. Account Management
   - Profile settings
   - Authentication setup
   - Password recovery
   - Security settings

4. Platform Navigation
   - Using the dashboard
   - Finding specific features
   - Keyboard shortcuts
   - Mobile interface usage
   - Accessibility options

5. Technical Support
   - Upload troubleshooting
   - Storage management
   - File format compatibility
   - Browser compatibility
   - Performance optimization

Response Formatting:
• Use clear headings for sections
• Include bullet points (•) for lists
• Maintain proper indentation for readability
• Add line breaks between sections
• Use proper spacing after punctuation
• Highlight important terms and features
• Include code snippets when relevant
• Keep responses concise and focused
• Use natural, friendly language
• Start new points on new lines
• dont use ** Start each point from the next line

Keep responses concise, friendly, and focused on Droply's features.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = uuidv4() } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const history = await getChat(sessionId) as ChatMessage[];

    // Check for image generation command
    if (message.toLowerCase().startsWith('@image ')) {
      try {
        const imagePrompt = message.slice(7); // Remove '@image '
        const imageUrl = await generateImage(imagePrompt);
        const responseText = `🎨 Generated image for prompt: "${imagePrompt}"`;
        
        const updatedHistory = [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content: responseText, imageUrl }
        ];
        await setChat(sessionId, updatedHistory);

        return NextResponse.json({ 
          response: responseText,
          imageUrl,
          timestamp: new Date().toISOString(),
          sessionId
        });
      } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json(
          { error: "Failed to generate image. Please try again." },
          { status: 500 }
        );
      }
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }    });   

    const conversationContext: string = history.length > 0 
      ? history.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n\n')
      : '';
    
    // Create a chat with history
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(`${SYSTEM_CONTEXT}\n\n${conversationContext}\n\nUser: ${message}`);
    const response = await result.response;
    let responseText = response.text();
    if (!responseText) {
      return NextResponse.json(
        { error: "No response generated. Please try again." },
        { status: 500 }
      );
    }    responseText = responseText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/([.!?])\s*(\w)/g, '$1 $2')
      
      .replace(/^[-*]\s/gm, '• ')
      .replace(/^\t[-*]\s/gm, '    • ') 
      .replace(/^\d+\.\s/gm, (match) => match.trim() + ' ')
      
      .replace(/\*\*(.*?)\*\*/g, (_, text) => `**${text.trim()}**`) 
      .replace(/\*(.*?)\*/g, (_, text) => `*${text.trim()}*`)       
      .replace(/`(.*?)`/g, (_, text) => `\`${text.trim()}\``)       
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang: string | undefined, code: string) => {
        const formattedCode = code.split('\n')
          .map((line: string) => line.trim())
          .join('\n    '); 
        return `\`\`\`${lang || ''}\n    ${formattedCode}\n\`\`\``;
      })
      
      .replace(/^(•|\d+\.)\s*/gm, '$1 ')
      
      .replace(/^(\s{2,})/gm, '    ')
      
      .trim();

    const updatedHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: responseText }
    ];
    await setChat(sessionId, updatedHistory);

    return NextResponse.json({ 
      response: responseText,
      timestamp: new Date().toISOString(),
      sessionId
    });} catch (error: any) {
    console.error('AI Chat Error:', error);

    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      return NextResponse.json(
        { error: "Invalid API configuration. Please contact the administrator." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response, please try again later." },
      { status: 500 }
    );
  }
}
