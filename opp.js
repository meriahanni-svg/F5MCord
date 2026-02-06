// بيانات المالك المحددة من قبلك
const OWNER_EMAIL = "meria.hanni@gmail.com";
const OWNER_PASS = "mosslim000";

let db = firebase.database();
let currentUser = null;

function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    // تسجيل الدخول أو إنشاء الحساب
    const userId = btoa(email).replace(/=/g, ""); // توليد ID فريد
    db.ref('users/' + userId).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // إنشاء مستخدم جديد
            let role = (email === OWNER_EMAIL) ? 'OWNER' : 'user';
            db.ref('users/' + userId).set({
                email, username: email.split('@')[0],
                balance: 0, role: role, isBanned: false
            });
        }
        loginSuccess(userId, email);
    });
}

function loginSuccess(id, email) {
    currentUser = id;
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // تفعيل لوحة التحكم إذا كان المالك
    if (email === OWNER_EMAIL) {
        document.getElementById('god-panel').classList.remove('hidden');
        document.getElementById('admin-tag').classList.remove('hidden');
    }
    
    // مراقبة الرصيد في الوقت الفعلي
    db.ref('users/' + id + '/balance').on('value', (snap) => {
        document.getElementById('balance').innerText = snap.val();
    });
}

// نظام إنشاء مليون كود شحن
function generateGiftCodes() {
    const amount = prompt("كم عدد العملات لكل كود؟");
    const count = prompt("كم عدد الأكواد (يمكنك طلب حتى 1,000,000)؟");
    
    for (let i = 0; i < count; i++) {
        let code = "F5-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        db.ref('gift_codes/' + code).set({ amount: parseInt(amount), active: true });
    }
    alert(`تم إنشاء ${count} كود بنجاح! يمكنك إرسالها للمشتركين.`);
}

// نظام شحن الكود
function showRedeem() {
    const code = prompt("أدخل كود الشحن الذي استلمته من الأدمن في الانستا:");
    db.ref('gift_codes/' + code).once('value', (snap) => {
        if (snap.exists() && snap.val().active) {
            let giftAmt = snap.val().amount;
            db.ref('users/' + currentUser + '/balance').transaction(b => (b || 0) + giftAmt);
            db.ref('gift_codes/' + code).update({ active: false, usedBy: currentUser });
            alert(`تم شحن ${giftAmt} عملة بنجاح!`);
        } else {
            alert("الكود غير صالح أو تم استخدامه!");
        }
    });
}
