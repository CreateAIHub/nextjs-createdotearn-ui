"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { useLocalStorageData } from "@/app/hooks/useLocalStorageData";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import PullModel from "./pull-model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
  chatId: string;
  setMessages: (messages: Message[]) => void;
  closeSidebar?: () => void;
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  setMessages,
  closeSidebar
}: SidebarProps) {
  const [localChats, setLocalChats] = useState<
    { chatId: string; messages: Message[] }[]
  >([]);
  const localChatss = useLocalStorageData("chat_", []);
  const [selectedChatId, setSselectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (chatId) {
      setSselectedChatId(chatId);
    }

    setLocalChats(getLocalstorageChats());
    const handleStorageChange = () => {
      setLocalChats(getLocalstorageChats());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getLocalstorageChats = (): {
    chatId: string;
    messages: Message[];
  }[] => {
    const chats = Object.keys(localStorage).filter((key) =>
      key.startsWith("chat_")
    );

    if (chats.length === 0) {
      setIsLoading(false);
    }

    // Map through the chats and return an object with chatId and messages
    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      try {
        // Try to parse the data if it exists
        return item
            ? { chatId: chat, messages: JSON.parse(item) }
            : { chatId: chat, messages: [] };
      } catch (error) {
        // Log the error and return fallback for invalid JSON
        console.error(`Invalid JSON for chatId: ${chat}`, error);
        return { chatId: chat, messages: [] };
      }
    });

    // Sort chats by the createdAt date of the first message of each chat
    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0].createdAt);
      const bDate = new Date(b.messages[0].createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    setIsLoading(false);
    return chatObjects;
  };

  const handleDeleteChat = (chatId: string) => {
    localStorage.removeItem(chatId);
    setLocalChats(getLocalstorageChats());
  };

  return (
      <div
          data-collapsed={isCollapsed}
          className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
      >
        <div className="flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
          <Button
              onClick={() => {
                router.push("/");
                setMessages([]);
                if (closeSidebar) {
                  closeSidebar();
                }
              }}
              variant="ghost"
              className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center"
          >
            <div className="flex gap-3 items-center">
              New chat
            </div>
            <SquarePen size={18} className="shrink-0 w-4 h-4"/>
          </Button>

          <div className="flex flex-col pt-10 gap-2">
            <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
            {localChats.length > 0 && (
                <div className="space-y-1">
                  {localChats.map(({chatId, messages}, index) => (
                      <Link
                          key={index}
                          href={`/${chatId.substr(5)}`}
                          className={cn(
                              {
                                [buttonVariants({variant: "secondaryLink"})]:
                                chatId.substring(5) === selectedChatId,
                                [buttonVariants({variant: "ghost"})]:
                                chatId.substring(5) !== selectedChatId,
                              },
                              "flex justify-between w-full h-14 text-base font-normal items-center group/item"
                          )}
                      >
                        <div className="flex gap-3 items-center min-w-0 flex-1 pr-2">
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-normal truncate max-w-full">
                              {messages.length > 0 ? messages[0].content : "Empty chat"}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex justify-end items-center opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal size={15} className="shrink-0"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="shrink-0 w-4 h-4"/>
                                  Delete chat
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader className="space-y-4">
                                  <DialogTitle>Delete chat?</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this chat? This
                                    action cannot be undone.
                                  </DialogDescription>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteChat(chatId)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Link>
                  ))}
                </div>
            )}
            {isLoading && <SidebarSkeleton/>}
          </div>
        </div>

        <div className="justify-end flex flex-col items-center px-2 py-4 gap-2">
          <a
              href="https://x.com/createai_xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 min-w-0"
          >
            <Image
                src="/twitter.png"
                alt="Twitter Logo"
                width={24}
                height={24}
                className="shrink-0"
            />
            <span className="text-sm font-medium text-muted-foreground truncate">Follow us on Twitter</span>
          </a>
          <a
              href="https://t.me/CR8AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 min-w-0"
          >
            <Image
                src="/telegram.png"
                alt="Telegram Logo"
                width={24}
                height={24}
                className="shrink-0"
            />
            <span className="text-sm font-medium text-muted-foreground truncate">Join us on Telegram</span>
          </a>
          <UserSettings/>
        </div>
      </div>
  );
}
