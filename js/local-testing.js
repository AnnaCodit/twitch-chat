// --- ЛОКАЛЬНОЕ ТЕСТИРОВАНИЕ ---
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        const hackEmote = "<img src='https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/1x.avif' alt='Hackermans'>";
        const sampleTexts = [
            `Взлом системы завершен... ${hackEmote}`,
            `Запускаю протокол обхода файрвола. ${hackEmote} ${hackEmote}`,
            `Ого, какой крутой оверлей! ${hackEmote} Очень длинное сообщение для проверки ${hackEmote} того, как TypeIt переносит строки при печатании текста и как блок растет по высоте. ${hackEmote} ${hackEmote} `,
            `Подключение установлено. ${hackEmote}`,
            `Доступ разрешен. ${hackEmote} Инициализация... ${hackEmote}`
        ];
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

        // Для теста я добавила реальный Twitch-ник, чтобы проверить работу API ivr.fi
        const testUsers = [
            { nick: 'forsen', display: 'Forsen' },
            { nick: 'shroud', display: 'shroud' },
            { nick: 'falseduc_frezafurry', display: 'falseduc_frezafurry' },
            { nick: 'AzulaAzulaAzulaaaa', display: 'AzulaAzulaAzulaaaa' } // Проверка заглушки
        ];
        const user = testUsers[Math.floor(Math.random() * testUsers.length)];

        renderMessage(user.nick, user.display, randomText, [{ url: 'https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2' }, { url: 'https://static-cdn.jtvnw.net/badges/v1/a9c01f28-179e-486d-a4c7-2277e4f6adb4/2' }, { url: 'https://static-cdn.jtvnw.net/badges/v1/4d9e9812-ba9b-48a6-8690-13f3f338ee65/2' }]);
    }
});
