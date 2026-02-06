/**
 * F5MCord - Advanced Admin Logic (2026 Edition)
 * نظام التحكم المطلق بالأنظمة والمستخدمين
 */

// التأكد من أن المستخدم هو المالك أولاً
function verifyAdmin() {
    return currentUserEmail === "meria.hanni@gmail.com";
}

async function adminAction(type) {
    if (!verifyAdmin()) return alert("تحذير: محاولة دخول غير مصرح بها لنمط GOD MODE!");

    const targetId = document.getElementById('target-id').value;
    const targetUserRef = db.ref('users/' + targetId);
    
    // تنفيذ الميزات بناءً على النوع
    switch(type) {
        // 1. الحظر الدائم
        case 'BAN':
            await targetUserRef.update({ isBanned: true, status: "BANNED_FOREVER" });
            broadcastSystemMessage(`تم نفي المستخدم ${targetId} من النظام نهائياً.`);
            break;

        // 2. الحظر المؤقت (24 ساعة)
        case 'TEMP_BAN':
            const expireDate = Date.now() + (24 * 60 * 60 * 1000);
            await targetUserRef.update({ isBanned: true, banExpires: expireDate });
            alert("تم الحظر لمدة 24 ساعة.");
            break;

        // 3. فك الحظر
        case 'UNBAN':
            await targetUserRef.update({ isBanned: false, banExpires: null });
            alert("تم العفو عن المستخدم.");
            break;

        // 4. ترقية لأدمن
        case 'PROMOTE':
            await targetUserRef.update({ role: 'admin', badge: 'STAFF' });
            alert("تم منح رتبة أدمن.");
            break;

        // 5. سحب الرتبة
        case 'DEMOTE':
            await targetUserRef.update({ role: 'user', badge: '' });
            alert("تم سحب جميع الصلاحيات.");
            break;

        // 6. تغيير الاسم (إجباري)
        case 'RENAME':
            const newName = prompt("أدخل الاسم الجديد للمستخدم:");
            if(newName) await targetUserRef.update({ username: newName });
            break;

        // 7. تغيير الصورة
        case 'AVATAR':
            const newImg = prompt("ضع رابط الصورة الجديد:");
            if(newImg) await targetUserRef.update({ avatar: newImg });
            break;

        // 8. مسح الشات الشامل
        case 'CLEAR':
            if(confirm("هل تريد مسح جميع رسائل السيرفر؟")) {
                await db.ref('messages').remove();
                broadcastSystemMessage("قام الأدمن بمسح سجل المحادثات.");
            }
            break;

        // 9. قفل السيرفر (Mute All)
        case 'LOCK':
            await db.ref('settings').update({ serverLocked: true });
            broadcastSystemMessage("تم قفل السيرفر: المالك فقط يمكنه الكتابة الآن.");
            break;

        // 10. إغلاق السيرفر (Maintenance Mode)
        case 'SHUTDOWN':
            await db.ref('settings').update({ maintenance: true });
            alert("الموقع الآن في وضع الصيانة.");
            break;

        // 11. إسكات مستخدم (Mute)
        case 'MUTE':
            await targetUserRef.update({ isMuted: true });
            alert("تم إسكات المستخدم.");
            break;

        // 12. كشف الـ IP (محاكاة متقدمة)
        case 'IP':
            const userSnap = await targetUserRef.once('value');
            const ip = userSnap.val().lastIP || "192.168.1." + Math.floor(Math.random() * 255);
            alert(`عنوان المستخدم المستهدف: ${ip}`);
            break;

        // 13. رسالة نظام (Broadcast)
        case 'ANNOUNCE':
            const msg = prompt("ما هي رسالتك لجميع المستخدمين؟");
            if(msg) broadcastSystemMessage("إعلان إداري: " + msg);
            break;

        // 14. حذف الحساب نهائياً
        case 'DELETE_ACC':
            if(confirm("سيتم مسح بيانات المستخدم بالكامل، هل أنت متأكد؟")) {
                await targetUserRef.remove();
            }
            break;

        // 15. نظام توليد العملات (Mega Coins)
        case 'GIVE_COINS':
            const amt = prompt("كم عدد عملات F5 التي تريد منحها؟");
            if(amt) {
                await targetUserRef.child('balance').transaction(current => (current || 0) + parseInt(amt));
                alert(`تم منح ${amt} عملة للمستخدم.`);
            }
            break;
    }
}

// دالة إرسال رسائل النظام
function broadcastSystemMessage(text) {
    db.ref('messages').push({
        username: "SYSTEM",
        text: text,
        role: "SYSTEM",
        timestamp: Date.now()
    });
}
