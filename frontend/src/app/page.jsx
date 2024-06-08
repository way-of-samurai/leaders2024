import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
    <>
      <Input value="Привет, я input!" />
      <Textarea value="Привет, я textarea!" />
      <Button>Отправить</Button>
    </>
  )
}
