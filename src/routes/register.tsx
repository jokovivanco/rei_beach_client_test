import AuthContainer from '@/components/containers/AuthContainer';
import RegisterForm from '@/components/forms/RegisterForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="container">
        <AuthContainer>
          <img src="/logo-login.png" alt="logo" className="w-fit mx-auto" />
          <RegisterForm />
        </AuthContainer>
      </div>
    </div>
  );
}
