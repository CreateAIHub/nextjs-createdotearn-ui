"use client";

import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { getSelectedModel } from "@/lib/model-helper";

interface ChatTopbarProps {
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({
  setSelectedModel,
  isLoading,
  chatId,
  messages,
  setMessages
}: ChatTopbarProps) {
  const [models, setModels] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState<string | null>(null);

  useEffect(() => {
    setCurrentModel(getSelectedModel());

    const env = process.env.NODE_ENV;

    const fetchModels = async () => {
      if (env === "production") {
        const fetchedModels = await fetch(process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags");
        const json = await fetchedModels.json();
        const apiModels = json.models.map((model : any) => model.name);
        setModels([...apiModels]);
      } 
      else {
        const fetchedModels = await fetch("/api/tags") 
        const json = await fetchedModels.json();
        const apiModels = json.models.map((model : any) => model.name);
        setModels([...apiModels]);
    }
    }
    fetchModels();
  }, []);

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    setSelectedModel(model);
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedModel", model);
    }
    setOpen(false);
  };

  const handleCloseSidebar = () => {
    setSheetOpen(false);  // Close the sidebar
  };

  return (
      <div className="w-full flex px-4 py-6  items-center justify-between lg:justify-center ">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <HamburgerMenuIcon className="lg:hidden w-5 h-5"/>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar
                chatId={chatId || ""}
                isCollapsed={false}
                isMobile={false}
                messages={messages}
                setMessages={setMessages}
                closeSidebar={handleCloseSidebar}
            />
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Telegram-Bitte
          </h1>
        </div>
      </div>
  );
}
