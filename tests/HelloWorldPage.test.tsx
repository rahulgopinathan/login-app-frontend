import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import HelloWorldPage from "../src/pages/HelloWorldPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderHelloWorldPage() {
  return render(
    <MemoryRouter>
      <HelloWorldPage />
    </MemoryRouter>
  );
}

describe("HelloWorldPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("shows loading state initially", () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise(() => {})
    );

    renderHelloWorldPage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the message returned from the API", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Hello, World!" }),
    } as Response);

    renderHelloWorldPage();

    await waitFor(() =>
      expect(screen.getByRole("heading")).toHaveTextContent("Hello, World!")
    );
  });

  it("shows error when API call fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);

    renderHelloWorldPage();

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to fetch message")
    );
  });

  it("navigates to /login when logout is clicked", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Hello, World!" }),
    } as Response);

    renderHelloWorldPage();

    await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
