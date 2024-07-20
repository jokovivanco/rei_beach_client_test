import { UserValidation } from '@/validators/user-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/mutations/userMutation';
import { useNavigate } from '@tanstack/react-router';

const LoginForm = () => {
  const { mutate, isPending } = useLogin();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof UserValidation.LOGIN>>({
    resolver: zodResolver(UserValidation.LOGIN),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof UserValidation.LOGIN>) {
    mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.access_token);
        navigate({ to: '/dashboard' });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="text"
                  placeholder="Username"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full py-4">
          {isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
