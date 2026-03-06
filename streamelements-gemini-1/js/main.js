const maxCacheSize = 100;
const userCache = new Map();

// Твоя функция получения аватара
async function getAvatar(username) {
    if (userCache.has(username)) {
        const avatarUrl = userCache.get(username);
        userCache.delete(username);
        userCache.set(username, avatarUrl);
        return avatarUrl;
    }

    try {
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        const avatarUrl = (Array.isArray(data) ? data[0]?.logo : data.logo) || "https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/1x.avif";

        if (userCache.size >= maxCacheSize) {
            const oldestKey = userCache.keys().next().value;
            userCache.delete(oldestKey);
        }

        userCache.set(username, avatarUrl);
        return avatarUrl;

    } catch (error) {
        console.error(`Ошибка при получении аватарки для ${username}:`, error);
        return "https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/1x.avif";
    }
}

const chatContainer = document.getElementById('chat-container');

// Делаем функцию асинхронной и принимаем nick (для API) и displayName (для визуала)
async function renderMessage(nick, displayName, htmlText, badges = []) {

    if (document.hidden) return;

    // Ждем загрузку аватарки
    const avatar = await getAvatar(nick);

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-box';


    const badgesHtml = badges.map(badge => `<img src="${badge.url}" alt="badge">`).join('');

    msgDiv.innerHTML = `
                <img class="avatar" src="${avatar}">
                <div class="text-content">
                    <div class="user-meta">
                        <div class="username">${displayName}</div>
                        <div class="badges">${badgesHtml}</div>
                    </div>            
                    <span class="message-text"></span>
                </div>
            `;

    const maxX = window.innerWidth - 450;
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    msgDiv.style.left = `${randomX}px`;

    const randomY = Math.floor(Math.random() * (window.innerHeight));

    if (randomY > window.innerHeight / 2) {
        msgDiv.style.bottom = `${window.innerHeight - randomY}px`;
    } else {
        msgDiv.style.top = `${randomY}px`;
    }

    chatContainer.appendChild(msgDiv);

    const textContainer = msgDiv.querySelector('.message-text');

    new TypeIt(textContainer, {
        strings: htmlText,
        speed: 30,
        html: true,
        cursorChar: "█",
        lifeLike: true,
        afterComplete: (instance) => {
            instance.destroy();
            setTimeout(() => {
                msgDiv.style.opacity = '0';
                setTimeout(() => msgDiv.remove(), 500);
            }, 5000); // 5 секунд после печатанья
        }
    }).go();
}

// --- ИНТЕГРАЦИЯ СО STREAMELEMENTS ---
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    const data = obj.detail.event.data;
    const renderedText = obj.detail.event.renderedText;

    // Передаем правильные параметры
    renderMessage(data.nick, data.displayName, renderedText, data.badges);
});