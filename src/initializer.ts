import makeWASocket, { useSingleFileAuthState, DisconnectReason } from "@adiwajshing/baileys";
import { Boom } from '@hapi/boom';

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

export default function startSock() {
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                return startSock();
            } else {
                console.log('Connection Closed');
            }
        } else if(connection ==='open') {
            console.log('Connection Opened');
            
        }
        if (qr) {
            
        } 
    });

    sock.ev.on('creds.update', saveState);

    return sock;

}
