const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/ma2cswya80eczei7q2hgxltddhd850p7'; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable' 
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('--- QR CODE ABAIXO ---');
});

client.on('ready', () => {
    console.log('✅ Bot Online na Maroso!');
});

client.on('message', async msg => {
    if (msg.hasMedia && msg.body && (msg.body.toLowerCase().includes('inst') || msg.body.toLowerCase().includes('nf'))) {
        try {
            const media = await msg.downloadMedia();
            await axios.post(MAKE_WEBHOOK_URL, {
                texto: msg.body,
                imagemBase64: media.data,
                mimeType: media.mimetype
            });
            msg.react('👍'); 
        } catch (e) {
            console.error('Erro ao enviar para o Make:', e);
        }
    }
});

client.initialize();
