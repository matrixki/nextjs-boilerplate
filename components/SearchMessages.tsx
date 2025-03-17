"use client";

import { useState } from "react";
import { Input, Button, VStack, Text, Box, Flex, Link } from "@chakra-ui/react";

interface SlackMessage {
  text: string;
  timestamp: string;
  slackLink: string;
}

export default function SearchMessages() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SlackMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/metrics/search-messages?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.messages);
      } else {
        setError(data.error || "Failed to fetch results.");
      }
    } catch (err) {
      console.error("❌ Error searching conversations:", err);
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <VStack w="100%" spacing={4} align="start">
      {/* 🔍 Search Input */}
      <Flex w="100%">
        <Input
          placeholder="Search Slack messages..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          ml={2}
          onClick={handleSearch}
          isLoading={loading}
          colorScheme="blue"
        >
          Search
        </Button>
      </Flex>

      {/* 📝 Error Message */}
      {error && <Text color="red.500">{error}</Text>}

      {/* 📜 Search Results */}
      {searchResults.length > 0 && (
        <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          {searchResults.map((msg, index) => (
            <Box key={index} p={2} mb={2} borderBottom="1px solid #ddd">
              <Text fontSize="sm" color="gray.500">
                {new Date(msg.timestamp).toLocaleString()}
              </Text>
              <Text>{msg.text}</Text>
              <Link href={msg.slackLink} color="blue.500" isExternal>
                🔗 View in Slack
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  );
}
