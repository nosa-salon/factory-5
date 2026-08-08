import { db, collection, query, orderBy, onSnapshot, auth, signOut, onAuthStateChanged } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => { window.location.href = 'login.html'; });
});

const tbody = document.getElementById('breakdownsTableBody');
const searchMachine = document.getElementById('searchMachine');
const filterReason = document.getElementById('filterReason');
const filterDepartment = document.getElementById('filterDepartment');
const startDateFilter = document.getElementById('startDateFilter');
const endDateFilter = document.getElementById('endDateFilter');

let allBreakdowns = [];

const q = query(collection(db, "breakdowns"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    allBreakdowns = [];
    snapshot.forEach((doc) => {
        allBreakdowns.push({ id: doc.id, ...doc.data() });
    });
    renderTable(allBreakdowns);
});

function renderTable(data) {
    tbody.innerHTML = '';
    const mSearch = searchMachine.value.trim().toLowerCase();
    const rFilter = filterReason.value;
    const dFilter = filterDepartment.value;
    const startF = startDateFilter.value;
    const endF = endDateFilter.value;

    const filtered = data.filter(item => {
        const itemDateStr = item.startDate.toDate().toISOString().split('T')[0];
        
        const matchMachine = !mSearch || item.machineNo.toLowerCase().includes(mSearch);
        const matchReason = !rFilter || item.reason === rFilter;
        const matchDept = !dFilter || item.department === dFilter;
        
        let matchDate = true;
        if (startF && endF) {
            matchDate = itemDateStr >= startF && itemDateStr <= endF;
        } else if (startF) {
            matchDate = itemDateStr >= startF;
        } else if (endF) {
            matchDate = itemDateStr <= endF;
        }

        return matchMachine && matchReason && matchDept && matchDate;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">لا توجد بيانات مطابقة للبحث أو الفترة المحددة</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const startFormatted = item.startDate.toDate().toLocaleString('ar-EG');
        const endFormatted = item.endDate.toDate().toLocaleString('ar-EG');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.machineNo}</td>
            <td>${item.department}</td>
            <td>${item.shift}</td>
            <td>${item.reason}</td>
            <td>${startFormatted}</td>
            <td>${endFormatted}</td>
            <td>${item.durationMinutes} دقيقة</td>
        `;
        tbody.appendChild(tr);
    });
}

[searchMachine, filterReason, filterDepartment, startDateFilter, endDateFilter].forEach(element => {
    element.addEventListener('input', () => renderTable(allBreakdowns));
    element.addEventListener('change', () => renderTable(allBreakdowns));
});