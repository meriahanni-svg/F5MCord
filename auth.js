function checkUserAccess(userId) {
    db.ref('users/' + userId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data.isBanned) {
            alert("لقد تم حظرك نهائياً من F5MCord!");
            window.location.reload();
        }
        if (data.role === 'OWNER') {
            console.log("God Mode Activated");
            document.getElementById('god-panel').style.display = 'block';
        }
    });
}
