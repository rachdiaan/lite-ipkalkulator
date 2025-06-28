document.addEventListener('DOMContentLoaded', function() {
    // --- Initial Data & Constants ---
    const gradePoints = { 'A': 4.0, 'AB': 3.5, 'B': 3.0, 'BC': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0 };
    const minEnglishScoresForGraduation = { s1: 450, s2: 475, s3: 500 };
    const s2Curriculum = {
        manajemen: {
            'Kelas Reguler': { 'Semester 1': [ { name: 'Financial Management and Technology', sks: 3 }, { name: 'Human Capital Management', sks: 3 }, { name: 'Marketing Management in Digital Era', sks: 3 }, { name: 'Managing Seamless Operation', sks: 3 }, { name: 'Data Science in Decision Intelligence', sks: 4 }, { name: 'Etika Bisnis', sks: 2 } ], 'Semester 2': [ { name: 'Manajemen Strategi & Ekosistem Bisnis', sks: 4 }, { name: 'Design Thinking for Business', sks: 4 }, { name: 'Mata Kuliah Pilihan Wajib', sks: 4 }, { name: 'Research Method', sks: 3 }, { name: 'Sertifikasi', sks: 1 }, { name: 'Seminar', sks: 2 } ], 'Semester 3': [ { name: 'Mata Kuliah Pilihan 1', sks: 4 }, { name: 'Mata Kuliah Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 1', sks: 8 }, { name: 'Tugas Akhir 2', sks: 2 } ] },
            'Kelas Profesional dan Eksekutif': { 'Semester 1': [ { name: 'Financial Management and Technology', sks: 3 }, { name: 'Human Capital Management', sks: 3 }, { name: 'Marketing Management in Digital Era', sks: 3 }, { name: 'Managing Seamless Operation', sks: 3 }, { name: 'Data Science in Decision Intelligence', sks: 4 } ], 'Semester 2': [ { name: 'Manajemen Strategi & Ekosistem Bisnis', sks: 4 }, { name: 'Design Thinking for Business', sks: 4 }, { name: 'Etika Bisnis', sks: 2 }, { name: 'Mata Kuliah Pilihan Wajib', sks: 4 }, { name: 'Sertifikasi', sks: 1 } ], 'Semester 3': [ { name: 'Mata Kuliah Pilihan 1', sks: 4 }, { name: 'Mata Kuliah Pilihan 2', sks: 4 }, { name: 'Research Method', sks: 3 }, { name: 'Seminar', sks: 2 } ], 'Semester 4': [ { name: 'Tugas Akhir 1', sks: 8 }, { name: 'Tugas Akhir 2', sks: 2 } ] },
            'By Research': { 'Semester 1': [ { name: 'Financial Management and Technology', sks: 3 }, { name: 'Human Capital Management', sks: 3 }, { name: 'Marketing Management in Digital Era', sks: 3 }, { name: 'Managing Seamless Operation', sks: 3 }, { name: 'Data Science in Decision Intelligence', sks: 4 } ], 'Semester 2': [ { name: 'Manajemen Strategi & Ekosistem Bisnis', sks: 4 }, { name: 'Preliminary Study', sks: 4 }, { name: 'Study Literature', sks: 4 }, { name: 'Laporan Progres/Publikasi 1-Jurnal Scopus Q3', sks: 3 } ], 'Semester 3': [ { name: 'Research Design', sks: 4 }, { name: 'Pengumpulan Data', sks: 3 }, { name: 'Analisis Data', sks: 3 }, { name: 'Seminar Hasil', sks: 3 } ], 'Semester 4': [ { name: 'Tugas Akhir 1', sks: 8 }, { name: 'Tugas Akhir 2', sks: 2 } ] }
        },
        elektro: {
            'IWCSS': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Enginenering', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Advanced Wireless Communications', sks: 3 }, { name: 'Classical and Quantum Information Theory', sks: 3 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Artificial Intelligence for Wireless Communication', sks: 3 }, { name: 'Advanced Digital Signal Processing and Applications', sks: 3 }, { name: 'Elective Course 1 (Major)', sks: 3 }, { name: 'Elective Course 2 (Major)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis Proposal', sks: 3 }, { name: 'Thesis 1: Publication', sks: 5 }, { name: 'Advanced Satellite Systems', sks: 3 }, { name: 'Elective Course 3 (Major/Minor)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Elective Course 4 (Major/Minor)', sks: 3 } ] },
            'NECS': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Engineering', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Data Network & Protocols', sks: 3 }, { name: 'Internet of Things and Edge Computing', sks: 3 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Advanced Network Security', sks: 3 }, { name: 'Network Mathematics', sks: 3 }, { name: 'Elective Course 1 (Major)', sks: 3 }, { name: 'Elective Course 2 (Major)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis Proposal', sks: 3 }, { name: 'Thesis 1: Publication', sks: 5 }, { name: 'Management and Audit of Cyber Security', sks: 3 }, { name: 'Elective Course 3 (Major/Minor)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Elective Course 4 (Major/Minor)', sks: 3 } ] },
            'RMT': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Engineering', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Digital Telecommunication Policy and Regulation', sks: 3 }, { name: 'Telecommunication System and Network Planning', sks: 3 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Digital Business and Telecommunication Project Management', sks: 3 }, { name: 'Management and Audit of Cyber Security', sks: 3 }, { name: 'Elective Course 1 (Major)', sks: 3 }, { name: 'Elective Course 2 (Major)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis Proposal', sks: 3 }, { name: 'Thesis 1: Publication', sks: 5 }, { name: 'Management of Technology and Innovation', sks: 3 }, { name: 'Elective Course 3 (Major)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Elective Course 4 (Major)', sks: 3 } ] },
            'CIS': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Engineering', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Modeling and Simulation of Control System', sks: 3 }, { name: 'Intelligence Internet of Things', sks: 3 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Advanced Embedded System', sks: 3 }, { name: 'Advanced Robotics', sks: 3 }, { name: 'Elective Course 1 (Major)', sks: 3 }, { name: 'Elective Course 2 (Major)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis Proposal', sks: 3 }, { name: 'Thesis 1: Publication', sks: 5 }, { name: 'Advanced Machine Learning', sks: 3 }, { name: 'Elective Course 3 (Major)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Elective Course 4 (Major)', sks: 3 } ] },
            'SES': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Engineering', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Operation and Control of Energy System', sks: 3 }, { name: 'Sustainable Energy Planning', sks: 3 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Energy Regulation and Economics', sks: 3 }, { name: 'Advanced Power Electronics', sks: 3 }, { name: 'Elective Course 1 (Major)', sks: 3 }, { name: 'Elective Course 2 (Major)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis Proposal', sks: 3 }, { name: 'Thesis 1: Publication', sks: 5 }, { name: 'Grid Modernization', sks: 3 }, { name: 'Elective Course 3 (Major)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Elective Course 4 (Major)', sks: 3 } ] },
            'By Research': { 'Semester 1': [ { name: 'Advanced Engineering Mathematics', sks: 3 }, { name: 'Deep Learning for Electrical Engineering', sks: 3 }, { name: 'Research Philosophy and Ethics', sks: 3 }, { name: 'Entrepreneurship for Engineers', sks: 3 }, { name: 'Research Topics 1', sks: 5 } ], 'Semester 2': [ { name: 'Research Design', sks: 3 }, { name: 'Thesis Proposal', sks: 3 }, { name: 'Research Topics 2', sks: 5 }, { name: 'Elective Course 1 (Major/Minor)', sks: 3 }, { name: 'Elective Course 2 (Major/Minor)', sks: 3 } ], 'Semester 3': [ { name: 'Thesis 1', sks: 5 }, { name: 'Research Topics 3', sks: 5 }, { name: 'Elective Course 3 (Major/Minor)', sks: 3 } ], 'Semester 4': [ { name: 'Thesis 2', sks: 5 }, { name: 'Research Topics 4', sks: 5 } ] }
        },
        informatika: {
            'Data Science': { 'Semester 1': [ { name: 'Metodologi Riset', sks: 3 }, { name: 'Desain Algoritma Lanjut', sks: 4 }, { name: 'Prinsip Sains Data', sks: 3 }, { name: 'Pemodelan dan Optimasi Lanjut', sks: 4 } ], 'Semester 2': [ { name: 'Kecerdasan Buatan Lanjut', sks: 4 }, { name: 'Proposal Tesis', sks: 3 }, { name: 'Pemodelan Statistik untuk Sains Data', sks: 4 }, { name: 'Analitik Big Data Lanjut', sks: 4 } ], 'Semester 3': [ { name: 'Bisnis Digital', sks: 3 }, { name: 'Penulisan Akademik dan Presentasi', sks: 4 }, { name: 'Tugas Akhir 1', sks: 4 }, { name: 'Pilihan 1', sks: 4 } ], 'Semester 4': [ { name: 'Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 2', sks: 6 } ] },
            'Socio Informatics': { 'Semester 1': [ { name: 'Metodologi Riset', sks: 3 }, { name: 'Desain Algoritma Lanjut', sks: 4 }, { name: 'Pengenalan sosio Informatika dan Etika', sks: 3 }, { name: 'Pemodelan dan Optimasi Lanjut', sks: 4 } ], 'Semester 2': [ { name: 'Kecerdasan Buatan Lanjut', sks: 4 }, { name: 'Proposal Tesis', sks: 3 }, { name: 'Ilmu Jejaring', sks: 4 }, { name: 'Representasi dan Penalaran Pengetahuan', sks: 4 } ], 'Semester 3': [ { name: 'Bisnis Digital', sks: 3 }, { name: 'Penulisan Akademik dan Presentasi', sks: 4 }, { name: 'Tugas Akhir 1', sks: 4 }, { name: 'Pilihan 1', sks: 4 } ], 'Semester 4': [ { name: 'Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 2', sks: 6 } ] },
            'Computing Infrastructure and Services': { 'Semester 1': [ { name: 'Metodologi Riset', sks: 3 }, { name: 'Desain Algoritma Lanjut', sks: 4 }, { name: 'Pengenalan Infrastruktur dan Layanan Komputasi', sks: 3 }, { name: 'Pemodelan dan Optimasi Lanjut', sks: 4 } ], 'Semester 2': [ { name: 'Kecerdasan Buatan Lanjut', sks: 4 }, { name: 'Proposal Tesis', sks: 3 }, { name: 'Internet of Things Lanjut', sks: 4 }, { name: 'Komputasi Awan Lanjut', sks: 4 } ], 'Semester 3': [ { name: 'Bisnis Digital', sks: 3 }, { name: 'Penulisan Akademik dan Presentasi', sks: 4 }, { name: 'Tugas Akhir 1', sks: 4 }, { name: 'Pilihan 1', sks: 4 } ], 'Semester 4': [ { name: 'Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 2', sks: 6 } ] },
            'Computer Vision': { 'Semester 1': [ { name: 'Metodologi Riset', sks: 3 }, { name: 'Desain Algoritma Lanjut', sks: 4 }, { name: 'Tren pada Visi Komputer', sks: 3 }, { name: 'Pemodelan dan Optimasi Lanjut', sks: 4 } ], 'Semester 2': [ { name: 'Kecerdasan Buatan Lanjut', sks: 4 }, { name: 'Proposal Tesis', sks: 3 }, { name: 'Pengolahan Citra Digital Lanjut', sks: 4 }, { name: 'Visi Komputer Fundamental', sks: 4 } ], 'Semester 3': [ { name: 'Bisnis Digital', sks: 3 }, { name: 'Penulisan Akademik dan Presentasi', sks: 4 }, { name: 'Tugas Akhir 1', sks: 4 }, { name: 'Pilihan 1', sks: 4 } ], 'Semester 4': [ { name: 'Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 2', sks: 6 } ] },
            'Software Engineering': { 'Semester 1': [ { name: 'Metodologi Riset', sks: 3 }, { name: 'Desain Algoritma Lanjut', sks: 4 }, { name: 'Tren pada Rekayasa Perangkat Lunak', sks: 3 }, { name: 'Pemodelan dan Optimasi Lanjut', sks: 4 } ], 'Semester 2': [ { name: 'Kecerdasan Buatan Lanjut', sks: 4 }, { name: 'Proposal Tesis', sks: 3 }, { name: 'Rekayasa Perangkat Lunak Lanjut', sks: 4 }, { name: 'Rekayasa Perangkat Lunak Perusahaan', sks: 4 } ], 'Semester 3': [ { name: 'Bisnis Digital', sks: 3 }, { name: 'Penulisan Akademik dan Presentasi', sks: 4 }, { name: 'Tugas Akhir 1', sks: 4 }, { name: 'Pilihan 1', sks: 4 } ], 'Semester 4': [ { name: 'Pilihan 2', sks: 4 }, { name: 'Tugas Akhir 2', sks: 6 } ] }
        },
        cybersecurity: {
            'Research Based': { 'Semester 1': [ { name: 'Prinsip Dasar Keamanan', sks: 4 }, { name: 'Kerentanan Arsitektur Sistem Komputer dan Jaringan', sks: 3 }, { name: 'Kerangka Kerja Forensik Digital', sks: 3 }, { name: 'Sekuritas dan Privasi untuk Pengguna Teknologi Informasi', sks: 3 }, { name: 'Proyek pada Akademik', sks: 3 }, { name: 'Metodologi Riset', sks: 3 } ], 'Semester 2': [ { name: 'MK Lanjutan 1', sks: 3 }, { name: 'MK Lanjutan 2', sks: 3 }, { name: 'MK Pendukung 1', sks: 3 }, { name: 'MK Pendukung 2', sks: 3 }, { name: 'Implementasi Proyek 1', sks: 4 } ], 'Semester 3': [ { name: 'Implementasi Proyek 2', sks: 4 }, { name: 'Keamanan Siber dan Forensik Digital pada Era Bisnis Digital', sks: 3 }, { name: 'Penulisan Tesis/ Publikasi / Dokumen Prototipe', sks: 3 }, { name: 'Proyek pada Industri', sks: 3 } ], 'Semester 4': [ { name: 'Thesis', sks: 6 } ] },
            'Course Based': { 'Semester 1': [ { name: 'Prinsip Dasar Keamanan', sks: 4 }, { name: 'Kerentanan Arsitektur Sistem Komputer dan Jaringan', sks: 3 }, { name: 'Kerangka Kerja Forensik Digital', sks: 3 }, { name: 'Sekuritas dan Privasi untuk Pengguna Teknologi Informasi', sks: 3 }, { name: 'Proyek pada Akademik', sks: 3 }, { name: 'Metodologi Riset', sks: 3 } ], 'Semester 2': [ { name: 'MK Wajib Peminatan 1', sks: 3 }, { name: 'MK Wajib Peminatan 2', sks: 3 }, { name: 'MK Pendukung 1', sks: 3 }, { name: 'MK Pendukung 2', sks: 3 }, { name: 'Implementasi Proyek 1', sks: 4 } ], 'Semester 3': [ { name: 'Implementasi Proyek 2', sks: 4 }, { name: 'Keamanan Siber dan Forensik Digital pada Era Bisnis Digital', sks: 3 }, { name: 'Penulisan Tesis/ Publikasi / Dokumen Prototipe', sks: 3 }, { name: 'Proyek pada Industri', sks: 3 } ], 'Semester 4': [ { name: 'Thesis', sks: 6 } ] },
            'Project Based': { 'Semester 1': [ { name: 'Prinsip Dasar Keamanan', sks: 4 }, { name: 'Kerentanan Arsitektur Sistem Komputer dan Jaringan', sks: 3 }, { name: 'Kerangka Kerja Forensik Digital', sks: 3 }, { name: 'Sekuritas dan Privasi untuk Pengguna Teknologi Informasi', sks: 3 }, { name: 'Proyek pada Akademik', sks: 3 }, { name: 'Metodologi Riset', sks: 3 } ], 'Semester 2': [ { name: 'MK Lanjutan 1', sks: 3 }, { name: 'MK Lanjutan 2', sks: 3 }, { name: 'MK Pendukung 1', sks: 3 }, { name: 'MK Pendukung 2', sks: 3 }, { name: 'Implementasi Proyek 1', sks: 4 } ], 'Semester 3': [ { name: 'Implementasi Proyek 2', sks: 4 }, { name: 'Keamanan Siber dan Forensik Digital pada Era Bisnis Digital', sks: 3 }, { name: 'Penulisan Tesis/ Publikasi / Dokumen Prototipe', sks: 3 }, { name: 'Proyek pada Industri', sks: 3 } ], 'Semester 4': [ { name: 'Thesis', sks: 6 } ] }
        },
        industri: {
            'Skema by Course': { 'Semester 1': [ { name: 'Filsafat Teknik Industri', sks: 2 }, { name: 'Analisis Statistik', sks: 3 }, { name: 'Metode Optimasi', sks: 2 }, { name: 'ICT Business Management', sks: 2 }, { name: 'Pilihan 1', sks: 3 } ], 'Semester 2': [ { name: 'Pemodelan Sistem Lanjut', sks: 3 }, { name: 'Metodologi Penelitian', sks: 3 }, { name: 'Rekayasa Sistem IndustrI', sks: 3 }, { name: 'Pilihan 2', sks: 3 }, { name: 'Pilihan 3', sks: 3 } ], 'Semester 3': [ { name: 'Desk Evaluation', sks: 3 }, { name: 'Proposal Tesis', sks: 6 } ], 'Semester 4': [ { name: 'Pemantauan', sks: 6 }, { name: 'Thesis 1', sks: 6 }, { name: 'Thesis 2', sks: 6 } ] },
            'Skema by Research': { 'Semester 1': [ { name: 'Filsafat Teknik Industri', sks: 2 }, { name: 'Analisis Statistik', sks: 3 }, { name: 'Metode Optimasi', sks: 2 }, { name: 'ICT Business Management', sks: 2 }, { name: 'Pilihan 1', sks: 3 } ], 'Semester 2': [ { name: 'Pemodelan Sistem Lanjut', sks: 3 }, { name: 'Metodologi Penelitian', sks: 3 }, { name: 'Rekayasa Sistem IndustrI', sks: 3 }, { name: 'Pilihan 2', sks: 3 }, { name: 'Pilihan 3', sks: 3 } ], 'Semester 3': [ { name: 'Penelitian Lapangan', sks: 3 }, { name: 'Proposal Tesis', sks: 6 } ], 'Semester 4': [ { name: 'Publikasi', sks: 6 }, { name: 'Thesis 1', sks: 6 }, { name: 'Thesis 2', sks: 6 } ] },
            'Skema by Project': { 'Semester 1': [ { name: 'Filsafat Teknik Industri', sks: 2 }, { name: 'Analisis Statistik', sks: 3 }, { name: 'Metode Optimasi', sks: 2 }, { name: 'ICT Business Management', sks: 2 }, { name: 'Pilihan 1', sks: 3 } ], 'Semester 2': [ { name: 'Pemodelan Sistem Lanjut', sks: 3 }, { name: 'Metodologi Penelitian', sks: 3 }, { name: 'Rekayasa Sistem IndustrI', sks: 3 }, { name: 'Pilihan 2', sks: 3 }, { name: 'Pilihan 3', sks: 3 } ], 'Semester 3': [ { name: 'Workshop 1', sks: 3 }, { name: 'Proposal Tesis', sks: 6 } ], 'Semester 4': [ { name: 'Workshop 2', sks: 6 }, { name: 'Thesis 1', sks: 6 }, { name: 'Thesis 2', sks: 6 } ] }
        },
        akuntansi: {
            'Accounting and Financial Modelling': { 'Semester 1': [ { name: 'Kreativitas Bisnis dan Digipreneur', sks: 3 }, { name: 'Analisis Akuntansi Perpajakan', sks: 4 }, { name: 'Etika Bisnis', sks: 3 }, { name: 'Pengantar Akuntansi Karbon', sks: 4 } ], 'Semester 2': [ { name: 'Analisis Standar Akuntansi Indonesia', sks: 4 }, { name: 'Perilaku Keuangan dan Akuntansi', sks: 4 }, { name: 'Kecerdasan Buatan dalam Bisnis', sks: 3 }, { name: 'Lingkungan , Sosial, dan Tata Kelola', sks: 3 } ], 'Semester 3': [ { name: 'Metode Penelitian Akuntansi', sks: 4 }, { name: 'Analisis Data Multivariat', sks: 4 }, { name: 'Pemodelan Keuangan', sks: 3 }, { name: 'Penilaian Perusahaan, Merger and Akuisisi', sks: 3 }, { name: 'Seminar Akuntansi Keuangan', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Tugas Akhir', sks: 3 }, { name: 'Tugas Akhir', sks: 6 } ] },
            'Investigation Audit': { 'Semester 1': [ { name: 'Kreativitas Bisnis dan Digipreneur', sks: 3 }, { name: 'Analisis Akuntansi Perpajakan', sks: 4 }, { name: 'Etika Bisnis', sks: 3 }, { name: 'Pengantar Akuntansi Karbon', sks: 4 } ], 'Semester 2': [ { name: 'Analisis Standar Akuntansi Indonesia', sks: 4 }, { name: 'Perilaku Keuangan dan Akuntansi', sks: 4 }, { name: 'Kecerdasan Buatan dalam Bisnis', sks: 3 }, { name: 'Lingkungan , Sosial, dan Tata Kelola', sks: 3 } ], 'Semester 3': [ { name: 'Metode Penelitian Akuntansi', sks: 4 }, { name: 'Analisis Data Multivariat', sks: 4 }, { name: 'Akuntansi Forensik dan Investigasi Keuangan', sks: 3 }, { name: 'Pencegahan Kecurangan', sks: 3 }, { name: 'Masalah Terkini dalam Audit', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Tugas Akhir', sks: 3 }, { name: 'Tugas Akhir', sks: 6 } ] },
            'Management Accounting System': { 'Semester 1': [ { name: 'Kreativitas Bisnis dan Digipreneur', sks: 3 }, { name: 'Analisis Akuntansi Perpajakan', sks: 4 }, { name: 'Etika Bisnis', sks: 3 }, { name: 'Pengantar Akuntansi Karbon', sks: 4 } ], 'Semester 2': [ { name: 'Analisis Standar Akuntansi Indonesia', sks: 4 }, { name: 'Perilaku Keuangan dan Akuntansi', sks: 4 }, { name: 'Kecerdasan Buatan dalam Bisnis', sks: 3 }, { name: 'Lingkungan , Sosial, dan Tata Kelola', sks: 3 } ], 'Semester 3': [ { name: 'Metode Penelitian Akuntansi', sks: 4 }, { name: 'Analisis Data Multivariat', sks: 4 }, { name: 'Akuntansi Manajemen Menengah', sks: 3 }, { name: 'Akuntansi Manajemen Strategis', sks: 3 }, { name: 'Akuntansi Manajemen Kontemporer', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Tugas Akhir', sks: 3 }, { name: 'Tugas Akhir', sks: 6 } ] }
        },
        komunikasi: {
            'Digital Communication Management': { 'Semester 1': [ { name: 'Teori Komunikasi dan Media', sks: 4 }, { name: 'Metode Riset Analitik', sks: 4 }, { name: 'Etika Filsafat dan Komunikasi', sks: 3 }, { name: 'Manajemen Kewirausahaan', sks: 3 }, { name: 'Komunikasi Global di era Digital', sks: 3 }, { name: 'Kepemimpinan dan Transformasi Digital', sks: 3 } ], 'Semester 2': [ { name: 'Manajemen Komunikasi Korporasi', sks: 4 }, { name: 'Manajemen Isu dan Krisis', sks: 4 }, { name: 'Audit Manajemen Komunikasi', sks: 4 }, { name: 'Strategi dan Program Manajemen Komunikasi Digital', sks: 4 }, { name: 'Sertifikasi', sks: 4 } ], 'Semester 3': [ { name: 'Kajian Literatur', sks: 4 }, { name: 'Proposal Tugas Akhir', sks: 5 }, { name: 'Tugas Akhir', sks: 7 } ] },
            'Digital Media': { 'Semester 1': [ { name: 'Teori Komunikasi dan Media', sks: 4 }, { name: 'Metode Riset Analitik', sks: 4 }, { name: 'Etika Filsafat dan Komunikasi', sks: 3 }, { name: 'Manajemen Kewirausahaan', sks: 3 }, { name: 'Komunikasi Global di era Digital', sks: 3 }, { name: 'Kepemimpinan dan Transformasi Digital', sks: 3 } ], 'Semester 2': [ { name: 'Studi Budaya dan Media Digital', sks: 4 }, { name: 'Ekonomi politik media digital', sks: 4 }, { name: 'Bisnis Media Digital', sks: 4 }, { name: 'Analisis Media Digital', sks: 4 }, { name: 'Sertifikasi', sks: 4 } ], 'Semester 3': [ { name: 'Kajian Literatur', sks: 4 }, { name: 'Proposal Tugas Akhir', sks: 5 }, { name: 'Tugas Akhir', sks: 7 } ] }
        },
        administrasi_bisnis: {
            'Business Governance': { 'Semester 1': [ { name: 'Corporate Governance Strategic', sks: 3 }, { name: 'Business Global and Corporate Strategic', sks: 3 }, { name: 'Human Capital Strategy', sks: 3 }, { name: 'Knowledge Management Strategic', sks: 3 }, { name: 'Enterprise Resource Planning', sks: 3 } ], 'Semester 2': [ { name: 'Corporate Finance Strategic', sks: 3 }, { name: 'Supply Chain Management', sks: 3 }, { name: 'Strategic Global Entrepreneurship', sks: 3 }, { name: 'Research Method & Scientific Writing', sks: 3 }, { name: 'Entrepreuneurial Marketing', sks: 3 } ], 'Semester 3': [ { name: 'Big Data Management & Analytics', sks: 3 }, { name: 'Specialization Course 1: Corporate Performance Management', sks: 3 }, { name: 'Specialization Course 2: Corporate Social Resposibility', sks: 3 }, { name: 'Specialization Course 3: Governance Risk Compliance', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Thesis/Project', sks: 4 }, { name: 'Thesis/Project', sks: 8 } ] },
            'Strategic Leadership': { 'Semester 1': [ { name: 'Corporate Governance Strategic', sks: 3 }, { name: 'Business Global and Corporate Strategic', sks: 3 }, { name: 'Human Capital Strategy', sks: 3 }, { name: 'Knowledge Management Strategic', sks: 3 }, { name: 'Enterprise Resource Planning', sks: 3 } ], 'Semester 2': [ { name: 'Corporate Finance Strategic', sks: 3 }, { name: 'Supply Chain Management', sks: 3 }, { name: 'Strategic Global Entrepreneurship', sks: 3 }, { name: 'Research Method & Scientific Writing', sks: 3 }, { name: 'Entrepreuneurial Marketing', sks: 3 } ], 'Semester 3': [ { name: 'Big Data Management & Analytics', sks: 3 }, { name: 'Specialization Course 1: Digital Leadership', sks: 3 }, { name: 'Specialization Course 2: Strategic Business Patnership', sks: 3 }, { name: 'Specialization Course 3: Corporate Culture', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Thesis/Project', sks: 4 }, { name: 'Thesis/Project', sks: 8 } ] },
            'Start-Up Business Strategy': { 'Semester 1': [ { name: 'Corporate Governance Strategic', sks: 3 }, { name: 'Business Global and Corporate Strategic', sks: 3 }, { name: 'Human Capital Strategy', sks: 3 }, { name: 'Knowledge Management Strategic', sks: 3 }, { name: 'Enterprise Resource Planning', sks: 3 } ], 'Semester 2': [ { name: 'Corporate Finance Strategic', sks: 3 }, { name: 'Supply Chain Management', sks: 3 }, { name: 'Strategic Global Entrepreneurship', sks: 3 }, { name: 'Research Method & Scientific Writing', sks: 3 }, { name: 'Entrepreuneurial Marketing', sks: 3 } ], 'Semester 3': [ { name: 'Big Data Management & Analytics', sks: 3 }, { name: 'Specialization Course 1: Digital Innovation', sks: 3 }, { name: 'Specialization Course 2: Business Idea and Opportunities', sks: 3 }, { name: 'Specialization Course 3: Investor Pitching Strategic', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Thesis/Project', sks: 4 }, { name: 'Thesis/Project', sks: 8 } ] },
            'Global Business Strategy': { 'Semester 1': [ { name: 'Corporate Governance Strategic', sks: 3 }, { name: 'Business Global and Corporate Strategic', sks: 3 }, { name: 'Human Capital Strategy', sks: 3 }, { name: 'Knowledge Management Strategic', sks: 3 }, { name: 'Enterprise Resource Planning', sks: 3 } ], 'Semester 2': [ { name: 'Corporate Finance Strategic', sks: 3 }, { name: 'Supply Chain Management', sks: 3 }, { name: 'Strategic Global Entrepreneurship', sks: 3 }, { name: 'Research Method & Scientific Writing', sks: 3 }, { name: 'Entrepreuneurial Marketing', sks: 3 } ], 'Semester 3': [ { name: 'Big Data Management & Analytics', sks: 3 }, { name: 'Specialization Course 1: Global Expansion Strategy', sks: 3 }, { name: 'Specialization Course 2: Managing Diversity', sks: 3 }, { name: 'Specialization Course 3: Global Business Communication', sks: 3 } ], 'Semester 4': [ { name: 'Proposal Thesis/Project', sks: 4 }, { name: 'Thesis/Project', sks: 8 } ] }
        },
        desain: {
            'Skema by Research': { 'Semester 1': [ { name: 'Design Thinking', sks: 6 }, { name: 'Design, Culture, and Humanity', sks: 6 }, { name: 'Design, Business, and Strategy', sks: 6 } ], 'Semester 2': [ { name: 'MK Pilihan: Service Design / Sustainability Design', sks: 2 }, { name: 'Design Thinking & Research Methods', sks: 6 }, { name: 'Pra Thesis', sks: 6 }, { name: 'Academic Writing', sks: 4 } ], 'Semester 3': [ { name: 'Final Exam (Thesis)', sks: 8 }, { name: 'Publication Ethics', sks: 4 }, { name: 'Academic Publication', sks: 6 } ] },
            'Skema by Project': { 'Semester 1': [ { name: 'Design Thinking', sks: 6 }, { name: 'Design, Culture, and Humanity', sks: 6 }, { name: 'Design, Business, and Strategy', sks: 6 } ], 'Semester 2': [ { name: 'MK Pilihan: Service Design / Sustainability Design', sks: 2 }, { name: 'Design & Innovation for Project', sks: 6 }, { name: 'Pra Project', sks: 6 }, { name: 'Portofolio', sks: 4 } ], 'Semester 3': [ { name: 'Final Exam (Thesis)', sks: 8 }, { name: 'Intelectual Property Management', sks: 4 }, { name: 'Design Expo', sks: 6 } ] }
        }
    };

    // --- Helper Functions ---
    const getPredicate = (gpa, level) => {
        if (level === 's1') { if (gpa >= 3.91) return 'Sempurna'; if (gpa >= 3.51) return 'Dengan Pujian'; if (gpa >= 3.01) return 'Sangat Memuaskan'; if (gpa >= 2.76) return 'Memuaskan'; } 
        if (level === 's2') { if (gpa >= 3.96) return 'Sempurna'; if (gpa >= 3.76) return 'Dengan Pujian'; if (gpa >= 3.51) return 'Sangat Memuaskan'; if (gpa >= 3.26) return 'Memuaskan'; } 
        if (level === 's3') { if (gpa >= 3.96) return 'Sempurna'; if (gpa >= 3.76) return 'Dengan Pujian'; if (gpa >= 3.51) return 'Sangat Memuaskan'; if (gpa >= 3.26) return 'Memuaskan'; }
        return 'Predikat akan tampil di sini';
    };

    // --- Child Components ---
    const CourseCard = ({ course, onCourseChange, onRemoveCourse }) => (
        <div className="flex flex-col gap-3 p-4 bg-white/60 rounded-2xl animate-fadeIn">
            <div className="flex justify-between items-start">
                <input type="text" className="w-full border-none bg-transparent p-0 font-medium text-gray-800 focus:ring-0" placeholder="Nama Mata Kuliah" value={course.name} onChange={(e) => onCourseChange(course.id, 'name', e.target.value)} />
                <button onClick={() => onRemoveCourse(course.id)} className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all duration-200">
                    &times;
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full text-center" min="1" max="10" placeholder="SKS" value={course.sks} onChange={(e) => onCourseChange(course.id, 'sks', e.target.value)} />
                <select className="w-full" value={course.grade} onChange={(e) => onCourseChange(course.id, 'grade', e.target.value)}>
                    <option value="">Nilai</option>
                    {Object.keys(gradePoints).map(grade => <option key={grade} value={grade}>{grade}</option>)}
                </select>
            </div>
        </div>
    );

    const Modal = ({ title, children, show, onClose }) => {
        useEffect(() => {
            const handleEsc = (event) => {
                if (event.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }, [onClose]);

        if (!show) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 bg-black/60" onClick={onClose}>
                <div className="relative w-full max-w-lg p-6 bg-white/70 rounded-3xl shadow-xl backdrop-blur-xl transition-transform duration-300 transform" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all">&times;</button>
                    </div>
                    <div className="py-4 max-h-[60vh] overflow-y-auto">{children}</div>
                </div>
            </div>
        );
    };


    // --- Main App Component ---
    export default function App() {
        // --- State Management ---
        const [courses, setCourses] = useState([{ id: 1, name: '', sks: '', grade: '' }]);
        const [studentInfo, setStudentInfo] = useState({ name: '', nim: '', programLevel: 's1', englishScore: '' });
        const [s2Plan, setS2Plan] = useState({ major: 'manajemen', concentration: 'Kelas Reguler', semester: 'Semester 1' });
        const [activeTab, setActiveTab] = useState('tab-1');
        const [loadingAI, setLoadingAI] = useState(false);
        const [feedbackModal, setFeedbackModal] = useState({ show: false, content: '' });
        const [plannerModal, setPlannerModal] = useState({ show: false, content: '' });
        
        // --- Memoized Calculations ---
        const gpaData = useMemo(() => {
            const valuedCourses = courses.filter(c => c.sks && c.grade && gradePoints[c.grade]);
            const totalSKS = valuedCourses.reduce((sum, c) => sum + parseInt(c.sks), 0);
            const totalPoints = valuedCourses.reduce((sum, c) => sum + (parseInt(c.sks) * gradePoints[c.grade]), 0);
            const gpa = totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : '0.00';
            return { gpa, totalSKS, predicate: getPredicate(parseFloat(gpa), studentInfo.programLevel) };
        }, [courses, studentInfo.programLevel]);
        
        const englishScoreStatus = useMemo(() => {
            const score = parseInt(studentInfo.englishScore);
            if (isNaN(score)) return { text: '', color: '' };
            const minScore = minEnglishScoresForGraduation[studentInfo.programLevel];
            if (score >= minScore) {
                return { text: `✓ Memenuhi syarat (min. ${minScore})`, color: 'text-green-600' };
            } else {
                return { text: `✗ Belum memenuhi syarat (min. ${minScore})`, color: 'text-red-600' };
            }
        }, [studentInfo.englishScore, studentInfo.programLevel]);

        // --- Dynamic Select Options ---
        const concentrationOptions = Object.keys(s2Curriculum[s2Plan.major]);
        const semesterOptions = Object.keys(s2Curriculum[s2Plan.major][s2Plan.concentration]);

        // --- Event Handlers ---
        const handleInfoChange = (field, value) => {
            setStudentInfo(prev => ({ ...prev, [field]: value }));
        };

        const handleS2PlanChange = (field, value) => {
            setS2Plan(prevPlan => {
                const newPlan = { ...prevPlan, [field]: value };
                if (field === 'major') {
                    newPlan.concentration = Object.keys(s2Curriculum[value])[0];
                    newPlan.semester = Object.keys(s2Curriculum[value][newPlan.concentration])[0];
                } else if (field === 'concentration') {
                    newPlan.semester = Object.keys(s2Curriculum[s2Plan.major][value])[0];
                }
                return newPlan;
            });
        };

        const handleCourseChange = (id, field, value) => {
            setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
        };

        const addCourse = () => setCourses(prev => [...prev, { id: Date.now(), name: '', sks: '', grade: '' }]);
        const removeCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

        const fillS2Courses = () => {
            const coursesToFill = s2Curriculum[s2Plan.major][s2Plan.concentration][s2Plan.semester];
            setCourses(coursesToFill.map((c, i) => ({ ...c, id: Date.now() + i, grade: '' })));
        };

        const callGeminiAPI = async (prompt) => {
            try {
                const apiKey = ""; // API key is handled by the browser environment
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `API Error: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.candidates && result.candidates.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                } else {
                    throw new Error("Respon dari AI tidak valid atau kosong.");
                }
            } catch (error) {
                console.error("AI Feedback Error:", error);
                return `<p class="text-red-600"><strong>Gagal Terhubung ke AI.</strong></p><p class="text-sm text-gray-500">Ini bisa terjadi jika Anda menjalankan file ini secara langsung di browser. Coba jalankan aplikasi melalui server lokal.</p>`;
            }
        };
        
        const handleGetFeedback = async () => {
            setLoadingAI(true);
            setFeedbackModal({ show: true, content: '' });

            const coursesData = courses.filter(c => c.name && c.sks && c.grade).map(c => `- ${c.name} (${c.sks} SKS): Nilai ${c.grade}`);
            if(coursesData.length === 0) {
                setFeedbackModal({ show: true, content: '<p>Silakan isi setidaknya satu mata kuliah lengkap untuk mendapatkan umpan balik.</p>' });
                setLoadingAI(false);
                return;
            }
            
            const prompt = `Anda adalah seorang konselor akademik yang positif di Telkom University. Seorang mahasiswa meminta umpan balik.\n\nData: Nama: ${studentInfo.name || "Mahasiswa"}, IPK: ${gpaData.gpa}\nMata Kuliah: ${coursesData.join('\n')}\n\nTugas: Sapa mahasiswa, berikan paragraf pembuka positif, 3-4 poin saran belajar praktis, dan paragraf penutup yang memberi semangat. Jawab dalam format HTML sederhana (gunakan <p>, <ul>, dan <li>) dan dalam Bahasa Indonesia.`;
            const response = await callGeminiAPI(prompt);
            setFeedbackModal({ show: true, content: response });
            setLoadingAI(false);
        };

        const handleGetPlanner = async (type) => {
            setPlannerModal(prev => ({...prev, content: 'loading'}));
            
            const coursesForPrompt = courses.filter(c => c.name && c.grade);
            if(coursesForPrompt.length === 0) {
                 setPlannerModal(prev => ({...prev, content: '<p>Silakan isi mata kuliah terlebih dahulu.</p>'}));
                return;
            }

            let prompt = '';
            if(type === 'study') {
                prompt = `Anda adalah seorang tutor akademik. Buatkan rencana belajar mingguan dalam format tabel HTML untuk mahasiswa berdasarkan daftar mata kuliah ini:\n\n${coursesForPrompt.map(c => `- ${c.name} (Nilai: ${c.grade})`).join('\n')}\n\nFokuskan lebih banyak waktu pada mata kuliah dengan nilai C, D, atau E. Buat jadwal dari Senin hingga Jumat, dengan sesi pagi, siang, dan sore. Berikan juga tips singkat di akhir.`;
            } else {
                 const highGradeCourses = courses.filter(c => c.name && ['A', 'AB', 'B'].includes(c.grade));
                 if (highGradeCourses.length === 0) {
                    setPlannerModal(prev => ({...prev, content: '<p>Isi setidaknya satu mata kuliah dengan nilai A, AB, atau B untuk mendapatkan saran karir.</p>'}));
                    return;
                 }
                 prompt = `Anda adalah seorang konselor karir. Berdasarkan daftar mata kuliah dengan nilai terbaik ini:\n\n${highGradeCourses.map(c => `- ${c.name}`).join('\n')}\n\nBerikan 3 saran jalur karir yang relevan. Untuk setiap saran, berikan penjelasan singkat (2-3 kalimat). Gunakan format HTML dengan <h3> untuk judul karir dan <p> untuk penjelasan.`;
            }

            const response = await callGeminiAPI(prompt);
            setPlannerModal(prev => ({...prev, content: response}));
        };
        

        // --- JSX Render ---
        return (
            <div className="bg-[#f0f2f5] min-h-screen font-sans text-gray-800">
                 <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-[-100px] left-[-150px] w-[400px] h-[400px] bg-red-100 rounded-full filter blur-3xl opacity-20 animate-move-one"></div>
                    <div className="absolute bottom-[-150px] right-[-200px] w-[500px] h-[500px] bg-[#B6252A] rounded-full filter blur-3xl opacity-20 animate-move-two"></div>
                </div>
                
                <main className="max-w-7xl mx-auto p-4 sm:p-8">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                        <img className="h-16 w-auto" src="https://smb.telkomuniversity.ac.id/wp-content/uploads/2023/03/Logo-Utama-Telkom-University.png" alt="Logo Telkom University"/>
                        <div className="text-center sm:text-left sm:border-l-2 sm:border-gray-200 sm:pl-6">
                            <h1 className="text-3xl font-bold text-gray-900">Kalkulator Akademik Terpadu</h1>
                            <p className="text-gray-500 mt-1">Hitung IPK, cek syarat Bahasa Inggris, dan dapatkan saran AI.</p>
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left Column */}
                        <section className="lg:col-span-3 flex flex-col gap-8">
                            <div className="p-6 bg-white/60 rounded-3xl shadow-lg backdrop-blur-xl border border-white/80">
                                <h2 className="text-xl font-semibold mb-4">Informasi Mahasiswa & Syarat</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label htmlFor="student-name" className="text-sm font-medium text-gray-500">Nama Mahasiswa</label><input type="text" id="student-name" placeholder="Masukkan nama Anda" value={studentInfo.name} onChange={(e) => handleInfoChange('name', e.target.value)} /></div>
                                    <div><label htmlFor="student-nim" className="text-sm font-medium text-gray-500">NIM</label><input type="text" id="student-nim" placeholder="Masukkan NIM Anda" value={studentInfo.nim} onChange={(e) => handleInfoChange('nim', e.target.value)} /></div>
                                    <div><label htmlFor="program-level" className="text-sm font-medium text-gray-500">Jenjang Pendidikan</label><select id="program-level" value={studentInfo.programLevel} onChange={(e) => handleInfoChange('programLevel', e.target.value)}><option value="s1">D3/S1/S1 Terapan</option><option value="s2">S2/S2 Terapan</option><option value="s3">S3/S3 Terapan</option></select></div>
                                    <div><label htmlFor="english-score" className="text-sm font-medium text-gray-500">Skor TOEFL/EPrT</label><input type="number" id="english-score" placeholder="Contoh: 450" value={studentInfo.englishScore} onChange={(e) => handleInfoChange('englishScore', e.target.value)} /><div className={`text-xs mt-1 h-4 font-semibold ${englishScoreStatus.color}`}>{englishScoreStatus.text}</div></div>
                                </div>
                            </div>

                            {studentInfo.programLevel === 's2' && (
                                 <div className="p-6 bg-white/60 rounded-3xl shadow-lg backdrop-blur-xl border border-white/80">
                                    <h2 className="text-xl font-semibold mb-4">Rencana Studi S2</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                        <div><label htmlFor="s2-major" className="text-sm font-medium text-gray-500">Program Studi</label><select id="s2-major" value={s2Plan.major} onChange={(e) => handleS2PlanChange('major', e.target.value)}>{Object.keys(s2Curriculum).map(major => <option key={major} value={major}>{`S2 ${major.charAt(0).toUpperCase() + major.slice(1).replace('_', ' ')}`}</option>)}</select></div>
                                        <div><label htmlFor="s2-concentration" className="text-sm font-medium text-gray-500">Jalur/Konsentrasi</label><select id="s2-concentration" value={s2Plan.concentration} onChange={(e) => handleS2PlanChange('concentration', e.target.value)}>{concentrationOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                        <div className="sm:col-span-2 grid grid-cols-2 gap-4 items-end">
                                            <div className="col-span-1"><label htmlFor="s2-semester" className="text-sm font-medium text-gray-500">Semester</label><select id="s2-semester" value={s2Plan.semester} onChange={(e) => handleS2PlanChange('semester', e.target.value)}>{semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                            <button onClick={fillS2Courses} className="col-span-1 h-10 bg-[#B6252A] text-white rounded-lg font-semibold text-sm hover:bg-[#ED1E28] transition-all">Isi Mata Kuliah</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="p-6 bg-white/60 rounded-3xl shadow-lg backdrop-blur-xl border border-white/80">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Mata Kuliah</h2>
                                    <div className="flex items-center gap-2">
                                         <input type="file" id="upload-csv" className="hidden" accept=".csv" />
                                         <label htmlFor="upload-csv" className="action-btn">Unggah CSV</label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses.map((course, index) => <CourseCard key={course.id} course={course} onCourseChange={handleCourseChange} onRemoveCourse={removeCourse} />)}
                                </div>
                                <button onClick={addCourse} className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all">
                                    <span>Tambah Mata Kuliah</span>
                                </button>
                            </div>
                        </section>

                        {/* Right Column */}
                        <aside className="lg:col-span-2">
                            <div className="sticky top-8 flex flex-col gap-8">
                                <div className="p-6 text-center bg-white/60 rounded-3xl shadow-lg backdrop-blur-xl border border-white/80">
                                    <h3 className="font-semibold text-gray-600">Indeks Prestasi Kumulatif</h3>
                                    <p className="text-6xl font-bold text-[#B6252A] my-2">{gpaData.gpa}</p>
                                    <p className="font-semibold text-[#ED1E28] capitalize min-h-[1.5rem]">{gpaData.predicate}</p>
                                    <p className="text-sm text-gray-500 mt-1">{gpaData.totalSKS > 0 ? `Berdasarkan total ${gpaData.totalSKS} SKS` : 'Silakan isi mata kuliah'}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                         <button onClick={handleGetFeedback} disabled={loadingAI} className="ai-feedback-btn"><span className="btn-text">✨ Umpan Balik AI</span><span className="btn-loader"></span></button>
                                         <button onClick={() => setPlannerModal(prev => ({...prev, show: true, content: ''}))} className="ai-planner-btn">🚀 Jelajahi Potensi</button>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/60 rounded-3xl shadow-lg backdrop-blur-xl border border-white/80">
                                    <div className="flex border-b border-gray-200">
                                        {['Konversi Nilai', 'Predikat Lulus', 'Beban Studi'].map((tab, i) => (
                                            <button key={tab} onClick={() => setActiveTab(`tab-${i+1}`)} className={`py-2 px-4 text-sm font-semibold transition-all ${activeTab === `tab-${i+1}` ? 'text-[#B6252A] border-b-2 border-[#B6252A]' : 'text-gray-500'}`}>{tab}</button>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                         <div className={`${activeTab === 'tab-1' ? 'block' : 'hidden'}`}>
                                             <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">A</p><span>&gt; 85</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">AB</p><span>75-85</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">B</p><span>65-75</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">BC</p><span>60-65</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">C</p><span>50-60</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">D</p><span>40-50</span></div>
                                                 <div className="p-2 bg-gray-100 rounded-lg"><p className="font-bold">E</p><span>≤ 40</span></div>
                                             </div>
                                         </div>
                                          <div className={`${activeTab === 'tab-2' ? 'block' : 'hidden'}`}>
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">Sempurna</span><span>3.91 – 4.00</span></div>
                                                    <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">Dengan Pujian</span><span>3.51 – 3.90</span></div>
                                                    <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">Sangat Memuaskan</span><span>3.01 – 3.50</span></div>
                                                    <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">Memuaskan</span><span>2.76 – 3.00</span></div>
                                                </div>
                                          </div>
                                          <div className={`${activeTab === 'tab-3' ? 'block' : 'hidden'}`}>
                                             <div className="space-y-2 text-xs">
                                                <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">S1/D3</span><span>8/6 smt | 144/108 SKS</span></div>
                                                <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">S2</span><span>4 smt | 54-72 SKS</span></div>
                                                <div className="flex justify-between p-2 bg-gray-100 rounded-lg"><span className="font-medium">S3</span><span>6 smt | 90-108 SKS</span></div>
                                             </div>
                                          </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                    
                     <footer className="text-center py-8 text-sm text-gray-400">© 2025. Created with ❤️ by Rachdian</footer>
                </main>

                {/* Modals */}
                <Modal title="✨ Umpan Balik & Saran AI" show={feedbackModal.show} onClose={() => setFeedbackModal({show: false, content: ''})}>
                    {loadingAI && !feedbackModal.content && <div className="flex justify-center items-center p-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div></div>}
                    <div dangerouslySetInnerHTML={{ __html: feedbackModal.content }} />
                </Modal>
                <Modal title="🚀 Jelajahi Potensi Akademik" show={plannerModal.show} onClose={() => setPlannerModal({show: false, content: ''})}>
                     <div className={`${plannerModal.content ? 'hidden' : 'grid'} grid-cols-1 sm:grid-cols-2 gap-4`}>
                         <button onClick={() => handleGetPlanner('study')} className="planner-btn">Buat Rencana Belajar<span>Fokus pada perbaikan nilai</span></button>
                         <button onClick={() => handleGetPlanner('career')} className="planner-btn">Dapatkan Saran Karir<span>Berdasarkan kekuatan Anda</span></button>
                     </div>
                    {plannerModal.content === 'loading' && <div className="flex justify-center items-center p-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div></div>}
                    <div className={`${plannerModal.content === 'loading' ? 'hidden' : ''}`} dangerouslySetInnerHTML={{ __html: plannerModal.content }} />
                </Modal>

            </div>
        );
    }
