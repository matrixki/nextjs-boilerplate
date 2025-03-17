"use client";
import { Box, Flex, VStack, Button, Text } from "@chakra-ui/react";
import { FiHome, FiMessageSquare, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex height="100vh">
      {/* ✅ Sidebar */}
      <Box w="260px" bg="gray.800" color="white" p={5}>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Dashboard
          </Text>

          <Link href={"/"} passHref>
            <Button
              leftIcon={<FiHome />}
              w="100%"
              justifyContent="flex-start"
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.100", color: "gray.800" }}
            >
              Home
            </Button>
          </Link>
          <Link href={"/chat"} passHref>
            <Button
              leftIcon={<FiMessageSquare />}
              w="100%"
              justifyContent="flex-start"
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.100", color: "gray.800" }}
            >
              Chat
            </Button>
          </Link>

          {/* ✅ Sign Out Button */}
          <Button
            leftIcon={<FiLogOut />}
            variant="outline"
            background="red.600"
            color="white"
            border="none"
            _hover={{ bg: "red.700", color: "white" }}
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </VStack>
      </Box>

      {/* ✅ Main Content Area */}
      <Box
        flex="1"
        p={6}
        bg="gray.100"
        position={"relative"}
        overflowY={"auto"}
      >
        {children}
      </Box>
    </Flex>
  );
}
