"use client"

import { generate } from "@/app/actions"
import Features from "@/components/features"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  prompt: z.string(),
  width: z.coerce
    .number()
    .min(1, "Ширина должна быть больше нуля")
    .max(4096, "Максимальная ширина - 4096px"),
  height: z.coerce
    .number()
    .min(1, "Высота должна быть больше нуля")
    .max(4096, "Максимальная высота - 4096px"),
  client_id: z.string(),
  features: z.object({}).passthrough(),
})

export default function GenerateForm({ clients, onSubmit, onDone, className }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      width: 2368,
      height: 432,
      client_id: clients[0].id,
      features: {},
      prompt: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          console.log(values)
          onSubmit(values)
          const resp = await generate(values)
          onDone(resp)
        })}
        className={cn("flex flex-col items-stretch gap-4", className)}
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Запрос"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-stretch gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ширина</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="number"
                    max={4096}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Высота</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="number"
                    max={4096}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Клиент</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Клиент" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Признаки продукта</FormLabel>
              <FormControl>
                <Features
                  className="w-full"
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <SubmitButton
          className="mt-4"
          disabled={!form.formState.isValid}
        >
          Сгенерировать
        </SubmitButton>
      </form>
    </Form>
  )
}
