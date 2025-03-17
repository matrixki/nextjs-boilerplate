import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation"; // ✅ Mock this
import Chat from "@/app/chat/page";
import "@testing-library/jest-dom";

// ✅ Mock Next.js `useRouter`
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Chat Component", () => {
  it("renders the chat input and send button", () => {
    // ✅ Mock `useRouter` to prevent invariant error
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    render(
      <SessionProvider session={null}>
        <Chat />
      </SessionProvider>
    );

    // ✅ Assertions
    expect(
      screen.getByPlaceholderText("Talk to our bot...")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});
