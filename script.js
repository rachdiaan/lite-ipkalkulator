document.addEventListener('DOMContentLoaded', function() {
    // --- Initial Data & Constants ---
    const gradePoints = { 'A': 4.0, 'AB': 3.5, 'B': 3.0, 'BC': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0 };
    const minEnglishScoresForGraduation = { s1: 450, s2: 475, s3: 500 };
    let s1Curriculum = {};
    let s2Curriculum = {};

    // --- DOM Element Selections ---
    const autoPlannerCard = document.getElementById('auto-planner-card');
    const autoMajorSelect = document.getElementById('auto-major');
    const autoConcentrationSelect = document.getElementById('auto-concentration');
    const autoSemesterSelect = document.getElementById('auto-semester');
    const fillCoursesBtn = document.getElementById('fill-courses-btn');
    const concentrationWrapper = document.getElementById('concentration-wrapper');
    const coursesList = document.getElementById('courses-list');
    const programLevelSelect = document.getElementById('program-level');
    const englishScoreInput = document.getElementById('english-score');
    const englishResultDiv = document.getElementById('english-score-result');
    const addCourseBtn = document.getElementById('add-course-btn');
    const gpaResultEl = document.getElementById('result');
    const predicateResultEl = document.getElementById('predicate-result');
    const summaryEl = document.getElementById('summary');
    const downloadTemplateBtn = document.getElementById('download-template-btn');
    const uploadSpreadsheetInput = document.getElementById('upload-spreadsheet');
    const feedbackModal = document.getElementById('ai-feedback-modal');
    const plannerModal = document.getElementById('ai-planner-modal');
    const allModals = document.querySelectorAll('.modal-overlay');

    // --- Data Loading ---
    async function loadCurriculumData() {
        try {
            const response = await fetch('kurikulum.csv');
            if (!response.ok) {
                console.error('Gagal memuat file kurikulum.csv');
                return;
            }
            const csvText = await response.text();
            parseCurriculumCSV(csvText);
            initializeApp(); // Initialize app after data is loaded
        } catch (error) {
            console.error('Error saat mengambil data kurikulum:', error);
            // Fallback or show an error message to the user
            const coursesCard = document.querySelector('.courses-card');
            if (coursesCard) {
                coursesCard.insertAdjacentHTML('afterbegin', '<p class="error-message">Gagal memuat data kurikulum. Fitur Rencana Studi Otomatis mungkin tidak berfungsi.</p>');
            }
        }
    }

    function parseCurriculumCSV(text) {
        const lines = text.split(/\r?\n/).slice(1); // Skip header
        const tempS1Data = {};
        const tempS2Data = {};

        lines.forEach(line => {
            if (!line.trim()) return;
            const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
            const [jenjang, prodi, konsentrasi, semester, matkul, sks] = columns;

            const courseData = { name: matkul, sks: parseInt(sks, 10) };

            if (jenjang.startsWith('D') || jenjang.startsWith('S1')) {
                if (!tempS1Data[prodi]) tempS1Data[prodi] = {};
                if (!tempS1Data[prodi][konsentrasi]) tempS1Data[prodi][konsentrasi] = {};
                if (!tempS1Data[prodi][konsentrasi][semester]) tempS1Data[prodi][konsentrasi][semester] = [];
                tempS1Data[prodi][konsentrasi][semester].push(courseData);
            } else if (jenjang.startsWith('S2')) {
                 if (!tempS2Data[prodi]) tempS2Data[prodi] = {};
                if (!tempS2Data[prodi][konsentrasi]) tempS2Data[prodi][konsentrasi] = {};
                if (!tempS2Data[prodi][konsentrasi][semester]) tempS2Data[prodi][konsentrasi][semester] = [];
                tempS2Data[prodi][konsentrasi][semester].push(courseData);
            }
        });
        s1Curriculum = tempS1Data;
        s2Curriculum = tempS2Data;
    }


    // --- Planner Functions ---
    const updatePlannerVisibility = () => {
        autoPlannerCard.style.display = (programLevelSelect.value === 's1' || programLevelSelect.value === 's2') ? 'block' : 'none';
        populateMajors();
    };

    const populateMajors = () => {
        const level = programLevelSelect.value;
        const curriculumData = level === 's1' ? s1Curriculum : s2Curriculum;
        const majors = Object.keys(curriculumData);
        autoMajorSelect.innerHTML = majors.map(major => `<option value="${major}">${major}</option>`).join('');
        populateConcentrations();
    };
    
    const populateConcentrations = () => {
        const level = programLevelSelect.value;
        const curriculumData = level === 's1' ? s1Curriculum : s2Curriculum;
        const major = autoMajorSelect.value;

        if (!major || !curriculumData[major]) return;
        const concentrations = Object.keys(curriculumData[major]);
        
        if (concentrations.length === 1 && concentrations[0] === 'Reguler') {
             concentrationWrapper.style.display = 'none';
        } else {
             concentrationWrapper.style.display = 'block';
             autoConcentrationSelect.innerHTML = concentrations.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        populateSemesters();
    };

    const populateSemesters = () => {
        const level = programLevelSelect.value;
        const curriculumData = level === 's1' ? s1Curriculum : s2Curriculum;
        const major = autoMajorSelect.value;
        const concentration = autoConcentrationSelect.value || Object.keys(curriculumData[major])[0];
        
        if (!major || !concentration || !curriculumData[major][concentration]) return;
        const semesters = Object.keys(curriculumData[major][concentration]);
        autoSemesterSelect.innerHTML = semesters.map(s => `<option value="${s}">${s}</option>`).join('');
    };

    const fillCourses = () => {
        const level = programLevelSelect.value;
        const curriculumData = level === 's1' ? s1Curriculum : s2Curriculum;
        const major = autoMajorSelect.value;
        const concentration = autoConcentrationSelect.value || Object.keys(curriculumData[major])[0];
        const semester = autoSemesterSelect.value;
        const coursesToFill = curriculumData[major][concentration][semester];
        
        coursesList.innerHTML = ''; // Clear existing courses
        if (coursesToFill) {
            coursesToFill.forEach(course => coursesList.appendChild(createCourseRow(course)));
        }
        calculateGPA();
    };


    // --- Core Functions ---
    const calculateGPA = () => { let totalPoints = 0, totalSKS = 0; coursesList.querySelectorAll('.course-card-item').forEach(row => { const sks = parseInt(row.querySelector('.course-sks').value, 10); const grade = row.querySelector('.course-grade').value; if (!isNaN(sks) && grade && gradePoints[grade] !== undefined) { totalPoints += sks * gradePoints[grade]; totalSKS += sks; } }); const gpa = totalSKS > 0 ? (totalPoints / totalSKS) : 0; const selectedLevel = programLevelSelect.value; gpaResultEl.textContent = gpa.toFixed(2); predicateResultEl.textContent = getPredicate(gpa, selectedLevel); summaryEl.textContent = totalSKS > 0 ? `Berdasarkan total ${totalSKS} SKS.` : 'Silakan isi mata kuliah Anda.'; };
    const getPredicate = (gpa, level) => { if (level === 's1') { if (gpa >= 3.91) return 'Sempurna'; if (gpa >= 3.51) return 'Dengan Pujian'; if (gpa >= 3.01) return 'Sangat Memuaskan'; if (gpa >= 2.76) return 'Memuaskan'; } else if (level === 's2') { if (gpa >= 3.96) return 'Sempurna'; if (gpa >= 3.76) return 'Dengan Pujian'; if (gpa >= 3.51) return 'Sangat Memuaskan'; if (gpa >= 3.26) return 'Memuaskan'; } else if (level === 's3') { if (gpa >= 3.96) return 'Sempurna'; if (gpa >= 3.76) return 'Dengan Pujian'; if (gpa >= 3.51) return 'Sangat Memuaskan'; if (gpa >= 3.26) return 'Memuaskan'; } return 'Predikat akan tampil di sini'; };
    const checkEnglishScore = () => { const program = programLevelSelect.value; const score = parseInt(englishScoreInput.value, 10); englishResultDiv.textContent = ''; if (isNaN(score)) return; const minScore = minEnglishScoresForGraduation[program]; if (score >= minScore) { englishResultDiv.textContent = `✓ Memenuhi syarat kelulusan (min. ${minScore}).`; englishResultDiv.style.color = 'var(--success-color)'; } else { englishResultDiv.textContent = `✗ Belum memenuhi syarat kelulusan (min. ${minScore}).`; englishResultDiv.style.color = 'var(--error-color)'; } };
    const createCourseRow = (course = { name: '', sks: '', grade: '' }) => { const row = document.createElement('div'); row.className = 'course-card-item'; row.innerHTML = `<div class="course-card-header-item"><input type="text" class="course-name" placeholder="Nama Mata Kuliah" value="${course.name}"><button class="remove-course-btn">&times;</button></div><div class="course-details"><input type="number" class="course-sks" min="1" max="10" placeholder="SKS" value="${course.sks}"><select class="course-grade"><option value="">Nilai</option><option value="A" ${course.grade==='A'?'selected':''}>A</option><option value="AB" ${course.grade==='AB'?'selected':''}>AB</option><option value="B" ${course.grade==='B'?'selected':''}>B</option><option value="BC" ${course.grade==='BC'?'selected':''}>BC</option><option value="C" ${course.grade==='C'?'selected':''}>C</option><option value="D" ${course.grade==='D'?'selected':''}>D</option><option value="E" ${course.grade==='E'?'selected':''}>E</option></select></div>`; row.querySelector('.remove-course-btn').addEventListener('click', () => { row.style.animation = 'fadeOut 0.3s ease-out forwards'; row.addEventListener('animationend', () => { row.remove(); calculateGPA(); }); }); return row; };
    const addCourse = () => { coursesList.appendChild(createCourseRow()); };
    const downloadTemplate = (e) => { e.preventDefault(); const headers = '"Nama Mata Kuliah",SKS,Nilai'; const example1 = '"Contoh: Pemrograman Dasar",3,A'; const csvContent = `data:text/csv;charset=utf-8,${headers}\n${example1}`; const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "template_mata_kuliah.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); };
    const handleFileUpload = (event) => { const file = event.target.files[0]; if (!file || !file.name.endsWith('.csv')) { alert('Format file tidak didukung. Harap unggah file .csv'); event.target.value = ''; return; } const reader = new FileReader(); reader.onload = (e) => parseCSVAndPopulate(e.target.result); reader.readAsText(file); event.target.value = ''; };
    const parseCSVAndPopulate = (text) => { const courses = text.split(/\r?\n/).slice(1).map(line => { if (!line.trim()) return null; const columns = line.split(','); if (columns.length < 3) return null; const name = columns[0].replace(/"/g, '').trim(); const sks = parseInt(columns[1].trim(), 10); const grade = columns[2].trim().toUpperCase(); return (name && !isNaN(sks)) ? { name, sks, grade: gradePoints[grade] ? grade : '' } : null; }).filter(Boolean); if (courses.length > 0) { coursesList.innerHTML = ''; courses.forEach(course => coursesList.appendChild(createCourseRow(course))); calculateGPA(); } else { alert('Tidak ada data mata kuliah yang valid ditemukan di dalam file.'); } };
    const openModal = (modalElement) => { modalElement.classList.add('active'); }
    const closeModal = (modalElement) => { modalElement.classList.remove('active'); }
    const callGeminiAPI = async (prompt, modal) => { const loader = modal.querySelector('.modal-loader'); const responseDiv = modal.querySelector('.modal-response'); loader.style.display = 'flex'; responseDiv.style.display = 'none'; try { const apiKey = ""; const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }) }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error.message || `API Error: ${response.statusText}`); } const result = await response.json(); if(result.candidates && result.candidates.length > 0){ responseDiv.innerHTML = result.candidates[0].content.parts[0].text; } else { throw new Error("Respon dari AI tidak valid atau kosong."); } } catch (error) { console.error("AI Feedback Error:", error); responseDiv.innerHTML = `<p style="color:var(--error-color)"><strong>Gagal Terhubung ke AI.</strong></p><p style="font-size:0.8rem; color:var(--text-color-light)">Ini bisa terjadi jika Anda menjalankan file ini secara langsung di browser (dari folder lokal). Coba jalankan aplikasi melalui server lokal. Jika masalah berlanjut, mungkin ada kendala pada layanan AI.</p>`; } finally { loader.style.display = 'none'; responseDiv.style.display = 'block'; } };
    
    // --- Event Listeners ---
    function initializeEventListeners() {
        coursesList.addEventListener('input', calculateGPA);
        addCourseBtn.addEventListener('click', addCourse);
        programLevelSelect.addEventListener('change', () => {
            updatePlannerVisibility();
            document.querySelectorAll('.predicate-table').forEach(t => t.style.display = 'none');
            document.getElementById(`predicate-${programLevelSelect.value}`).style.display = 'block';
            calculateGPA();
            checkEnglishScore();
        });
        englishScoreInput.addEventListener('input', checkEnglishScore);
        downloadTemplateBtn.addEventListener('click', downloadTemplate);
        uploadSpreadsheetInput.addEventListener('change', handleFileUpload);
        
        allModals.forEach(m => {
            const closeBtn = m.querySelector('.close-modal-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(m));
            }
        });

        document.getElementById('get-ai-feedback-btn').addEventListener('click', async (e) => { const btn = e.currentTarget; btn.classList.add('loading'); btn.disabled = true; openModal(feedbackModal); const studentName = document.getElementById('student-name').value; const studentNIM = document.getElementById('student-nim').value; const gpa = gpaResultEl.textContent; const coursesData = Array.from(coursesList.querySelectorAll('.course-card-item')).map(row => { const name = row.querySelector('.course-name').value; const sks = row.querySelector('.course-sks').value; const grade = row.querySelector('.course-grade').value; return (name && sks && grade) ? `- ${name} (${sks} SKS): Nilai ${grade}` : null; }).filter(Boolean); if (coursesData.length === 0) {  const responseDiv = feedbackModal.querySelector('.modal-response'); responseDiv.innerHTML = '<p>Silakan isi setidaknya satu mata kuliah lengkap untuk mendapatkan umpan balik.</p>'; feedbackModal.querySelector('.modal-loader').style.display = 'none'; responseDiv.style.display = 'block';  btn.classList.remove('loading'); btn.disabled = false; return;  } const prompt = `Anda adalah seorang konselor akademik yang positif dan memotivasi di Telkom University. Seorang mahasiswa meminta umpan balik tentang performa akademiknya.\n\nData Mahasiswa:\nNama: ${studentName || "Mahasiswa"}\nNIM: ${studentNIM || "Tidak ada"}\nIPK saat ini: ${gpa}\nMata Kuliah yang telah dinilai:\n${coursesData.join('\n')}\n\nTugas Anda:\n1. Sapa mahasiswa dengan namanya. Berikan paragraf pembuka yang singkat & positif.\n2. Berikan 3-4 poin saran belajar yang spesifik dan praktis.\n3. Berikan paragraf penutup yang memberi semangat.\n\nJawab dalam format HTML sederhana (gunakan <p>, <ul>, dan <li>) dan dalam Bahasa Indonesia.`; await callGeminiAPI(prompt, feedbackModal); btn.classList.remove('loading'); btn.disabled = false; });
        document.getElementById('open-planner-modal-btn').addEventListener('click', () => { plannerModal.querySelector('.planner-options').style.display = 'grid'; plannerModal.querySelector('.modal-response').innerHTML = ''; plannerModal.querySelector('.modal-response').style.display = 'none'; openModal(plannerModal); });
        document.getElementById('get-study-plan-btn').addEventListener('click', async () => { const courses = Array.from(coursesList.querySelectorAll('.course-card-item')).map(row => ({ name: row.querySelector('.course-name').value, grade: row.querySelector('.course-grade').value, })).filter(c => c.name && c.grade); const prompt = `Anda adalah seorang tutor akademik. Buatkan rencana belajar mingguan dalam format tabel HTML untuk mahasiswa berdasarkan daftar mata kuliah ini:\n\n${courses.map(c => `- ${c.name} (Nilai: ${c.grade})`).join('\n')}\n\nFokuskan lebih banyak waktu pada mata kuliah dengan nilai C, D, atau E. Buat jadwal dari Senin hingga Jumat, dengan sesi pagi, siang, dan sore. Berikan juga tips singkat di akhir.`; plannerModal.querySelector('.planner-options').style.display = 'none'; await callGeminiAPI(prompt, plannerModal); });
        document.getElementById('get-career-suggestion-btn').addEventListener('click', async () => { const highGradeCourses = Array.from(coursesList.querySelectorAll('.course-card-item')).map(row => ({ name: row.querySelector('.course-name').value, grade: row.querySelector('.course-grade').value, })).filter(c => c.name && ['A', 'AB', 'B'].includes(c.grade)); if (highGradeCourses.length === 0) { alert("Isi setidaknya satu mata kuliah dengan nilai A, AB, atau B untuk mendapatkan saran karir."); return; } const prompt = `Anda adalah seorang konselor karir. Berdasarkan daftar mata kuliah dengan nilai terbaik ini:\n\n${highGradeCourses.map(c => `- ${c.name}`).join('\n')}\n\nBerikan 3 saran jalur karir atau spesialisasi yang relevan. Untuk setiap saran, berikan penjelasan singkat (2-3 kalimat) mengapa mata kuliah tersebut mendukung jalur karir itu. Gunakan format HTML dengan <h3> untuk judul karir dan <p> untuk penjelasan.`; plannerModal.querySelector('.planner-options').style.display = 'none'; await callGeminiAPI(prompt, plannerModal); });
        
        // S2 Planner Listeners
        autoMajorSelect.addEventListener('change', populateConcentrations);
        autoConcentrationSelect.addEventListener('change', populateSemesters);
        fillCoursesBtn.addEventListener('click', fillCourses);
    }
    
    function initializeApp() {
        window.addEventListener('load', () => document.body.classList.remove('loading'));
        
        initializeEventListeners();
        
        if (initialCourses.length > 0) {
            initialCourses.forEach(course => coursesList.appendChild(createCourseRow(course)));
        } else {
            addCourse();
        }
        document.querySelector('.predicate-table').style.display = 'block';
        updatePlannerVisibility();
        calculateGPA();
    }
    
    loadCurriculumData();
});
