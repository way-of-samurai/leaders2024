"use client"

import GenerateForm from "@/components/generate-form"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useState } from "react"

export default function GeneratePanel({ className }) {
  const [pending, setPending] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [size, setSize] = useState({ height: 1, width: 1 })

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={className}
    >
      <ResizablePanel
        minSize={15}
        maxSize={50}
        defaultSize={30}
      >
        <GenerateForm
          className="p-4"
          onSubmit={({ height, width }) => {
            setPending(true)
            setSize({ height: height, width: width })
          }}
          onDone={({ url }) => {
            setPending(false)
            setImageUrl(url)
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex flex-col items-center p-4">
          {pending && (
            <AspectRatio
              ratio={size.width / size.height}
              className="w-full h-full mx-auto"
              style={{
                maxHeight: size.height,
                maxWidth: size.width,
              }}
            >
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          )}
          {!pending && imageUrl && (
            <Image
              src={imageUrl}
              alt="Сгенерированное изображение"
              height={size.height}
              width={size.width}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
