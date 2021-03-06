let fetch = require('node-fetch')
let timeout = 120000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'belum dijawab!', conn.tekateki[id][0])
        throw false
    }
    let res = await fetch(API('amel', '/game/tekateki', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (json.status != 200) throw json
    let caption = `
${json.result.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}tete untuk bantuan
`.trim()
    conn.tekateki[id] = [
        await conn.sendButton(m.chat, caption, wm, 'Bantuan', '.tete', m),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) await conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, wm, 'Teka Teki', '.tekateki', conn.tekateki[id][0])
            delete conn.tekateki[id]
        }, timeout)
    ]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = /^tekateki/i

handler.game = true

module.exports = handler