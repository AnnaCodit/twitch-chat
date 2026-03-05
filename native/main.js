
const CHANNEL_NAME = 'fra3a';
const twitchUserCache = new LRUCache(300);

class LRUCache {
    constructor(limit = 500) {
        this.cache = new Map();
        this.limit = limit;
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.limit) {
            // Remove least recently used (first inserted)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

async function getTwitchUserData(username) {

    // можно использовать https://decapi.me/twitch/avatar/fra3a если нужна только ава и в поле logo можно 600x600 заменить на 300x300 чтобы быстрее грузилось

    const cached = twitchUserCache.get(login);
    if (cached !== null) return cached;

    try {
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
        const data = await response.json();

        if (data && data[0]) {
            twitchUserCache.set(login, data[0]);
            return data[0];
        } else {
            console.error("Пользователь не найден");
            return null;
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
}


const client = new tmi.Client({
    options: { debug: false },
    connection: {
        reconnect: true,
        secure: true
    },
    channels: [CHANNEL_NAME]
});

client.connect();

const chatDiv = document.getElementById('chat');

client.on('message', async (channel, tags, message, self) => {
    console.log("channel: ", channel);
    console.log("tags: ", tags);
    console.log("msg: " + message);

    const login = tags['username'];
    const displayName = tags['display-name'] || login;
    const user = await getTwitchUserData(login);

    const msgEl = document.createElement('div');
    msgEl.className = 'msg';
    msgEl.innerHTML = `
        <img class="avatar" src="${user.logo}" alt="${login}">
        <div class="text">
          <span class="name">${displayName}:</span> ${message}
        </div>
      `;

    chatDiv.prepend(msgEl);
    if (chatDiv.childElementCount > 50) {
        chatDiv.removeChild(chatDiv.lastChild);
    }
});

