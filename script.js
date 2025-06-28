document.addEventListener('DOMContentLoaded', function() {
    // --- Initial Data & Constants ---
    const gradePoints = { 'A': 4.0, 'AB': 3.5, 'B': 3.0, 'BC': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0 };
    const initialCourses = [];
    const minEnglishScoresForGraduation = { s1: 450, s2: 475, s3: 500 };

    // --- DOM Element Selections ---
    const coursesList = document.getElementById('courses-list');
    const programLevelSelect = document.getElementById('program-level');
    const englishScoreInput = document.getElementById('english-score');
    const englishResultDiv = document.getElementById('english-score-result');
    const addCourseBtn = document.getElementById('add-course-btn');
    const gpaResultEl = document.getElementById('result');
    const predicateResultEl = document.getElementById('predicate-result');
    const summaryEl = document.getElementById('summary');
    
    // Upload & Download Elements
    const downloadTemplateBtn = document.getElementById('download-template-btn');
    const uploadSpreadsheetInput = document.getElementById('upload-spreadsheet');
    
    // Modal elements
    const modal = document.getElementById('ai-feedback-modal');
    const modalLoader = document.getElementById('modal-loader');
    const modalResponse = document.getElementById('modal-response');
    const getAIFeedbackBtn = document.getElementById('get-ai-feedback-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Tab elements
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Core Functions ---
    const calculateGPA = () => {
        let totalPoints = 0, totalSKS = 0;
        coursesList.querySelectorAll('.course-card-item').forEach(row => {
            const sks = parseInt(row.querySelector('.course-sks').value, 10);
            const grade = row.querySelector('.course-grade').value;
            if (!isNaN(sks) && grade && gradePoints[grade] !== undefined) {
                totalPoints += sks * gradePoints[grade];
                totalSKS += sks;
            }
        });
        const gpa = totalSKS > 0 ? (totalPoints / totalSKS) : 0;
        const selectedLevel = programLevelSelect.value;
        gpaResultEl.textContent = gpa.toFixed(2);
        predicateResultEl.textContent = getPredicate(gpa, selectedLevel);
        summaryEl.textContent = totalSKS > 0 ? `Berdasarkan total ${totalSKS} SKS.` : 'Silakan isi mata kuliah Anda.';
    };

    const getPredicate = (gpa, level) => {
        if (level === 's1') {
            if (gpa >= 3.91) return 'Sempurna';
            if (gpa >= 3.51) return 'Dengan Pujian';
            if (gpa >= 3.01) return 'Sangat Memuaskan';
            if (gpa >= 2.76) return 'Memuaskan';
        } else if (level === 's2') {
            if (gpa >= 3.96) return 'Sempurna';
            if (gpa >= 3.76) return 'Dengan Pujian';
            if (gpa >= 3.51) return 'Sangat Memuaskan';
            if (gpa >= 3.26) return 'Memuaskan';
        } else if (level === 's3') {
            if (gpa >= 3.96) return 'Sempurna';
            if (gpa >= 3.76) return 'Dengan Pujian';
            if (gpa >= 3.51) return 'Sangat Memuaskan';
            if (gpa >= 3.26) return 'Memuaskan';
        }
        return 'Predikat akan tampil di sini';
    };

    const checkEnglishScore = () => {
        const program = programLevelSelect.value;
        const score = parseInt(englishScoreInput.value, 10);
        englishResultDiv.textContent = '';
        if (isNaN(score)) return;
        const minScore = minEnglishScoresForGraduation[program];
        if (score >= minScore) {
            englishResultDiv.textContent = `✓ Memenuhi syarat kelulusan (min. ${minScore}).`;
            englishResultDiv.style.color = 'var(--success-color)';
        } else {
            englishResultDiv.textContent = `✗ Belum memenuhi syarat kelulusan (min. ${minScore}).`;
            englishResultDiv.style.color = 'var(--error-color)';
        }
    };

    const createCourseRow = (course = { name: '', sks: '', grade: '' }) => {
        const row = document.createElement('div');
        row.className = 'course-card-item';
        row.innerHTML = `
            <button class="remove-course-btn">&times;</button>
            <input type="text" class="course-name" placeholder="Nama Mata Kuliah" value="${course.name}">
            <div class="course-details">
                <input type="number" class="course-sks" min="1" max="6" placeholder="SKS" value="${course.sks}">
                <select class="course-grade">
                    <option value="">Nilai</option>
                    <option value="A" ${course.grade==='A'?'selected':''}>A</option>
                    <option value="AB" ${course.grade==='AB'?'selected':''}>AB</option>
                    <option value="B" ${course.grade==='B'?'selected':''}>B</option>
                    <option value="BC" ${course.grade==='BC'?'selected':''}>BC</option>
                    <option value="C" ${course.grade==='C'?'selected':''}>C</option>
                    <option value="D" ${course.grade==='D'?'selected':''}>D</option>
                    <option value="E" ${course.grade==='E'?'selected':''}>E</option>
                </select>
            </div>
        `;
        row.querySelector('.remove-course-btn').addEventListener('click', () => {
            row.remove();
            calculateGPA();
        });
        return row;
    };

    const addCourse = () => {
        coursesList.appendChild(createCourseRow());
    };

    // --- Upload & Download Functions ---
    const downloadTemplate = (e) => {
        e.preventDefault();
        const headers = '"Nama Mata Kuliah",SKS,Nilai';
        const example1 = '"Contoh: Pemrograman Dasar",3,A';
        const example2 = '"Contoh: Kalkulus I",4,AB';
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${example1}\n${example2}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_mata_kuliah.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            alert('Format file tidak didukung. Harap unggah file .csv');
            event.target.value = ''; // Clear input
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseCSVAndPopulate(text);
        };
        reader.readAsText(file);
        event.target.value = ''; // Clear input for re-upload
    };

    const parseCSVAndPopulate = (text) => {
        const courses = [];
        const lines = text.split(/\r?\n/).slice(1); // Skip header

        lines.forEach(line => {
            if (line.trim() === '') return;
            const columns = line.split(',');
            if (columns.length >= 3) {
                const name = columns[0].replace(/"/g, '').trim();
                const sks = parseInt(columns[1].trim(), 10);
                const grade = columns[2].trim().toUpperCase();

                if (name && !isNaN(sks)) {
                    courses.push({ name, sks, grade: gradePoints.hasOwnProperty(grade) ? grade : '' });
                }
            }
        });

        if (courses.length > 0) {
            coursesList.innerHTML = ''; // Clear existing courses
            courses.forEach(course => coursesList.appendChild(createCourseRow(course)));
            calculateGPA();
        } else {
            alert('Tidak ada data mata kuliah yang valid ditemukan di dalam file.');
        }
    };
    
    // --- AI Modal Functions ---
    const openModal = () => { modal.style.display = 'flex'; }
    const closeModal = () => { modal.style.display = 'none'; }

    const getAIFeedback = async () => {
        openModal();
        modalLoader.style.display = 'flex';
        modalResponse.style.display = 'none';
        
        const studentName = document.getElementById('student-name').value;
        const studentNIM = document.getElementById('student-nim').value;
        const gpa = gpaResultEl.textContent;
        const coursesData = Array.from(coursesList.querySelectorAll('.course-card-item')).map(row => {
            const name = row.querySelector('.course-name').value;
            const sks = row.querySelector('.course-sks').value;
            const grade = row.querySelector('.course-grade').value;
            return (name && sks && grade) ? `- ${name} (${sks} SKS): Nilai ${grade}` : null;
        }).filter(Boolean);

        if (coursesData.length === 0) { 
            modalResponse.innerHTML = '<p>Silakan isi setidaknya satu mata kuliah lengkap untuk mendapatkan umpan balik.</p>';
            modalLoader.style.display = 'none';
            modalResponse.style.display = 'block'; 
            return; 
        }

        const prompt = `Anda adalah seorang konselor akademik yang positif dan memotivasi di Telkom University. Seorang mahasiswa meminta umpan balik tentang performa akademiknya.\n\nData Mahasiswa:\nNama: ${studentName || "Mahasiswa"}\nNIM: ${studentNIM || "Tidak ada"}\nIPK saat ini: ${gpa}\nMata Kuliah yang telah dinilai:\n${coursesData.join('\n')}\n\nTugas Anda:\n1. Sapa mahasiswa dengan namanya jika tersedia. Berikan paragraf pembuka yang singkat, positif, dan memotivasi berdasarkan IPK mereka.\n2. Berikan 3-4 poin saran belajar yang spesifik dan praktis dalam format daftar (list).\n3. Berikan paragraf penutup yang memberi semangat.\n\nJawab dalam format HTML sederhana (gunakan <p>, <ul>, dan <li>) dan dalam Bahasa Indonesia.`;
        
        try {
            const apiKey = ""; // API key is handled by the browser environment
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const result = await response.json();
            modalResponse.innerHTML = result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("AI Feedback Error:", error);
            modalResponse.innerHTML = `<p style="color:var(--error-color)">Maaf, terjadi kesalahan saat mengambil saran dari AI. Silakan coba lagi nanti.</p>`;
        } finally {
            modalLoader.style.display = 'none';
            modalResponse.style.display = 'block';
        }
    };
    
    // --- Event Listeners ---
    coursesList.addEventListener('input', calculateGPA);
    addCourseBtn.addEventListener('click', addCourse);
    programLevelSelect.addEventListener('change', () => {
        document.querySelectorAll('.predicate-table').forEach(t => t.style.display = 'none');
        document.getElementById(`predicate-${programLevelSelect.value}`).style.display = 'block';
        calculateGPA();
        checkEnglishScore();
    });
    englishScoreInput.addEventListener('input', checkEnglishScore);
    
    // New Listeners for Upload/Download
    downloadTemplateBtn.addEventListener('click', downloadTemplate);
    uploadSpreadsheetInput.addEventListener('change', handleFileUpload);
    
    // AI Modal Listeners
    getAIFeedbackBtn.addEventListener('click', getAIFeedback);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Tabs Listeners
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // --- Initial Setup ---
    if (initialCourses.length > 0) {
        initialCourses.forEach(course => coursesList.appendChild(createCourseRow(course)));
    } else {
        addCourse(); // Start with one empty row
    }
    
    document.querySelector('.predicate-table').style.display = 'block';
    calculateGPA();
});
