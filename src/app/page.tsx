"use client";
import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Message } from "ai/react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useChatStore from "./hooks/useChatStore";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [open, setOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);

  useEffect(() => {
    if (messages.length < 1) {
      console.log("Generating chat id");
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (replace with your frontend logic)
    setTimeout(() => {
      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "This is a demo response. The frontend is working without API calls!",
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setBase64Images([]);
    }, 1000);
  };

  const stop = () => {
    setIsLoading(false);
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Telegram-Bitte!</DialogTitle>
            <DialogDescription>
              Your AI assistant for NEAR Protocol, Shade Agents, and cross-chain interactions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <button 
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Get Started
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="w-full max-w-7xl mx-auto p-4 h-[calc(100vh-32px)]">
        <ChatLayout
          chatId={chatId}
          setSelectedModel={setSelectedModel}
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          loadingSubmit={loadingSubmit}
          error={undefined}
          stop={stop}
          formRef={formRef}
          setMessages={setMessages}
          setInput={setInput}
        />
      </div>
    </main>
  );
}
