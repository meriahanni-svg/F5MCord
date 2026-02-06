// دالة معالجة الدخول عند الضغط على الزر
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const authStatus = document.getElementById('auth-status');

    if (!email || !pass) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    // تحديد مسار المستخدم في قاعدة البيانات (تحويل الإيميل لـ ID آمن)
    const userId = btoa(email).replace(/=/g, "");

    try {
        // جلب بيانات المستخدم من Firebase
        const snapshot = await db.ref('users/' + userId).once('value');
        const userData = snapshot.val();

        if (userData) {
            // حالة 1: المستخدم موجود (تحقق من كلمة السر)
            if (userData.password === pass) {
                if (userData.isBanned) {
                    alert("عذراً، هذا الحساب محظور نهائياً!");
                    return;
                }
                loginUser(userId, userData);
            } else {
                alert("كلمة المرور خاطئة!");
            }
        } else {
            // حالة 2: مستخدم جديد (إنشاء حساب تلقائي)
            // إذا كان الإيميل هو إيميلك، يتم تعيينك كمالك فوراً
            let role = "user";
            let badge = "";
            
            if (email === "meria.hanni@gmail.com") {
                role = "OWNER";
                badge = "ADMIN";
            }

            const newUser = {
                email: email,
                password: pass,
                username: email.split('@')[0],
                role: role,
                badge: badge,
                balance: 0,
                isBanned: false,
                avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            };

            await db.ref('users/' + userId).set(newUser);
            loginUser(userId, newUser);
        }
    } catch (error) {
        console.error("Auth Error:", error);
        alert("حدث خطأ في الاتصال بقاعدة البيانات. تأكد من إعدادات Firebase.");
    }
}

// دالة تحويل الواجهة من تسجيل الدخول إلى التطبيق
function loginUser(id, data) {
    // 1. إخفاء شاشة الدخول وإظهار الموقع
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // 2. تخزين بيانات الجلسة محلياً
    localStorage.setItem('f5_user_id', id);
    window.currentUser = id;
    window.currentUserEmail = data.email;

    // 3. عرض البيانات في الواجهة
    document.getElementById('display-username').innerText = data.username;
    document.getElementById('balance').innerText = data.balance || 0;

    // 4. تفعيل لوحة التحكم إذا كان المالك (أنت)
    if (data.role === "OWNER" || data.email === "meria.hanni@gmail.com") {
        document.getElementById('owner-panel').classList.remove('hidden');
        document.getElementById('owner-tag').classList.remove('hidden');
        console.log("Welcome Creator. God Mode Active.");
    }

    // 5. بدء الاستماع للرسائل والعملات
    startChatListener();
    startBalanceListener(id);
}

// دالة تحديث الرصيد تلقائياً
function startBalanceListener(id) {
    db.ref('users/' + id + '/balance').on('value', (snap) => {
        document.getElementById('balance').innerText = snap.val() || 0;
    });
}
