const config = require('../config');
const plugins = require('../utils/PluginLoader');
const { getDevice } = require('@whiskeysockets/baileys');

const handler = async (m) => {

    const { command, Hanz, isOwner, isSuperOwner, msg, senderNumber, pushname } = m;
    const p = config.prefix;
    const nomorUser = senderNumber;

    switch (command.name) {
        case 'ownermenu':
            const device = getDevice(msg.key.id);
            const ownerCmds = (plugins.commandsByFile()['owner'] || [])
            .filter(cmd => !['ownermenu'].includes(cmd));
            const role = isSuperOwner ? 'Super Owner' : (isOwner ? 'Co-Owner' : 'User biasa');
            let menu = `┌─❖「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」
│● 𝘕𝘢𝘮𝘢: ${pushname}
│● 𝘕𝘰𝘮𝘰𝘳: ${nomorUser}
│● 𝘚𝘵𝘢𝘵𝘶𝘴: ${role}
│● 𝘗𝘦𝘳𝘢𝘯𝘨𝘬𝘢𝘵: ${device}
│
└┬❖ 
┌┤𝖧𝖺𝗒 𝗄𝖺𝗄 ${pushname} 👋
│└────────────┈ ⳹
│「 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 」
│
${ownerCmds.map(cmd => `│⪩ \`${p}${cmd}\``).join('\n')}
│
└────────────┈ ⳹`
            await m.sendInteractive({
                text: menu,
                footer: config.footerTxt,
                quoted: m.fakeOrder,
                contextInfo: {
                    mentionedJid: ["0@s.whatsapp.net"],
                    forwardingScore: 111,
                    isForwarded: true
                },
                buttons: [
                    { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Kembali ke Menu', id: 'menu' }) },
                    { name: 'single_select', buttonParamsJson: JSON.stringify({
                            title: '『 Simpel Menu 』',
                            sections: [{
                                title: '『 Simpel Menu 』',
                                highlight_label: "",
                                rows: [{ title: "General Menu", description: "Select to display general menu", id: "generalmenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Owner Menu", description: "Select to display owner menu", id: "ownermenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Ffmpeg Menu", description: "Select to display ffmpeg menu", id: "ffmpegmenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Downloader Menu", description: "Select to display downloader menu", id: "downloadmenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Tools Menu", description: "Select to display tools menu", id: "toolsmenu" }]
                            }, {
                                highlight_label: "Khusus Owner Utama",
                                rows: [{ title: "JadiBot Menu", description: "Select to display jadi bot menu", id: "jadibotmenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Fun Menu", description: "Select to display fun menu", id: "funmenu" }]
                            }, {
                                highlight_label: "",
                                rows: [{ title: "Group Menu", description: "Select to display group menu ", id: "groupmenu" }]
                            }]
                        })
                    }]
            });
            break;
 
        case 'getiduser':
        case 'iduser':
        case 'cekno': {
            if (!isSuperOwner) return m.reply({ text: '❌ Khusus Super Owner!' });
            let nomorInput = command.fullArgs.replace(/\D/g, '');

            if (!nomorInput) {
                return m.reply({
                    text: `❌ *Format Salah!*\n\nFormat: \`${p}getiduser <nomor-hp>\`\nContoh: \`${p}getiduser 0857123xxxxx\` atau \`${p}getiduser 6212345xxxxx\``
                });
            }

            if (nomorInput.startsWith('0')) {
                nomorInput = '62' + nomorInput.slice(1);
            }

            try {
                const [result] = await Hanz.onWhatsApp(nomorInput);

                if (!result || !result.exists) {
                    return m.reply({ text: `❌ Nomor *${nomorInput}* tidak terdaftar di WhatsApp.` });
                }

                const jidKlasik = result.jid;
                const lid = result.lid || "Tidak tersedia";

                let hasil = `🔍 *DATA USER WHATSAPP* 🔍\n\n`;
                hasil += ` • *Nomor Asli* : +${nomorInput}\n`;
                hasil += ` • *JID Klasik* : \`${jidKlasik}\`\n`;
                hasil += ` • *LID Privasi* : \`${lid}\``;

                await m.sendInteractive({
                    text: hasil,
                    footer: config.footerTxt,
                    quoted: m.msg,
                    buttons: [
                        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copy JID Klasik', copy_code: jidKlasik }) },
                        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copy LID', copy_code: lid }) },
                    ]
                });
            } catch (error) {
                console.error("Gagal melacak nomor:", error);
                await m.reply({ text: `❌ Terjadi kesalahan saat memeriksa nomor tersebut.` });
            }
            break;
        }

        case 'getidch':
        case 'idch':
        case 'cekchannel': {
            if (!isSuperOwner) return m.reply({ text: '❌ Khusus Super Owner!' });
            const textInput = command.fullArgs;
            const channelRegex = /whatsapp\.com\/channel\/([a-zA-Z0-9]+)/i;

            if (!textInput || !channelRegex.test(textInput)) {
                return m.reply({
                    text: `❌ *Format Salah!*\n\nFormat: \`${p}getidch <link-channel>\`\nContoh: \`${p}getidch https://whatsapp.com/channel/0029VaXXXXX\``
                });
            }

            const match = textInput.match(channelRegex);
            const inviteCode = match[1];

            try {
                const metadata = await Hanz.newsletterMetadata("invite", inviteCode);
                const jidAsli = metadata.id;
                const metaDataThread = metadata.thread_metadata || {};
                const namaChannel = metaDataThread.name?.text || "Tidak diketahui";
                const totalPengikut = metaDataThread.subscribers_count || "0";
                const deskripsi = metaDataThread.description?.text || "Tidak ada deskripsi.";

                let hasil = `🔍 *DATA WHATSAPP CHANNEL* 🔍\n\n`;
                hasil += ` • *Nama Channel* : ${namaChannel}\n`;
                hasil += ` • *ID Internal* : \`${jidAsli}\`\n`;
                hasil += ` • *Followers* : ${totalPengikut} pengikut\n`;
                hasil += ` • *Deskripsi* : ${deskripsi}`;

                await m.sendInteractive({
                    text: hasil,
                    footer: config.footerTxt,
                    quoted: m.msg,
                    buttons: [
                        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copy ID Channel', copy_code: jidAsli }) },
                    ]
                });
            } catch (error) {
                console.error("Gagal melacak channel:", error);
                await m.reply({
                    text: `❌ *Gagal Mendapatkan Data!*\n\nPastikan link channel valid, publik, dan bot sedang tidak terkena limit query.`
                });
            }
            break;
        }

        case 'setmode':
        case 'mode': {
            if (!isSuperOwner) return m.reply({ text: '❌ Khusus Super Owner!' });
            const modeInput = command.fullArgs.trim().toLowerCase();

            if (!['public', 'self'].includes(modeInput)) {
                return m.sendInteractive({
                    text: `*MODE BOT SAAT INI:* ${(global.botMode || config.botMode).toUpperCase()}

` +
                        `• *public* → semua orang bisa pakai bot
` +
                        `• *self* → hanya owner yang bisa pakai bot`,
                    footer: config.footerTxt,
                    quoted: m.msg,
                    buttons: [
                        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Set Public', id: 'setmode public' }) },
                        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Set Self', id: 'setmode self' }) },
                    ]
                });
            }

            if (modeInput === (global.botMode || config.botMode)) {
                return m.reply({ text: `Mode bot sudah dalam mode *${modeInput.toUpperCase()}*.` });
            }
            global.botMode = modeInput;
            try {
                const configPath = require('path').join(__dirname, '..', 'config.js');
                let configFile = require('fs').readFileSync(configPath, 'utf8');
                configFile = configFile.replace(/botMode:\s*'(public|self)'/, `botMode: '${modeInput}'`);
                require('fs').writeFileSync(configPath, configFile, 'utf8');
            } catch (e) { }

            await m.reply({
                text: `Mode bot berhasil diubah ke *${modeInput.toUpperCase()}*!\n\n` +
                    `${modeInput === 'self' ? 'Sekarang hanya owner yang bisa pakai bot.' : 'Sekarang semua orang bisa pakai bot.'}`
            });
                        break;
        }
        case 'exec':
        case 'terminal':
        case '>': {
            if (!isSuperOwner) return m.reply({ text: '❌ Khusus Super Owner!' });
            const text = command.fullArgs;
            if (!text) {
                return m.reply({
                    text: `❌ *Format Salah!*\n\nFormat: \`${p}exec <perintah>\`\nContoh: \`${p}exec ls\``
                });
            }

            const { exec } = require('child_process');
            exec(text, async (err, stdout, stderr) => {
                let output = '';
                if (err) output += `*ERROR:* ${err.message}\n`;
                if (stderr) output += `*STDERR:* ${stderr}\n`;
                if (stdout) output += stdout;
                
                await m.reply({ text: output.trim() || 'Perintah dijalankan tanpa output.' });
            });
            break;
        }
        case 'rvo': {
            if (!isSuperOwner) return m.reply({ text: '❌ Khusus Super Owner!' }); // Batasi khusus super owner, sesuaikan jika ingin untuk co-owner/owner biasa
            if (!m.quoted) return m.reply({ text: '❌ Reply pesan view once (sekali lihat)!' });

            // Mengambil tipe pesan yang di-reply (mendukung struktur Baileys viewOnceMessage atau viewOnceMessageV2)
            const quotedMsg = m.quoted.message;
            const type = Object.keys(quotedMsg)[0];
            
            if (type !== 'imageMessage' && type !== 'videoMessage') {
                return m.reply({ text: '❌ Ini bukan pesan view once gambar atau video!' });
            }

            try {
                const stream = await downloadContentFromMessage(quotedMsg[type], type === 'imageMessage' ? 'image' : 'video');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                const caption = quotedMsg[type].caption || '';
                
                if (type === 'videoMessage') {
                    await Hanz.sendMessage(m.chat, { video: buffer, caption: caption }, { quoted: m.msg });
                } else if (type === 'imageMessage') {
                    await Hanz.sendMessage(m.chat, { image: buffer, caption: caption }, { quoted: m.msg });
                }
            } catch (error) {
                console.error("Gagal mendownload view once:", error);
                await m.reply({ text: '❌ Gagal membuka pesan view once tersebut.' });
            }
            break;
        }

        case 'info': {
    const u = process.uptime();
    const hari = Math.floor(u / 86400);
    const jam = Math.floor((u % 86400) / 3600);
    const menit = Math.floor((u % 3600) / 60);
    const detik = Math.floor(u % 60);
    await m.reply({
        text: `┌─❖「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 」
│
│● 𝘕𝘢𝘮𝘢    : ${config.botName}
│● 𝘖𝘸𝘯𝘦𝘳   : ${[].concat(config.superOwner).join(', ')}
│● 𝘗𝘳𝘦𝘧𝘪𝘹  : ${config.prefix}
│● 𝘜𝘱𝘵𝘪𝘮𝘦  : ${hari}h ${jam}j ${menit}m ${detik}d
│● 𝘕𝘰𝘥𝘦    : ${process.version}
│● 𝘗𝘭𝘢𝘵𝘧𝘰𝘳𝘮 : ${process.platform}
│● 𝘔𝘰𝘥𝘦    : ${(global.botMode || config.botMode).toUpperCase()}
│● 𝘊𝘰𝘮𝘮𝘢𝘯𝘥  : ${plugins.commandList().length} fitur aktif
│
└────────────┈ ⳹`
    });
    break;
}

    }
};

module.exports = handler;