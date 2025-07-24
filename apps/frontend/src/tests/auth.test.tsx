import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "@/hooks";
import { LoginForm } from "@/components/features/auth";
import { AuthGuard } from "@/components/features/auth";
import { useAuthStore } from "@/store";

jest.mock("@/hooks");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Authentication Flow", () => {
  it("should log in a user and protect a route", () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("auth:email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth:password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("auth:login"));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
