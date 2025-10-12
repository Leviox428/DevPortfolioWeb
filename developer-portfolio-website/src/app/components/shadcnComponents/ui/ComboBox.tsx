"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {  
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface ComboBoxProps {
  programmingLanguages: string[];
  searchPlaceHolderText: string;
  selectionPlaceHolderText: string;
  width: number;
  notFoundText: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}

export function ComboBox({ programmingLanguages, searchPlaceHolderText, notFoundText, selectionPlaceHolderText, width, setSelection }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          style={{ width: `${width}px` }}
          className="w-auto justify-between"
        >
          {value
            ? programmingLanguages.find((language) => language === value)
            : selectionPlaceHolderText}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[260px] p-0 bg-zinc-800/90"
        style={{ width: `${width}px` }}
        >
        <Command>
          <CommandInput placeholder={searchPlaceHolderText} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {programmingLanguages.map((language) => (
                <CommandItem
                  key={language}
                  value={language}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setSelection(currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}