import { UsernameModal } from "@/components/modals/username-modal"
import { Button } from "@/components/ui/button"
import cryptoRandomString from 'crypto-random-string';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react";
import { LinkShareModal } from "@/components/modals/link-share-modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import configurations from "@/config/configurations";

export function HomePage() {

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [username , setUsername] = useState<string | null>(localStorage.getItem("username"))
  const showUsernameModal = !username;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();


  useEffect(()=>{
    if (username) {
        localStorage.setItem("username",username)
    }
  },[username])


  useEffect(()=>{
    
    let ws: WebSocket | null = null
    let mounted = true
    ws = new WebSocket(configurations.base_url)

    ws.onmessage = (ev)=>{
      if (!mounted) return
      const data = JSON.parse(ev.data);
      if (data.type === "status") {
        toast.success("Server Connected");
      }
    }

    ws.onerror = () => {
      if (!mounted) return
      toast.error("Server Failure");
    };

    return () => {
      mounted = false
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }

  },[])



  const handleGenerateLink = () => {
    const link = cryptoRandomString({length: 10});
    setGeneratedLink(link);
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Room link copied to clipboard");
    });
  };

  const handleJoin = () =>{
    const value = inputRef.current?.value.trim().toString();
    if (!value) {
      toast.warning("Please enter a Room ID or link");
      return;
    }
    console.log(value);
    
    navigate("/chat/" + value);
  }


  return (

    <div className=' h-screen w-screen flex justify-center items-center'>

      <div className="flex w-full max-w-md flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList className='w-full'>
            <TabsTrigger value="account">Create Room</TabsTrigger>
            <TabsTrigger value="password">Join Room</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Create a Room</CardTitle>
                <CardDescription>Instantly generate a unique chat room link.</CardDescription>
              </CardHeader>
              <CardFooter className='w-full'>
                <Button className='w-full' onClick={handleGenerateLink}>Generate Link</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Join a Room</CardTitle>
                <CardDescription>Enter the Room ID or shared link to join.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">Room Id or Link</Label>
                  <Input id="tabs-demo-new" ref={inputRef} placeholder='eg : abcd1234' type="text" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleJoin} className='w-full'>Join Room</Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      <UsernameModal isOpen={showUsernameModal}  setUsername={setUsername} />
      <LinkShareModal  generatedLink={generatedLink} isOpen={!!generatedLink} onClose={() => setGeneratedLink(null)} />

    </div>
  )
}



export default HomePage