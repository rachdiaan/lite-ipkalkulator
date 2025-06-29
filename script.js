document.addEventListener('DOMContentLoaded', function() {
    // --- Initial Data & Constants ---
    const gradePoints = { 'A': 4.0, 'AB': 3.5, 'B': 3.0, 'BC': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0 };
    const minEnglishScoresForGraduation = { s1: 450, s2: 475, s3: 500 };
    let s1Curriculum = {};
    let s2Curriculum = {};
    const facultyData = {
        'Fakultas Teknik Elektro (FTE)': [
            'S1 Teknik Telekomunikasi', 'S1 Teknik Elektro', 'S1 Teknik Komputer', 
            'S1 Smart Science & Technology', 'S1 Teknik Biomedis', 'S1 Electrical Energy Engineering'
        ],
        'Fakultas Rekayasa Industri (FRI)': [
            'S1 Sistem Informasi', 'S1 Teknik Industri', 'S1 Digital Supply Chain', 'S1 Manajemen Rekayasa Industri'
        ],
        'Fakultas Informatika (FIF)': [
            'S1 Informatika', 'S1 Rekayasa Perangkat Lunak', 'S1 Teknologi Informasi (Cyber Security & Digital Innovation)', 'S1 Sains Data'
        ],
        'Fakultas Ekonomi dan Bisnis (FEB)': [
            'S1 Manajemen Bisnis Telekomunikasi & Informatika (MBTI)', 'S1 Akuntansi', 'S1 Leisure Management', 
            'S1 Administrasi Bisnis', 'S1 Bisnis Digital (Digital Business)'
        ],
        'Fakultas Komunikasi dan Ilmu Sosial (FKS)': [
            'S1 Ilmu Komunikasi', 'S1 Digital Public Relation', 'S1 Digital Content Broadcasting', 'S1 Psikologi (Digital Psychology)'
        ],
        'Fakultas Industri Kreatif (FIK)': [
            'S1 Desain Komunikasi Visual', 'S1 Desain Interior', 'S1 Desain Produk & Inovasi', 
            'S1 Kriya (Fashion & Textile Design)', 'S1 Creative Arts (Intermedia Visual Arts)', 'S1 Film dan Animasi'
        ],
        'Fakultas Ilmu Terapan (FIT)': [
            'D3 Teknik Informatika', 'D3 Sistem Informasi', 'D3 Teknik Komputer', 
            'D3 Digital Accounting (Sistem Informasi Akuntansi)', 'D3 Digital Marketing', 'D3 Hospitality and Culinary Art',
            'S1 Terapan Digital Creative Multimedia (DCM)', 'S1 Terapan Sistem Informasi Kota Cerdas'
        ]
    };


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
    const facultySelect = document.getElementById('faculty');
    const majorSelect = document.getElementById('major');

    // --- Data Loading ---
    async function loadCurriculumData() {
        try {
            const s1Url = 'https://raw.githubusercontent.com/rachdiaan/lite-ipkalkulator/main/kurikulum_D3s1terapan.csv';
            const s2Url = 'https://raw.githubusercontent.com/rachdiaan/lite-ipkalkulator/main/kurikulum_s2.csv';

            const [s1Response, s2Response] = await Promise.all([
                fetch(s1Url),
                fetch(s2Url)
            ]);

            if (!s1Response.ok || !s2Response.ok) {
                console.error('Gagal memuat satu atau lebih file kurikulum.csv');
                throw new Error("Gagal mengambil data kurikulum dari server.");
            }
            
            const [s1Text, s2Text] = await Promise.all([
                s1Response.text(),
                s2Response.text()
            ]);

            parseCurriculumCSV(s1Text, 's1');
            parseCurriculumCSV(s2Text, 's2');
            
            initializeApp(); // Initialize app after all data is loaded
        } catch (error) {
            console.error('Error saat mengambil data kurikulum:', error);
            if (autoPlannerCard) {
                autoPlannerCard.innerHTML = '<p class="error-message" style="color: red; text-align: center;">Gagal memuat data kurikulum. Pastikan Anda menjalankan aplikasi melalui server lokal.</p>';
            }
            initializeApp(true); // Initialize with data loading failed
        }
    }

    function parseCurriculumCSV(text, level) {
        const lines = text.split(/\r?\n/).slice(1);
        const targetData = level === 's1' ? s1Curriculum : s2Curriculum;

        lines.forEach(line => {
            if (!line.trim()) return;
            const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
            const [prodi, konsentrasi, semester, matkul, sks] = columns;
            
            if (!prodi || !konsentrasi || !semester || !matkul || !sks) return;

            const courseData = { name: matkul, sks: parseInt(sks, 10) };
            
            if (!targetData[prodi]) targetData[prodi] = {};
            if (!targetData[prodi][konsentrasi]) targetData[prodi][konsentrasi] = {};
            if (!targetData[prodi][konsentrasi][semester]) targetData[prodi][konsentrasi][semester] = [];
            targetData[prodi][konsentrasi][semester].push(courseData);
        });
    }
    
    // --- UI Population Functions ---
    const populateFaculties = () => {
        const faculties = Object.keys(facultyData);
        facultySelect.innerHTML = faculties.map(f => `<option value="${f}">${f}</option>`).join('');
        populateMajors();
    };
    
    const populateMajors = () => {
        const selectedFaculty = facultySelect.value;
        const majors = facultyData[selectedFaculty] || [];
        majorSelect.innerHTML = majors.map(m => `<option value="${m}">${m}</option>`).join('');
    };

    // --- Planner Functions ---
    const updatePlannerVisibility = () => {
        if (!autoPlannerCard) return;
        const isPlannerVisible = (programLevelSelect.value === 's1' || programLevelSelect.value === 's2');
        autoPlannerCard.style.display = isPlannerVisible ? 'block' : 'none';
        
        const facultyWrapper = document.getElementById('faculty-wrapper');
        const majorWrapper = document.getElementById('major-wrapper');
        
        if(facultyWrapper && majorWrapper) {
            facultyWrapper.style.display = isPlannerVisible ? 'block' : 'none';
            majorWrapper.style.display = isPlannerVisible ? 'block' : 'none';
        }

        if(isPlannerVisible){
            populateFaculties();
        }
    };
    
    const fillCourses = () => {
        const level = programLevelSelect.value;
        const curriculumData = level === 's1' ? s1Curriculum : s2Curriculum;
        const major = majorSelect.value; // Use the major from student info
        const concentration = autoConcentrationSelect.value || Object.keys(curriculumData[major])[0];
        const semester = autoSemesterSelect.value;
        const coursesToFill = curriculumData[major]?.[concentration]?.[semester];
        
        if (coursesToFill) {
            coursesList.innerHTML = ''; // Clear existing courses
            coursesToFill.forEach(course => coursesList.appendChild(createCourseRow(course)));
            calculateGPA();
        } else {
            alert('Kurikulum untuk pilihan ini tidak ditemukan.');
        }
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
    
    // --- Event Listeners ---
    function initializeEventListeners() {
        if(coursesList) coursesList.addEventListener('input', calculateGPA);
        if(addCourseBtn) addCourseBtn.addEventListener('click', addCourse);
        if(programLevelSelect) programLevelSelect.addEventListener('change', () => {
            updatePlannerVisibility();
            document.querySelectorAll('.predicate-table').forEach(t => t.style.display = 'none');
            const predicateTable = document.getElementById(`predicate-${programLevelSelect.value}`);
            if (predicateTable) predicateTable.style.display = 'block';
            calculateGPA();
            checkEnglishScore();
        });
        if(englishScoreInput) englishScoreInput.addEventListener('input', checkEnglishScore);
        if(downloadTemplateBtn) downloadTemplateBtn.addEventListener('click', downloadTemplate);
        if(uploadSpreadsheetInput) uploadSpreadsheetInput.addEventListener('change', handleFileUpload);
        
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        if(tabLinks) tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                link.classList.add('active');
                const content = document.getElementById(link.dataset.tab);
                if(content) content.classList.add('active');
            });
        });
        
        if(facultySelect) facultySelect.addEventListener('change', populateMajors);
        if(fillCoursesBtn) fillCoursesBtn.addEventListener('click', fillCourses);
    }
    
    function initializeApp() {
        window.addEventListener('load', () => document.body.classList.remove('loading'));
        
        initializeEventListeners();
        
        addCourse();
        
        const firstPredicateTable = document.querySelector('.predicate-table');
        if (firstPredicateTable) {
            firstPredicateTable.style.display = 'block';
        }

        updatePlannerVisibility();
        calculateGPA();
    }
    
    initializeApp();
});
