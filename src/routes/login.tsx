import AuthContainer from '@/components/containers/AuthContainer';
import LoginForm from '@/components/forms/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="container">
        <AuthContainer>
          <img src="/logo-login.png" alt="logo" className="w-fit mx-auto" />
          <LoginForm />
        </AuthContainer>
      </div>
    </div>
  );
}
