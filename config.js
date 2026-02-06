// بيانات مشروع Firebase الخاص بك
const firebaseConfig = {
    apiKey: "AIzaSyB6jGiS3japB3t7JMhspY3_D5S_-SAzrHc",
    authDomain: "f5mcord-103.firebaseapp.com",
    databaseURL: "https://f5mcord-103.firebaseio.com",
    projectId: "f5mcord-103",
    storageBucket: "f5mcord-103.firebasestorage.app",
    messagingSenderId: "776499493207",
    appId: "1:776499493207:web:bc820bb595d709086c6612"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
