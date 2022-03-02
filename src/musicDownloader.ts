import * as fs from 'fs';
import {promisify} from 'util';
import ytdl from "ytdl-core";
import ytsr from "ytsr";

const deleteFile = promisify(fs.unlink);

export async function fromYt(sock, m) {
    const from = m.messages[0].key.remoteJid;
    const sender = m.messages[0].key.participant;
    const msg = m.messages[0].message.conversation;
    // const result: ytsr.Result = await ytsr(processMsg(m).slice(6), { limit: 1 });
    const results: ytsr.Result = await ytsr(msg.slice(6), { limit: 1 });
    const result = results.items[0];
    // @ts-ignore
    if (+result.duration.split(':')[0] > 12 || (result.duration.split(':').length >= 3)) {
        return;
    }
    sock.sendReadReceipt(from, sender, [m.messages[0].key.id]);
    // @ts-ignore
    sock.sendMessage(from, { image: result.bestThumbnail, caption: `Title - ${result.title}\nDuration - ${result.duration} mins\nURL - ${result.url}\nViews - ${result.views}\nUploaded - ${result.uploadedAt}\n\n\`\`\`Fetching the audio wait a moment...\`\`\`` });
    const fileName: string = "./tmpMedia/" + Date.now() + ".mp3"; 
    // @ts-ignore
    ytdl(result.url, { filter: "audioonly" }).pipe(fs.createWriteStream(fileName).on('finish', async () => {
        await sock.sendMessage(m.messages[0].key.remoteJid, { audio: { url: fileName }, ptt: true }, { quoted: m.messages[0] });
        await deleteFile(fileName);
    }));
}
