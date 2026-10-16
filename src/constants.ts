import { Counselor, PeerSupporter } from './types';

export const COUNSELORS: Counselor[] = [
  { id: '1', name: "Entin Ratiningsih, S.Pd", position: "Wakasek Kesiswaan" },
  { id: '2', name: "Faqih Maulidi, M.Pd", position: "Staf Kesiswaan" },
  { id: '3', name: "Riastuty Nuswo Utami, S.Pd., M.Pd", position: "Koordinator BK" },
  { id: '4', name: "Apriani Anggraini Harhap, S.Pd", position: "Guru BK" },
  { id: '5', name: "Asep Nugraha, S.Pd", position: "Guru BK" },
];

export const PEER_SUPPORTERS: PeerSupporter[] = [
  { id: 'Abdul', name: 'Abdul Azis Fathin Rabbani', email: 'kemangsukatani7@gmail.com' },
  { id: 'Zahra', name: 'Zahra Mauli Ramadhani', email: 'kemangsukatani7@gmail.com' },
  { id: 'Raghat', name: 'Raghat Sakinah', email: 'kemangsukatani7@gmail.com' },
];

export interface BotTopic {
  category: string;
  label: string;
  keywords: string[];
  response: string;
}

export const BOT_RESPONSES: BotTopic[] = [
  {
    category: "Bullying / Perundungan",
    label: "Bullying & Ejekan",
    keywords: [
      "bully", "bullying", "perundungan", "dibully", "diejek", "ejek", "dipalak", "palak",
      "diancam", "ancam", "ancaman", "dihina", "hina", "dipukul", "dijahili", "diteror", "labrak"
    ],
    response: "Halo, terima kasih sudah berani menceritakan hal ini. Diperlakukan tidak menyenangkan, diejek, dipalak, atau menjadi korban bullying adalah hal yang sangat serius dan tidak boleh dibiarkan. Ingat, kamu tidak bersalah dan kamu berhak merasa aman di sekolah. Segera sampaikan hal ini ke Bapak/Ibu Guru BK atau Kesiswaan agar kamu mendapatkan perlindungan penuh. Kamu bisa memulai obrolan langsung melalui menu Konsultasi Pribadi."
  },
  {
    category: "Takut ke Sekolah",
    label: "Takut Masuk Sekolah",
    keywords: [
      "takut ke sekolah", "takut masuk", "gamau sekolah", "nggak mau sekolah", "takut di sekolah", "takut ketemu", "enggan sekolah", "bolos"
    ],
    response: "Aku mengerti perasaanmu. Sekolah seharusnya menjadi tempat yang aman dan nyaman untuk belajar dan berteman. Rasa takut ini merupakan sinyal bahwa ada masalah yang perlu ditangani bersama. Yuk, bicarakan hal ini bersama Bapak/Ibu Guru BK agar mereka bisa membantumu mencari jalan keluar dan kembali merasa tenang."
  },
  {
    category: "Circle Pertemanan & Pengucilan",
    label: "Circle Pertemanan",
    keywords: [
      "circle", "pertemanan", "gak punya teman", "tidak punya teman", "sendirian", "dikucilkan",
      "dijauhi", "dijauhin", "gak diajak main", "ditinggal teman", "musuhan", "kesepian", "teman sekelas", "teman"
    ],
    response: "Menghadapi masalah pertemanan atau merasa terasing dari circle pertemanan memang sangat menguras perasaan. Tapi jangan berkecil hati, kamu sangat berharga dan tidak sendirian. Guru BK memiliki banyak cara untuk membantumu merasa lebih nyaman berbaur dan mencari solusi terkait dinamika pertemanan di sekolah. Kamu bisa curhat privat di menu Konsultasi Pribadi ya."
  },
  {
    category: "Rasa Malu & Sulit Bergaul",
    label: "Malu & Minder",
    keywords: [
      "malu", "pendiam", "susah ngobrol", "susah bergaul", "minder", "insecure", "gak percaya diri", "tidak percaya diri", "canggung"
    ],
    response: "Memulai obrolan atau merasa canggung saat bersosialisasi itu wajar dan sering dialami banyak orang. Kamu tidak perlu memaksakan diri menjadi orang lain. Guru BK siap membantumu melatih rasa percaya diri dan kenyamanan saat berkomunikasi secara santai dan bertahap."
  },
  {
    category: "Masalah Keluarga & Rumah",
    label: "Masalah di Rumah/Keluarga",
    keywords: [
      "keluarga", "masalah di rumah", "rumah", "orang tua", "orangtua", "broken home", "ayah", "ibu",
      "papa", "mama", "bertengkar", "dimarahi", "ribut di rumah", "masalah keluarga"
    ],
    response: "Aku sangat menghargai ceritamu. Beban atau masalah di lingkungan rumah memang seringkali terbawa sampai ke pikiran saat beraktivitas di sekolah. Bapak/Ibu Guru BK siap mendengarkan tanpa menghakimi. Yuk, cari waktu untuk berbagi dengan Guru BK melalui menu Konsultasi Pribadi agar hatimu lebih lega dan mendapatkan arahan yang menenangkan."
  },
  {
    category: "Akademik & Nilai",
    label: "Nilai & Remedial",
    keywords: [
      "nilai jelek", "takut remedial", "remedial", "ujian", "tugas menumpuk", "nilai turun", "sulit belajar", "kesulitan belajar", "pelajaran"
    ],
    response: "Wajar jika kamu merasa cemas atau terbebani dengan hasil belajar. Ingat, nilai adalah sarana evaluasi proses, bukan penentu harga dirimu. Kamu bisa berkonsultasi dengan Guru BK untuk menyusun strategi belajar yang efektif dan mengelola stres menghadapi pelajaran atau ujian."
  },
  {
    category: "Malas, Jenuh & Hilang Fokus",
    label: "Malas & Hilang Motivasi",
    keywords: [
      "malas", "gak fokus", "tidak fokus", "bosan", "jenuh", "hilang motivasi", "mager", "capek belajar", "lelah belajar"
    ],
    response: "Setiap orang pasti pernah berada di titik jenuh atau kehilangan fokus belajar. Jangan menyalahkan dirimu secara berlebihan. Cobalah istirahat sejenak, lalu diskusikan dengan Guru BK untuk menemukan kembali ritme dan motivasi belajarmu di sekolah."
  },
  {
    category: "Masalah Pribadi & Emosi",
    label: "Sedih & Overthinking",
    keywords: [
      "sedih", "nangis", "menangis", "overthinking", "pikiran kacau", "galau", "hampa", "tertekan",
      "patah hati", "kecewa", "putus asa", "masalah pribadi", "curhat pribadi"
    ],
    response: "Aku di sini untuk mendengarkanmu. Merasa sedih, menangis, atau overthinking adalah hal yang sangat manusiawi. Jangan pendam semuanya sendirian hingga menjadi beban berat. Bapak/Ibu Guru BK siap menjadi pendamping yang aman dan terpercaya melalui menu Konsultasi Pribadi."
  },
  {
    category: "Marah, Kesal & Emosi",
    label: "Marah & Kesal",
    keywords: [
      "marah", "kesal", "emosi", "benci", "dendam", "jengkel", "ngamuk", "emosional"
    ],
    response: "Menahan emosi atau amarah sendirian memang sangat melelahkan dan menguras energi. Cobalah tarik napas perlahan untuk meredakan ketegangan. Jika kamu ingin melampiaskan dan mencari solusi tanpa risiko, ruang BK adalah tempat yang aman untuk berdiskusi."
  },
  {
    category: "Trauma & Tekanan Berat",
    label: "Trauma & Tekanan Batin",
    keywords: [
      "trauma", "depresi", "gak kuat", "tidak kuat", "capek hidup", "menyerah", "putus harapan", "cemas parah"
    ],
    response: "Kamu luar biasa sudah bertahan sampai sejauh ini melewati masa-masa sulit. Beban berat ini tidak harus kamu pikul seorang diri. Mohon segera temui Bapak/Ibu Guru BK di sekolah atau buka menu Konsultasi Pribadi agar kamu segera mendapatkan pendampingan psikologis khusus yang aman."
  },
  {
    category: "Sapaan & Ramah Tamah",
    label: "Sapaan",
    keywords: [
      "halo", "hai", "hello", "hi", "assalamualaikum", "selamat pagi", "selamat siang",
      "selamat sore", "selamat malam", "pagi", "siang", "sore", "malam", "tes", "test", "permisi", "bot"
    ],
    response: "Halo! Aku Curhat Bot, teman bicara virtualmu di SIMPHONY. Ada hal yang sedang mengganjal atau ingin kamu ceritakan hari ini? Kamu bisa menceritakan masalah seputar Bullying, Circle Pertemanan, Masalah Keluarga, Pelajaran, atau Masalah Pribadi. Aku siap mendengarkan dan menghubungkanmu dengan arahan Guru BK."
  },
  {
    category: "Layanan BK",
    label: "Layanan BK",
    keywords: [
      "bk", "guru bk", "konseling", "konsultasi", "ruang bk", "bimbingan konseling"
    ],
    response: "Layanan Bimbingan & Konseling (BK) di sekolah selalu siap membantu setiap siswa dengan prinsip kerahasiaan penuh. Kamu bisa memanfaatkan menu Konsultasi Pribadi untuk berkirim pesan langsung dengan Bapak/Ibu Guru BK, atau berkunjung langsung ke ruang BK sekolah."
  }
];

export const GENERAL_BOT_RESPONSES = [
  "Terima kasih sudah berbagi bebanmu di sini. Aku siap jadi tempat ceritamu, tapi untuk solusi yang lebih mendalam, jangan ragu untuk menemui guru BK ya.",
  "Setiap masalah pasti ada jalan keluarnya. Langkah awal yang baik adalah bercerita. Langkah selanjutnya, yuk sampaikan ke pihak sekolah (BK/Kesiswaan) agar dibantu sampai tuntas.",
  "Aku menangkap perasaanmu yang sedang tidak baik-baik saja. Jangan sungkan untuk mencari dukungan dari guru BK yang selalu ada untuk mendukung perkembanganmu.",
  "Ceritamu aman di sini. Namun, karena aku hanya bot, alangkah baiknya jika kamu juga bicara dengan guru BK agar ada tindakan nyata yang membantu masalahmu."
];

export const UNCLEAR_BOT_MESSAGE = `Maaf, Bot tidak memahami dengan jelas maksud dari tulisanmu.

Agar Bot bisa memahami dan merespons ceritamu dengan baik, pastikan kamu menceritakan permasalahan menggunakan kata kunci yang jelas, misalnya seputar:

• Bullying / Perundungan: dibully, diejek, dipalak, diancam, takut ke sekolah
• Circle Pertemanan: gak punya teman, sendirian, dikucilkan, dijauhi, minder
• Masalah Keluarga: masalah di rumah, orang tua, broken home
• Masalah Pribadi & Emosi: sedih, menangis, overthinking, marah, stres, cemas
• Akademik & Belajar: malas, gak fokus, nilai jelek, takut remedial

Jika permasalahanmu sulit diungkapkan kepada Bot atau memerlukan penanganan khusus, kamu sangat disarankan untuk langsung berkonsultasi dengan Bapak/Ibu Guru BK melalui menu Konsultasi Pribadi atau menemui Guru BK di sekolah agar mendapatkan pendampingan yang tepat dan terpercaya.`;

export const QUICK_KEYWORD_CHIPS = [
  { label: "🛡️ Bullying / Diejek", keyword: "Saya dibully dan diejek di sekolah" },
  { label: "👥 Circle Pertemanan", keyword: "Merasa sendirian dan dijauhi teman circle" },
  { label: "🏠 Masalah di Rumah", keyword: "Sedang ada masalah di rumah dengan keluarga" },
  { label: "❤️ Sedih & Overthinking", keyword: "Merasa sedih dan overthinking terus" },
  { label: "📚 Belajar & Nilai", keyword: "Gak fokus belajar dan nilai jelek" },
];

export const POSITIVE_RESONANCE = [
  "Setiap langkah kecil adalah kemenangan besar.",
  "Kamu lebih kuat dari apa yang kamu pikirkan.",
  "Hari ini adalah awal baru yang indah.",
  "Kehadiranmu sangat berharga bagi dunia ini.",
  "Tidak apa-apa untuk tidak merasa baik-baik saja hari ini.",
  "Bernapaslah, kamu sedang melakukan yang terbaik.",
  "Perubahan besar dimulai dari keberanian untuk bercerita.",
  "Kamu berhak mendapatkan kebahagiaan dan kedamaian."
];
