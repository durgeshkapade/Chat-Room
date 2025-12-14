import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

import type { Dispatch, SetStateAction } from "react";


interface UsernameModalProps {
  setUsername : Dispatch<SetStateAction<string | null>>;
  isOpen : boolean | undefined
}

export function UsernameModal({setUsername ,isOpen} : UsernameModalProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSetUsername = ()=>{
    const name = inputRef.current?.value || null;
    setUsername(name)
  }

  return (
    <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
            <DialogDescription>
              This name will be visible to others in the chat room.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between ">
            <div className="w-full mr-2">
                <Input id="name-1" ref={inputRef} className="" name="name" placeholder="Enter Your Name" />
            </div>
            <DialogFooter>
                <Button onClick={handleSetUsername} type="submit">Set</Button>
            </DialogFooter>
          </div>
        </DialogContent>
    </Dialog>
  )
}
