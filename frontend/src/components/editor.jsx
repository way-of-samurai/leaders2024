"use client"

import { Fragment, forwardRef, useEffect, useRef, useState } from "react"
import {
  Image as KImage,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva"
import useImage from "use-image"

const Transformable = ({
  Component,
  isSelected,
  onSelect,
  onChange,
  ...props
}) => {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <Fragment>
      <Component
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...props}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...props,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          // we will reset it back
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            ...props,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </Fragment>
  )
}
Transformable.displayName = "Transformable"

export const Editor = forwardRef(
  (
    {
      width,
      height,
      scaleX,
      scaleY,
      imageUrl,
      imageWidth,
      imageHeight,
      text,
      textSize,
      bgColor,
    },
    ref,
  ) => {
    const [image] = useImage(imageUrl)
    const [imageState, setImageState] = useState({
      x: width - imageWidth - width * 0.04,
      y: height / 2 - imageHeight / 2,
    })
    const [textState, setTextState] = useState({
      x: width * 0.04,
      y: height * 0.2,
    })

    const [selected, setSelected] = useState(false)

    const checkDeselect = (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage()
      if (clickedOnEmpty) {
        setSelected(false)
      }
    }

    return (
      <Stage
        ref={ref}
        width={width}
        height={height}
        scaleX={scaleX}
        scaleY={scaleY}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={bgColor}
            listening={false}
          />
          <Transformable
            {...textState}
            Component={Text}
            text={text}
            fontSize={textSize}
            fill="#fff"
            letterSpacing={1}
            fontStyle="normal"
            scale={{ x: 2, y: 2 }}
            draggable
            isSelected={selected == "text"}
            onSelect={() => {
              setSelected("text")
            }}
            onChange={(newState) => {
              setTextState({ ...textState, ...newState })
            }}
          />
          <Transformable
            {...imageState}
            Component={KImage}
            image={image}
            isSelected={selected == "image"}
            onSelect={() => {
              setSelected("image")
            }}
            onChange={(newState) => {
              setImageState({ ...imageState, ...newState })
            }}
          />
        </Layer>
      </Stage>
    )
  },
)
Editor.displayName = "Editor"

export default Editor
