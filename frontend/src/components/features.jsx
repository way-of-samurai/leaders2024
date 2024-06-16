"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Check, Pencil, Trash2, X } from "lucide-react"
import { useState } from "react"

export function NewFeature({ feature, value, onDone, onCancel }) {
  const [newFeature, setNewKey] = useState(feature || "")
  const [newValue, setNewValue] = useState(value || "")

  return (
    <TableRow>
      <TableCell>
        <Input
          placeholder="Признак"
          defaultValue={feature}
          onChange={(event) => setNewKey(event.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Значение"
          defaultValue={value}
          onChange={(event) => setNewValue(event.target.value)}
        />
      </TableCell>
      <TableCell className="flex flex-row justify-end text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!newFeature || !newValue}
          onClick={() => onDone(newFeature, newValue)}
        >
          <Check className="h-[1.1rem] w-[1.1rem]" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onCancel()}
        >
          <X className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function Feature({ feature, value, onChange, onDelete }) {
  const [editing, setEditing] = useState("")

  if (editing) {
    return (
      <NewFeature
        feature={feature}
        value={value}
        onDone={(newFeature, newValue) => {
          setEditing(false)
          onChange(newFeature, newValue)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <TableRow>
      <TableCell className="overflow-hidden">{feature}</TableCell>
      <TableCell className="overflow-hidden">{value}</TableCell>
      <TableCell className="flex flex-row justify-end text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-[1.1rem] w-[1.1rem]" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function Features({ className, defaultValue, onChange }) {
  const [features, setFeatures] = useState(defaultValue)
  const [adding, setAdding] = useState(false)

  const featuresWithoutKey = (key) =>
    Object.keys(features)
      .filter((k) => k !== key)
      .reduce((acc, k) => Object.assign(acc, { [k]: features[k] }), {})

  return (
    <div className={cn("", className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setAdding(true)}
      >
        Добавить признак
      </Button>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Признак</TableHead>
            <TableHead>Значение</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <NewFeature
              onDone={(newFeature, newValue) => {
                setAdding(false)
                Object.assign(features, { [newFeature]: newValue })
              }}
              onCancel={() => setAdding(false)}
            />
          )}
          {Object.entries(features).map(([key, value]) => (
            <Feature
              key={key}
              feature={key}
              value={value}
              onChange={(newFeature, newValue) => {
                const features = Object.assign(featuresWithoutKey(key), {
                  [newFeature]: newValue,
                })
                setFeatures(features)
                onChange(features)
              }}
              onDelete={() => {
                setFeatures(featuresWithoutKey(key))
                onChange(features)
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
