import { db, collection, query, orderBy, onSnapshot, auth, signOut, onAuthStateChanged } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => { window.location.href = 'login.html'; });
});

const adminDepartment = document.getElementById('adminDepartment');
const adminStartDate = document.getElementById('adminStartDate');
const adminEndDate = document.getElementById('adminEndDate');
const totalDurationEl = document.getElementById('totalDuration');
const totalCountEl = document.getElementById('totalCount');
const statsTableBody = document.getElementById('statsTableBody');

let allBreakdowns = [];

const q = query(collection(db, "breakdowns"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    allBreakdowns = [];
    snapshot.forEach((doc) => {
        allBreakdowns.push({ id: doc.id, ...doc.data() });
    });
    calculateStats(allBreakdowns);
});

function calculateStats(data) {
    const deptFilter = adminDepartment.value;
    const startF = adminStartDate.value;
    const endF = adminEndDate.value;

    // فلترة البيانات بناءً على الاختيارات (المنطقة والتاريخ)
    const filtered = data.filter(item => {
        const itemDateStr = item.startDate.toDate().toISOString().split('T')[0];
        
        const matchDept = !deptFilter || item.department === deptFilter;
        
        let matchDate = true;
        if (startF && endF) {
            matchDate = itemDateStr >= startF && itemDateStr <= endF;
        } else if (startF) {
            matchDate = itemDateStr >= startF;
        } else if (endF) {
            matchDate = itemDateStr <= endF;
        }

        return matchDept && matchDate;
    });

    let totalDuration = 0;
    let totalCount = filtered.length;
    let reasonStats = {};

    filtered.forEach(item => {
        const duration = item.durationMinutes || 0;
        totalDuration += duration;

        if (!reasonStats[item.reason]) {
            reasonStats[item.reason] = { count: 0, duration: 0 };
        }
        reasonStats[item.reason].count += 1;
        reasonStats[item.reason].duration += duration;
    });

    // تحديث الملخص العام
    totalDurationEl.textContent = `${totalDuration} دقيقة (${(totalDuration / 60).toFixed(1)} ساعة)`;
    totalCountEl.textContent = `${totalCount} عطل`;

    // حساب وترتيب النسب المئوية
    statsTableBody.innerHTML = '';
    if (totalCount === 0) {
        statsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">لا توجد بيانات مسجلة في هذه الفترة</td></tr>`;
        return;
    }

    // تحويل الكائن إلى مصفوفة لترتيبها حسب الأعلى مدة أو تكراراً
    const sortedReasons = Object.keys(reasonStats).map(reason => {
        return {
            reason,
            count: reasonStats[reason].count,
            duration: reasonStats[reason].duration,
            percentage: totalDuration > 0 ? ((reasonStats[reason].duration / totalDuration) * 100).toFixed(1) : 0
        };
    }).sort((a, b) => b.duration - a.duration);

    sortedReasons.forEach(stat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${stat.reason}</td>
            <td>${stat.count}</td>
            <td>${stat.duration} دقيقة</td>
            <td><strong style="color: #0277bd;">${stat.percentage}%</strong></td>
        `;
        statsTableBody.appendChild(tr);
    });
}

[adminDepartment, adminStartDate, adminEndDate].forEach(element => {
    element.addEventListener('input', () => calculateStats(allBreakdowns));
    element.addEventListener('change', () => calculateStats(allBreakdowns));
});