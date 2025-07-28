```js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const startBot = async () => {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    if (action === 'add') {
      for (let user of participants) {
        await sock.sendMessage(id, {
          text: `👋 Welcome <@${user.split('@')[0]}> to the group!`,
          mentions: [user]
        });
      }
    }
  });
};

startBot();
```

---
