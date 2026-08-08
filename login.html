// استيراد دوال التوثيق والاتصال من مكتبة Firebase
import { auth } from './firebase-config.js'; 
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const userSelect = document.getElementById('userSelect');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // 1. التحقق من حالة المستخدم: لو مسجل دخول بالفعل، حوله للصفحة المناسبة
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // 🛑 🛑 🛑 هام جداً: ضع هنا الإيميل الحقيقي للمدير العام كما هو مسجل في Firebase
            const adminEmailFromFirebase = "admin@factory.com"; 
            
            if (user.email === adminEmailFromFirebase) {
                // إذا كان الإيميل هو إيميل المدير، قم بتحويله للوحة تحكم المدير
                console.log("تم تسجيل دخول المدير، جارٍ التحويل...");
                window.location.replace('admin.html');
            } else {
                // إذا كان أي مستخدم آخر (مشرفين، إدارة)، قم بتحويله لصفحة المتابعة
                console.log("تم تسجيل دخول مشرف/إدارة، جارٍ التحويل...");
                window.location.replace('supervisor.html');
            }
        }
    });

    // 2. التعامل مع نموذج تسجيل الدخول عند الضغط على زر "دخول"
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع السلوك الافتراضي للنموذج (إعادة تحميل الصفحة)

            // جلب القيم المدخلة من المستخدم
            const email = userSelect.value; // الإيميل المختار من القائمة المنسدلة
            const password = passwordInput.value; // كلمة المرور

            // التحقق الأساسي من ملء الحقول
            if (!email || !password) {
                showError("يرجى اختيار اسم المستخدم وإدخال كلمة المرور.");
                return;
            }

            try {
                // محاولة تسجيل الدخول باستخدام Firebase Authentication
                console.log("محاولة تسجيل الدخول...");
                await signInWithEmailAndPassword(auth, email, password);
                // في حالة النجاح، سيتم تنفيذ دالة onAuthStateChanged في الأعلى تلقائياً
            } catch (error) {
                // في حالة حدوث خطأ، قم بطباعته في الكونسول وعرض رسالة للمستخدم
                console.error("خطأ في تسجيل الدخول:", error);
                
                let message = "حدث خطأ غير متوقع أثناء تسجيل الدخول.";
                
                // التعامل مع أكواد الأخطاء الشائعة من Firebase
                if (error.code === 'auth/user-not-found') {
                    message = "المستخدم غير موجود.";
                } else if (error.code === 'auth/wrong-password') {
                    message = "كلمة المرور غير صحيحة.";
                } else if (error.code === 'auth/invalid-email') {
                    message = "صيغة البريد الإلكتروني غير صحيحة.";
                } else if (error.code === 'auth/too-many-requests') {
                    message = "تم حظر محاولات الدخول مؤقتاً بسبب كثرة المحاولات الفاشلة. يرجى المحاولة لاحقاً.";
                } else if (error.code === 'auth/invalid-credential') {
                    message = "بيانات الاعتماد غير صالحة. تأكد من الإيميل وكلمة المرور.";
                }
                
                showError(message); // عرض رسالة الخطأ في واجهة المستخدم
            }
        });
    } else {
        // رسالة خطأ في حالة عدم العثور على النموذج في الـ HTML
        console.error("لم يتم العثور على عنصر النموذج (Form) بمعرف 'loginForm'. يرجى مراجعة ملف الـ HTML.");
    }

    // دالة مساعدة لإظهار رسالة الخطأ أعلى النموذج
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message; // تعيين نص الرسالة
            errorMessage.style.display = 'block'; // إظهار عنصر التنبيه
            
            // تمرير نافذة المتصفح لأعلى الصفحة ليرى المستخدم الرسالة بوضوح
            window.scrollTo(0, 0);
        }
    }
});
