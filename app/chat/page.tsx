"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { AddIcon } from "@chakra-ui/icons";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function Chat() {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast(); // ✅ Initialize Chakra Toast

  // ✅ Fetch previous chat messages when page loads
  useEffect(() => {
    async function fetchChatHistory() {
      if (!session?.user?.id) return;
      try {
        const response = await axios.get(
          `/api/conversations?userId=${session.user.id}`
        );
        setChatHistory(
          response.data.conversations
            .filter((msg: any) => msg.source === "dashboard") // ✅ Keep only "dashboard" messages
            .flatMap((msg: any) => [
              { role: "user", content: msg.user_message }, // ✅ User message
              { role: "bot", content: msg.bot_response }, // ✅ Bot response
            ])
        );
      } catch (error) {
        console.error("❌ Error fetching chat history:", error);
      }
    }

    fetchChatHistory();
  }, [session]);

  async function sendMessage() {
    if (!message.trim()) return;

    try {
      const response = await axios.post("/api/chat", {
        message,
        userId: session?.user?.id, // ✅ Pass userId
      });
      console.log("🤖 API Response:", response.data.response);

      setChatHistory([
        ...chatHistory,
        { role: "user", content: message },
        { role: "bot", content: response.data.response }, // ✅ Ensure correct data format
      ]);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", session?.user?.id || "");

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Show Success Toast
      toast({
        title: "File Uploaded Successfully",
        description: `📂 ${file.name} has been uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setChatHistory([
        ...chatHistory,
        { role: "user", content: `📂 Uploaded file: ${file.name}` },
        { role: "bot", content: response.data.message },
      ]);
    } catch (error) {
      console.error("❌ File Upload Error:", error);
    }

    setUploading(false);
    setSelectedFile(null);
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <Flex w="100%" direction="column">
          <Heading>Chat with VL Bot</Heading>
          <VStack
            w="100%"
            height="calc(100vh - 160px)"
            background="white"
            my="20px"
            padding={5}
            borderRadius="16px"
            overflowY={"scroll"}
          >
            {chatHistory.map((msg, index) => (
              <Flex
                key={`message-${index}`}
                direction="column"
                align={msg.role === "user" ? "flex-end" : "flex-start"} // ✅ Align label with message
                w="100%"
              >
                {/* ✅ Name Label Above Message */}
                <Text fontSize="sm" color="gray.500" mb="2px">
                  {msg.role === "user" ? "You" : "VL Bot"}
                </Text>

                {/* ✅ Message Bubble */}
                <Flex
                  maxW="50%" // ✅ Limit max width
                  p="10px"
                  bg={msg.role === "user" ? "blue.100" : "gray.200"} // ✅ Different colors
                  color="gray.800"
                  borderRadius="10px"
                  mb="10px"
                  alignSelf={msg.role === "user" ? "flex-end" : "flex-start"} // ✅ Align right for user, left for bot
                >
                  {msg.content}
                </Flex>
              </Flex>
            ))}
          </VStack>
          <Flex
            w="calc(100% - 48px)"
            h="40px"
            flexDirection="row"
            position={"absolute"}
            bottom={0}
            left={"24px"}
            background={"white"}
          >
            {/* ✅ File Upload Button */}
            <label htmlFor="file-upload">
              <IconButton
                aria-label="Upload file"
                icon={<AddIcon />} // ✅ Using Chakra's AddIcon
                background="gray.300"
                color="gray.700"
                _hover={{ bg: "gray.400" }}
                as="span"
                cursor="pointer"
              />
            </label>
            <Input
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileUpload}
            />
            <Flex position={"relative"} w="100%">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Talk to our bot..."
                w="calc(100% - 100px)"
              />
              <Button
                w="100px"
                position="absolute"
                right="0"
                background="gray.600"
                color={"white"}
                _hover={{ bg: "gray.700", color: "white" }}
                onClick={sendMessage}
              >
                Send
              </Button>
            </Flex>
          </Flex>
          {/* </div> */}
        </Flex>
      </DashboardLayout>
    </AuthGuard>
  );
}
