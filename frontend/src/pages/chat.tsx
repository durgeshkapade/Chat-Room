import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import configurations from '@/config/configurations';
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


interface Message {
  username: string;
  message: string;
}

interface History {
  roomId: string;
  messages: Message[];
}

function ChatPage() {

  const [message, setMessage] = useState<string | null>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const username = localStorage.getItem('username')
  const { id } = useParams();
  const navigate = useNavigate();

  


  useEffect(() => {
    if(!username){
      navigate("/");
    }

    const chatHistoryStored = localStorage.getItem("chatHistory");
    if (chatHistoryStored) {
      const parsedChatHistory: History[] = JSON.parse(chatHistoryStored);
      parsedChatHistory.forEach(history => {
        if (history.roomId == id) {
          setMessages(history.messages)
        }
      });
    }
  }, [username, navigate,id]);



  useEffect(() => {
    if (wsRef.current) return;
    const ws = new WebSocket(configurations.base_url)
    wsRef.current = ws

    ws.onmessage = (ev) => {
      const parsedData = JSON.parse(ev.data)

      if (parsedData.type === "message") {
        const newMessage: Message = {
          username: parsedData.payload.username,
          message: parsedData.payload.message,
        };

        setMessages((prevMessage) => [...prevMessage, newMessage]);
      }
    };

    ws.onopen = () => {
      const joinMessage = {
        type: "join",
        payload: {
          roomId: id!,
        },
      };
      ws.send(JSON.stringify(joinMessage));
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
        wsRef.current = null;
    }
  }

  }, [id])

  useEffect(() => {
    if (messages.length) {
      const previousHistory = localStorage.getItem("chatHistory");
      if (previousHistory) {
        const updatedHistory: History[] = [
          ...JSON.parse(previousHistory),
          {
            roomId: id,
            messages
          }
        ]
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
      } else {
        localStorage.setItem("chatHistory", JSON.stringify([{
          roomId: id,
          messages
        }]))
      }

    }
  }, [messages, id]);



  function sendMessage() {
    if (wsRef.current && message && username) {
      const chatMessage = {
        type: "chat",
        payload: {
          message,
          username,
          roomId: id,
        },
      };
      wsRef.current.send(JSON.stringify(chatMessage));
      setMessage("");
    }
  }





  return (
    <div className=' h-screen flex items-center justify-center overflow-hidden flex-col'>
      <header className="mb-4 flex  w-[90%] md:w-[70%] lg:w-[38%]  justify-between items-center bg-slate-400 p-4 dark:text-white rounded-t-lg shadow-md">
        <div className="text-lg font-semibold">{username}</div> {/* Display the username */}
      </header>

      <div className=' w-[90%] md:w-[70%] lg:w-[38%] h-[80%]'>
        <div className='h-[90%] bg-black rounded-md text-white flex flex-col overflow-y-scroll   gap-1 p-4 '>


          {messages.map((msg, index) => {
            const isClientMessage = username === msg.username;
            return (
              <div
                key={index}
                className={`flex ${isClientMessage ? "justify-end" : "justify-start"} mb-4`}
              >
                {
                  isClientMessage ?
                    <div className=' font-bold bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-50 rounded-tr-none flex flex-col  px-3 py-1 rounded-md text-[15px]'>
                      <span className='text-[12px] text-gray-500'>{msg.username}</span>
                      <span>{msg.message}</span>
                    </div> :
                    <div className=' font-bold bg-blue-600 text-white dark:bg-blue-500 rounded-tl-none flex flex-col  px-3 py-1 rounded-md text-[15px] '>
                      <span className='text-[12px] text-gray-300 font-bold'>{msg.username}</span>
                      <span>{msg.message}</span>
                    </div>
                }

              </div>
            );
          })}


        </div>
        <div className='h-[10%] border rounded-2xl border-white  flex items-center justify-between gap-2 '>
          <Input ref={inputRef} value={message || ""} onChange={
            (e) => setMessage(e.target.value)
          } placeholder='Enter Message' />

          <div className="flex min-h-svh flex-col items-center justify-center">
            <Button onClick={sendMessage} disabled={!message} className='px-5 py-5'>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
