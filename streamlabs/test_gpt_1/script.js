
const chat = document.getElementById("log");

function typeMessage(element, text, speed = 30) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('onEventReceived', function (obj) {
    const data = obj.detail.event;
    if (!data || !data.message) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'message';

    const user = document.createElement('span');
    user.className = 'username';
    user.textContent = data.name + ': ';
    wrapper.appendChild(user);

    const textEl = document.createElement('span');
    wrapper.appendChild(textEl);
    chat.appendChild(wrapper);

    // Анимация "печати" сообщения
    typeMessage(textEl, data.message, 25); // скорость — 25 мс на символ

    // Автоматическая прокрутка вниз
    chat.scrollTop = chat.scrollHeight;

    // Удаляем старые сообщения, если их слишком много
    if (chat.children.length > 20) {
        chat.removeChild(chat.firstChild);
    }
});
