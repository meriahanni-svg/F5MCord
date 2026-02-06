function generateMegaCodes() {
    const amount = prompt("قيمة الكود (F5 Coins):");
    const quantity = 1000000; // مليون كود
    
    // ملاحظة: في المتصفح سنولد دفعة صغيرة للتجربة، 
    // لكن الكود جاهز لإنشاء أي عدد في قاعدة البيانات.
    let codes = {};
    for(let i=0; i<100; i++) { // مثال لـ 100 كود سريع
        let code = "F5-GEN-" + Math.random().toString(36).substring(7).toUpperCase();
        codes[code] = { amount: parseInt(amount), status: "active" };
    }
    db.ref('gift_codes').update(codes);
    alert("تم ضخ الأكواد في قاعدة البيانات!");
}
