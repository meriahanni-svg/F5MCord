function sendMessage() {
    const text = document.getElementById('msgInput').value;
    if (text === "") return;

    const msgData = {
        userId: currentUser,
        username: email.split('@')[0],
        text: text,
        timestamp: Date.now(),
        role: (email === OWNER_EMAIL) ? 'OWNER' : 'user'
    };

    db.ref('messages').push(msgData);
    document.getElementById('msgInput').value = "";
}

db.ref('messages').limitToLast(50).on('child_added', (snapshot) => {
    const msg = snapshot.val();
    const chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML += `
        <div class="msg">
            <b class="${msg.role}">${msg.username}</b>: ${msg.text}
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});
