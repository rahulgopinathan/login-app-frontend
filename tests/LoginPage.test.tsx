import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginPage from "../src/pages/LoginPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("renders email, password inputs and submit button", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("navigates to /hello-world on successful login", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Login successful", email: "user@example.com" }),
    } as Response);

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hello-world"));
  });

  it("shows error message on invalid credentials", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    } as Response);

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials")
    );
  });

  it("disables button while logging in", async () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });
});
