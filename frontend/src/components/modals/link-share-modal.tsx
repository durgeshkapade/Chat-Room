
  import { Button } from "@/components/ui/button"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { X } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";

  interface LinkShareModalProps {
    generatedLink: string | null;
    isOpen: boolean;
     onClose: () => void;
  }



  export function LinkShareModal({ generatedLink, isOpen, onClose } : LinkShareModalProps) {

    const navigate = useNavigate()

    const handleJoin = ()=>{
      navigate(window.location.href + "chat/"+ generatedLink)
    }


    const handleCopyLink = (link: string) => {
      navigator.clipboard.writeText(link).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch(err => {
        toast.error("Failed to copy link.");
        console.error("Copy failed", err);
      });
    };




    return (
      <Dialog open={isOpen}  >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Join and Share Link</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Share this link with others or join the room yourself.
          </DialogDescription>


          <div className="flex items-center justify-between gap-2 ">
            <div className="w-full mr-2">
              <Input id="name-1" className="" readOnly value={window.location.href + generatedLink} name="name" placeholder="Enter Your Name" />
            </div>
            <DialogFooter>
              <Button onClick={() => {
                handleCopyLink(window.location.href + generatedLink)
              }} type="button">Copy</Button>
            </DialogFooter>

            <DialogFooter>
              <Button onClick={handleJoin} type="button">Join</Button>
            </DialogFooter>

            <DialogFooter>
              <DialogClose asChild className="absolute top-2 right-2 z-10">
                  <Button onClick={onClose} type="button" size={"icon-sm"} variant="outline">
                    <X/>
                  </Button>
              </DialogClose>
            </DialogFooter>  
          </div>


        </DialogContent>
      </Dialog>
    )
  }
