import LoginForm from '@/app/ui/auth/login-form';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
