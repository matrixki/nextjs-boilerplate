"use client";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import {
  Heading,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Box,
  Text,
  Progress,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import SearchMessages from "@/components/SearchMessages";

interface HotKeywordsData {
  hotKeywords: string[];
}

interface MetricsCardProps {
  title: string;
  children: React.ReactNode;
}

interface QueryTrend {
  date: string;
  query_count: number;
}

interface TopUser {
  user_id: string;
  query_count: number;
}

interface UserTrend {
  user_id: string;
  date: string;
  query_count: number;
}

interface ResponseEffectivenessData {
  total: number;
  resolved: number;
  effectiveness: string;
}

export default function Home() {
  const [hotkeywords, setHotkeywords] = useState<HotKeywordsData>({
    hotKeywords: [],
  });
  const [queryTrends, setQueryTrends] = useState<
    { date: string; query_count: number }[]
  >([]);
  const [keywordTrends, setKeywordTrends] = useState<
    { date: string; keyword: string; count: number }[]
  >([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [userTrends, setUserTrends] = useState<UserTrend[]>([]);
  const [responseEffectivenessData, setResponseEffectivenessData] =
    useState<ResponseEffectivenessData | null>(null);
  const [messagesSummary, setMessagesSummary] =
    useState<string>("Loading summary...");

  useEffect(() => {
    async function fetchHotKeywords() {
      try {
        const response = await fetch("/api/metrics/hot-keywords");
        const data: HotKeywordsData = await response.json();
        console.log("🔥 Hot Keywords:", data.hotKeywords);
        setHotkeywords({ hotKeywords: data.hotKeywords }); // ✅ Set state only once
      } catch (error) {
        console.error("❌ Error fetching hot keywords:", error);
      }
    }

    fetchHotKeywords(); // ✅ Call API only once when page loads
  }, []);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await fetch("/api/metrics/trend");
        const data = await response.json();

        console.log("📊 Query Trends:", data.queryTrends);
        console.log("🔍 Keyword Trends:", data.keywordTrends);

        setQueryTrends(data.queryTrends);
        setKeywordTrends(data.keywordTrends);
      } catch (error) {
        console.error("❌ Error fetching trends:", error);
      }
    }

    fetchTrends();
  }, []);

  // ✅ Merge Query Trends & Keyword Trends
  const combinedTrends = queryTrends.map((query) => {
    const keywordData = keywordTrends.find((kw) => kw.date === query.date);
    return {
      date: query.date,
      query_count: query.query_count,
      keyword_count: keywordData ? keywordData.count : 0, // Set keyword count to 0 if no match
    };
  });

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const response = await fetch("/api/metrics/top-users");
        const data = await response.json();
        console.log("🏆 Top Users:", data.topUsers);
        setTopUsers(data.topUsers);
      } catch (error) {
        console.error("❌ Error fetching top users:", error);
      }
    }

    fetchTopUsers();
  }, []);

  useEffect(() => {
    async function fetchUserTrends() {
      try {
        const response = await fetch("/api/metrics/user-trends");
        const data = await response.json();
        console.log("📈 User Trends:", data.userTrends);
        setUserTrends(data.userTrends);
      } catch (error) {
        console.error("❌ Error fetching user trends:", error);
      }
    }

    fetchUserTrends();
  }, []);

  useEffect(() => {
    async function fetchEffectiveness() {
      try {
        const response = await fetch("/api/metrics/response-effectiveness");
        const result = await response.json();
        console.log("📊 Response Effectiveness Data:", result);
        setResponseEffectivenessData(result);
      } catch (error) {
        console.error("❌ Error fetching response effectiveness:", error);
      }
    }

    fetchEffectiveness();
  }, []);

  // ✅ Fetch Slack message summary
  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/metrics/messages-summary");
        const result = await response.json();
        console.log("📝 Summary:", result);
        setMessagesSummary(result?.summary || "No summary available.");
      } catch (error) {
        console.error("❌ Error fetching summary:", error);
      }
    }
    fetchSummary();
  }, []);

  const MetricsCard: React.FC<MetricsCardProps> = ({ title, children }) => {
    return (
      <Card p={4} borderRadius="md" boxShadow="md" w="100%">
        <CardHeader>
          <Heading size="sm">{title}</Heading>
        </CardHeader>
        <CardBody>{children}</CardBody>
      </Card>
    );
  };

  const TrendChart: React.FC<{ data: QueryTrend[] }> = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />

          {/* 🔵 Query Trend Line */}
          <Line
            type="monotone"
            dataKey="query_count"
            stroke="#3182ce"
            strokeWidth={2}
            name="Total Queries"
          />

          {/* 🔴 Keyword Trend Line */}
          <Line
            type="monotone"
            dataKey="keyword_count"
            stroke="#e63946"
            strokeWidth={2}
            name="Keyword Mentions"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const UserTrendChart: React.FC<{ data: UserTrend[] }> = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userTrends}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          {/* 🔵 User Trends Line */}
          <Line
            type="monotone"
            dataKey="query_count"
            stroke="#3182ce"
            strokeWidth={2}
            name="User Queries"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Heading as="h2" size="lg" mb="20px">
          VL Bot Dashboard
        </Heading>
        <Flex
          w="100%"
          direction="row"
          justifyContent="space-between"
          gap={16}
          mb="20px"
        >
          <Flex w="100%">
            <MetricsCard title="Top 10 Keywords from the slack channel">
              <Box>
                {hotkeywords.hotKeywords.map((keyword, index) => (
                  <Text key={index} pt="2" fontSize="sm">
                    {index + 1}. {keyword}
                  </Text>
                ))}
              </Box>
            </MetricsCard>
          </Flex>
          <Flex w="100%">
            <MetricsCard title="📊 Query Volume Over Time">
              <Flex w="100%" direction="column" align={"center"}>
                <TrendChart data={combinedTrends} />
              </Flex>
            </MetricsCard>
          </Flex>
        </Flex>
        <Flex
          w="100%"
          direction="row"
          justifyContent="space-between"
          gap={16}
          mb="20px"
        >
          <Flex w="100%">
            <MetricsCard title="Top 5 users by most queries">
              <Box>
                {topUsers.map((user, index) => (
                  <Text key={index} pt="2" fontSize="sm">
                    {index + 1}. <strong>{user.user_id}</strong> -{" "}
                    {user.query_count} queries
                  </Text>
                ))}
              </Box>
            </MetricsCard>
          </Flex>
          <Flex w="100%">
            <MetricsCard title="📈 User Query Trends">
              <Flex w="100%" direction="column" align={"center"}>
                <UserTrendChart data={userTrends} />
              </Flex>
            </MetricsCard>
          </Flex>
        </Flex>
        <Flex
          w="100%"
          direction="row"
          justifyContent="space-between"
          gap={16}
          mb="20px"
        >
          <Flex w="100%">
            <MetricsCard title="📊 Response Effectiveness">
              <Box>
                <Box my="10px">
                  <b>Total Queries</b>: {responseEffectivenessData?.total}
                </Box>
                <Box my="10px">
                  <b>Resolved Queries</b>: {responseEffectivenessData?.resolved}
                </Box>
                <Box my="10px">
                  <b>Effectiveness Rate</b>:{" "}
                  {responseEffectivenessData?.effectiveness}%
                </Box>
                <Progress
                  value={parseFloat(
                    responseEffectivenessData?.effectiveness || "0"
                  )}
                  size="lg"
                  colorScheme="green"
                  my="10px"
                />
              </Box>
            </MetricsCard>
          </Flex>
          <Flex w="100%">
            <MetricsCard title="🔍 Slack Message Summary">
              <Heading as="h6" size="sm" mb="16px">
                Summary of yesterday's channel messages:
              </Heading>
              <Box>{messagesSummary}</Box>
            </MetricsCard>
          </Flex>
        </Flex>
        <Flex
          w="100%"
          direction="row"
          justifyContent="space-between"
          gap={16}
          mb="20px"
        >
          <Flex w="100%">
            <MetricsCard title="🔍 Search Past Slack Messages">
              <SearchMessages />
            </MetricsCard>
          </Flex>
        </Flex>
      </DashboardLayout>
    </AuthGuard>
  );
}
