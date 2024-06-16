"use client"

import Editor from "@/components/editor"
import GenerateForm from "@/components/generate-form"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import { useSize } from "@/lib/hooks"
import { downloadURI } from "@/lib/utils"
import { Save } from "lucide-react"
import { useRef, useState } from "react"

export default function GeneratePanel({ className, clients }) {
  const [pending, setPending] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageSize, setImageSize] = useState({ height: 380, width: 380 })
  const [size, setSize] = useState({ height: 2368, width: 432 })
  const [text, setText] = useState("")
  const [textSize, setTextSize] = useState(30)
  const [bgColor, setBgColor] = useState("#ffffff")

  const containerRef = useRef(null)
  const containerSize = useSize(containerRef)
  const canvasScale = containerSize?.width / size.width

  const canvasRef = useRef(null)

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
          clients={clients}
          onSubmit={({ height, width }) => {
            setPending(true)
            setSize({ height: height, width: width })
          }}
          onDone={({ url, width, height, background }) => {
            setPending(false)
            setImageUrl(url)
            setImageSize({ width: width, height: height })
            setBgColor(background)
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div
          className="flex flex-col items-center m-4"
          ref={containerRef}
        >
          <div className="w-full flex flex-row justify-between gap-2 mb-4">
            <Input
              placeholder="Текст"
              disabled={!imageUrl}
              onChange={(event) => {
                setText(event.target.value)
              }}
            />
            <Input
              className="w-20"
              type="number"
              defaultValue={textSize}
              max={99}
              disabled={!imageUrl}
              onChange={(event) => {
                setTextSize(event.target.value)
              }}
            />
            <Input
              className="w-20"
              type="color"
              disabled={!imageUrl}
              defaultValue={bgColor}
              onChange={(event) => {
                setBgColor(event.target.value)
              }}
            />
            <Button
              disabled={!imageUrl}
              onClick={() => {
                const canvas = canvasRef?.current
                const oldScale = canvas.scale()
                canvas.scale({ x: 1, y: 1 })
                const uri = canvas.toDataURL({
                  mimeType: "image/png",
                  width: size.width,
                  height: size.height,
                })
                canvas.scale(oldScale)

                downloadURI(uri, "image.png")
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
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
            <div className="mx-auto">
              <Editor
                ref={canvasRef}
                width={size.width}
                height={size.height}
                scaleX={canvasScale}
                scaleY={canvasScale}
                imageUrl={imageUrl}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
                text={text}
                textSize={textSize}
                bgColor={bgColor}
              />
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
