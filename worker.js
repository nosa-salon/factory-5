import { db, collection, addDoc, getDocs, query, where, Timestamp } from "./firebase-config.js";

const form = document.getElementById('breakdownForm');
const alertBox = document.getElementById('alertBox');

function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const machineNo = document.getElementById('machineNo').value.trim();
    const department = document.getElementById('department').value;
    const shift = document.getElementById('shift').value;
    const reason = document.getElementById('reason').value;
    const startStr = document.getElementById('startTime').value;
    const endStr = document.getElementById('endTime').value;

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (startDate >= endDate) {
        showAlert('وقت البداية يجب أن يكون قبل وقت النهاية!', 'danger');
        return;
    }

    const durationMinutes = Math.round((endDate - startDate) / 60000);

    try {
        const q = query(collection(db, "breakdowns"), where("machineNo", "==", machineNo));
        const querySnapshot = await getDocs(q);
        let overlap = false;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const existingStart = data.startDate.toDate();
            const existingEnd = data.endDate.toDate();

            if (startDate < existingEnd && endDate > existingStart) {
                overlap = true;
            }
        });

        if (overlap) {
            showAlert('خطأ: يوجد عطل متداخل مسجل مسبقاً لنفس الماكينة في هذا النطاق الزمني!', 'danger');
            return;
        }

        await addDoc(collection(db, "breakdowns"), {
            machineNo,
            department,
            shift,
            reason,
            startDate: Timestamp.fromDate(startDate),
            endDate: Timestamp.fromDate(endDate),
            durationMinutes,
            createdAt: Timestamp.now()
        });

        showAlert('تم تسجيل العطل بنجاح وحسابه تلقائياً!', 'success');
        form.reset();
    } catch (error) {
        console.error(error);
        showAlert('حدث خطأ أثناء التسجيل: ' + error.message, 'danger');
    }
});