"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Flex, Button, Box, Image } from "@chakra-ui/react";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // ✅ Redirect logged-in users to home
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // ✅ Show a loading state while checking session
  }

  return (
    <Flex width="100%" height="100vh" justify="center" align="center">
      <Flex
        w="300px"
        height="260px"
        direction="column"
        justify="center"
        align="center"
        border="1px solid #CBD5E0"
        borderRadius="12px"
      >
        <Box
          fontWeight={500}
          fontSize="24px"
          lineHeight="30px"
          marginBottom={5}
        >
          Sign In
        </Box>
        <Button
          onClick={() => signIn("slack")}
          backgroundColor="#611f69"
          color="#ffffff"
          _hover={{ backgroundColor: "#611f69" }}
        >
          <Image
            src="https://a.slack-edge.com/fd21de4/marketing/img/nav/logo.svg"
            width="20px"
            height="20px"
            mr="8px"
          />{" "}
          Sign in with Slack
        </Button>
      </Flex>
    </Flex>
  );
}
