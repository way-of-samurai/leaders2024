"use client"

import { signIn } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(1, "Пожалуйста, укажите свое имя пользователя"),
  password: z.string().min(1, "Пожалуйста, укажите свой пароль"),
})

export default function SignInForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  })
  const [error, setError] = useState(null)

  return (
    <Form {...form}>
      <form
        action={async (formData) => {
          const res = await signIn(formData)
          setError(res.error)
        }}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Логин"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput
                  required
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className={"text-sm font-medium text-destructive"}>
            Неверный логин или пароль
          </p>
        )}
        <Button
          type="submit"
          className="mt-4"
          disabled={!form.formState.isValid}
        >
          Войти
        </Button>
      </form>
    </Form>
  )
}
