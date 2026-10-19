module.exports = {

    ownerName: 'renx',                                // nama pemilik bot, muncul di beberapa menu
    botName: 'ICHIGO',                             // nama bot, muncul di menu dan info
    footerTxt: 'renxtech',                // tulisan kecil di bagian bawah pesan bot

    prefix: '!',                                         // tanda di depan command, contoh: !menu (maks 5 karakter, tanpa spasi)
    noPrefix: true,                                      // true: command jalan pakai prefix ATAU tanpa prefix | false: wajib pakai prefix

    superOwner: '6281928251916',                         // HANYA 1 nomor. Akses penuh + bisa atur co-owner. Format 62xxx tanpa + dan spasi
    coOwner: [
        '6281928251916',
        '6283124265973',
        '6283169557427',
        '6283157686826',
        '6283136778501',
        '6285935020128',
    ],  // boleh banyak nomor, dipisah koma. Akses owner biasa (tanpa menu settings)

    botMode: 'public',                                   // 'public': semua orang boleh pakai bot | 'self': hanya owner yang dilayani

    quoteStyle: 'pay',                                   // tampilan pesan yang di-quote bot: 'pay' (struk pembayaran), 'meta' (kontak Meta AI), 'status' (sticker pack)

    menuStyle: 2,                                        // 1=list+gambar, 2=product+list kategori

    autoRead: true,                                      // true: pesan masuk otomatis dicentang biru | false: dibiarkan belum dibaca
    autoTyping: true,                                    // true: bot tampil "mengetik..." dulu sebelum balas chat pribadi | false: langsung balas
    noSelfSync: false,                                   // true: pesan bot tidak di-sync ke device lain akun bot | false: normal

    usePairingCode: true,                                 // true: login pakai kode pairing (8 digit) | false: login pakai scan QR code
    authFolder: './src/database/session',                // folder penyimpanan data login WhatsApp. Hapus folder ini kalau mau scan QR / pairing ulang
    channelId: '',          // ID channel/saluran WhatsApp buat label "diteruskan dari". Kosongkan ('') kalau tidak dipakai

    githubRepo: 'renXTech-sys/ICHIGO',                   // format: 'username/nama-repo', dipakai command !checkupdate buat cek versi terbaru di GitHub

    // ── Teks balasan guard ───────────────────────────────────────────────────────────────────────
    mess: {
        superOwner: '⚠️ Khusus hirarki tertinggi (Super Owner).',
        owner:      '⚠️ Terkunci: Membutuhkan izin Owner.',
        coOwner:    '⚠️ Otorisasi ditolak: Khusus Co-Owner.',
        group:      '📌 Hanya dapat digunakan di ruang obrolan grup.',
        private:    '📌 Silakan kirim perintah ini lewat pesan pribadi.',
        admin:      '🛡️ Diperlukan wewenang Admin grup.',
        botAdmin:   '🛡️ Bot membutuhkan hak akses Admin di grup ini.',
        ownerOrAdmin: '🔑 Fitur terbatas untuk Admin grup atau Owner.',
        mainBotOnly:  '⚙️ Akses ditolak: Gunakan server Bot Utama.',
        error:      '⚠️ Gagal memproses permintaan.',
        wait:       '⌛ Mengolah data, harap tunggu...',
    }
};
