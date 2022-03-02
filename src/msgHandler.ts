import * as sendMusic from "./musicDownloader";

const prefix: String = '-';
const commands = {
    Hi: sayHi,
    play: sendMusic.fromYt
}

export default async function msgHandler(sock, m): Promise<void> {
    const msg = processMsg(m);
    if (!msg) return;
    if (msg.toLowerCase() === 'hi') {
        return await commands['Hi'](sock, m);
    }
    if (msg[0] === prefix) {
        for (const command in commands) {
            if (msg.slice(1).split(' ')[0] === command) {
                return await commands[command](sock, m);
            } 
        }
        return;
    }
    return;
}

export async function msgUpdate(sock, msgUp){

}

export function processMsg(m): String {
    if (m.messages[0].message) return m.messages[0].message.conversation;
    return;
}

async function sayHi(sock, m): Promise<void> {
    await sock.sendReadReceipt(m.messages[0].key.remoteJid, m.messages[0].key.participant, [m.messages[0].key.id]);
    await sock.sendMessage(m.messages[0].key.remoteJid, { text: "Hello!" }, { quoted: m.messages[0]});
}