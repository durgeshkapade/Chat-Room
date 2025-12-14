import { WebSocketServer, WebSocket } from "ws"

const wss = new WebSocketServer({ port: 8080 })

interface User {
    socket: WebSocket,
    room: string
}

let allScoket: User[] = [];


wss.on("connection", (socket) => {

    const statusMsg = {
        "type": "status",
        "payload": {
            "status": "online"
        }
    }

    socket.send(JSON.stringify(statusMsg))

    socket.on("message", (message) => {

        const parsedMessage = JSON.parse(message as unknown as string);

        if (parsedMessage.type == "join") {
            console.log("Room Connect");
            allScoket.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        

        if (parsedMessage.type == "chat") {

            console.log("Chat Connect");
            let currentUserRoom = parsedMessage.payload.roomId;

            const response = {
                type: "message",
                payload: {
                    message: parsedMessage.payload.message,
                    username: parsedMessage.payload.username
                }
            }


            for (let i = 0; i < allScoket.length; i++) {
                if (allScoket[i]?.room == currentUserRoom) {
                    // @ts-ignore
                    allScoket[i].socket.send(JSON.stringify(response))
                }
            }
        }


    })

    socket.on("close", () => {
        const index = allScoket.findIndex(u => u.socket === socket);
        if (index !== -1) {
            allScoket.splice(index, 1);
        }
    });

})





    // {
    //     "type" : "join",
    //     "payload" :{
    //         "roomId" : ""
    //     }
    // }
    // chat message
    // {
    //     "type" : "message",
    //     "payload" :{
    //         "message" : ""
    //         "roomId" : ""
    //         "username" :""
    //     }
    // }
    // Server Message
    // {
    //     "type" : "message",
    //     "payload" :{
    //         "username" : "",
    //         "message" : "" 
    //     }
    // }











