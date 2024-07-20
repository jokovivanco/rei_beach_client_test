import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
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

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { privateAxios } from '@/apis/axios';

const formSchema = z.object({
  name: z.string(),
  availability: z.boolean().default(false),
  price: z.coerce.number(),
  capital_price: z.coerce.number(),
  category_id: z.coerce.number(),
  image: z
    .any()
    .refine(
      (files) => {
        return Array.from(files).every((file) => file instanceof File);
      },
      { message: 'Expected a file' },
    )
    .refine(
      (files) =>
        Array.from(files).every((file: any) =>
          ['jpg', 'jpeg', 'png', 'webp'].includes(file.type),
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp',
    )
    .optional(),
});

export const Route = createFileRoute('/_authenticated/test')({
  component: Test,
});

function Test() {
  const { mutate } = useMutation({
    mutationFn: async (data: FormData): Promise<any> => {
      const response = await privateAxios.post('/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      availability: false,
      price: 0,
      capital_price: 0,
      category_id: 1,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { image, ...field } = values;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('document', JSON.stringify(field));
    mutate(formData);
    // {"name": "seblak", "availability": true, "price": 12000, "capital_price": 10000, "category_id": 1}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-start gap-2 pl-8 pt-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ketersediaan</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>price</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capital_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>capital_price</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>category_id</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>category_id</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Picture"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
