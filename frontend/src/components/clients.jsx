"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { createClient, deleteClient, updateClient } from "@/app/actions"
import Features from "@/components/features"
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
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Пожалуйста, укажите имя клиента"),
  features: z.object({}).passthrough(),
})

export function ClientDialog({ client, children }) {
  if (!client) {
    client = {
      name: "",
      features: {},
    }
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: client,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование клиента</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                let res = null
                if (!client.id) {
                  res = await createClient(values)
                } else {
                  res = await updateClient(values)
                }

                if (res !== null) {
                  window.location.reload()
                }
              })}
              className="flex flex-col items-stretch gap-4"
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя клиента</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Имя клиента"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Признаки клиента</FormLabel>
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
                Сохранить
              </SubmitButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ClientRow({ client }) {
  return (
    <TableRow className="cursor-pointer">
      <TableCell>{client.id}</TableCell>
      <TableCell className="overflow-hidden">{client.name}</TableCell>
      <TableCell className="overflow-hidden">
        {JSON.stringify(client.features)}
      </TableCell>
      <TableCell className="flex flex-row justify-end text-right">
        <ClientDialog client={client}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
          >
            <Pencil className="h-[1.1rem] w-[1.1rem]" />
          </Button>
        </ClientDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
            >
              <Trash2 className="h-[1.1rem] w-[1.1rem]" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Вы уверены, что хотите удалить клиента?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const res = await deleteClient(client.id)
                  if (res !== null) {
                    window.location.reload()
                  }
                }}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}

export default function Clients({ className, clients }) {
  return (
    <div className={cn("", className)}>
      <ClientDialog>
        <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          Добавить клиента
        </Button>
      </ClientDialog>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Признаки</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients
            .toSorted((a, b) => ("" + a.name).localeCompare(b.name))
            .map((client, index) => (
              <ClientRow
                key={index}
                client={client}
                onClick={() => {}}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
