import startSock from "./initializer";
import msgHandler, {msgUpdate, processMsg} from './msgHandler';
import presenceHandler from './presenceHandler';
import express from 'express';

const app = express();
const sock = startSock();

app.get("/", (req, res) => {
    
});

sock.ev.on('messages.upsert', (m) => { if (processMsg(m)) msgHandler(sock, m); console.log(m.messages[0]) });
// sock.ev.on('messages.update', msgUpdate);
// sock.ev.on('message-receipt.update', m => console.log(m));
// sock.ev.on('presence.update', presenceHandler);
// // sock.ev.on('chats.update', m => console.log(m))
// sock.ev.on('contacts.upsert', m => console.log(m))
