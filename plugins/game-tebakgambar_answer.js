import similarity from 'similarity'
import db from '../lib/database.js'

const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*hint/i.test(m.quoted.text) || /.*hint/i.test(m.text))
        return !0
    this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}
    if (!(id in this.tebakgambar))
        return this.sendButton(m.chat, 'Soal tersebut telah berakhir.', author, null, buttonTebakgambar, m)
    if (m.quoted.id == this.tebakgambar[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebakgambar[id][3])
            delete this.tebakgambar[id]
            return this.sendButton(m.chat, 'Kamu telah menyerah.', author, null, buttonTebakgambar, m)
        }
        let json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))
        let users = global.db.data.users[m.sender]
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            users.exp += this.tebakgambar[id][2]
            this.sendButton(m.chat, `Jawabanmu benar.\nmendapatkan ${this.tebakgambar[id][2]} Exp`, author, null, buttonTebakgambar, m)
            clearTimeout(this.tebakgambar[id][3])
            delete this.tebakgambar[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`Jawbanmu hampir benar.`)
        else
            this.sendButton(m.chat, `Jawabanmu salah.`, author, null, [
                ['Hint', '/hint'],
                ['Menyerah', 'menyerah']
            ], m)
    }
    return !0
}
export const exp = 0

const buttonTebakgambar = [
    ['tebakgambar', '/tebakgambar']
]