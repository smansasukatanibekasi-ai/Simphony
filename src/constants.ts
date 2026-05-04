import { Counselor, PeerSupporter } from './types';

export const COUNSELORS: Counselor[] = [
  { id: '1', name: "Drs. Ma'mun Nawawi", position: "Wakasek Kesiswaan" },
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

export const BOT_RESPONSES = [
  {
    keywords: ["Diejek", "Dibully", "Dipalak"],
    response: "Halo, terima kasih sudah berani cerita. Aku paham banget kalau diperlakukan tidak menyenangkan itu rasanya berat dan tidak nyaman. Kamu tidak sendirian, yuk coba diskusikan ini lebih lanjut dengan Bapak/Ibu guru di ruang BK agar kamu merasa lebih aman di sekolah."
  },
  {
    keywords: ["Takut ke sekolah"],
    response: "Aku mengerti perasaanmu. Sekolah seharusnya jadi tempat yang aman buat belajar. Supaya masalah ini segera selesai, ada baiknya kita sampaikan kronologinya ke bagian Kesiswaan ya."
  },
  {
    keywords: ["Diancam"],
    response: "Waduh, aku ikut prihatin mendengarnya. Keamananmu adalah yang utama. Segera hubungi guru BK agar mereka bisa memberikan perlindungan dan bantuan yang kamu butuhkan."
  },
  {
    keywords: ["Gak punya teman", "Sendirian", "Dikucilkan"],
    response: "Terkadang memang sulit untuk merasa pas dalam sebuah kelompok atau 'circle' di kelas. Tapi ingat, kamu berharga. Coba yuk ngobrol santai dengan guru BK, beliau punya banyak cara untuk bantu kamu merasa lebih nyaman bersosialisasi."
  },
  {
    keywords: ["Malu", "Pendiam", "Susah ngobrol"],
    response: "Aku paham kalau memulai percakapan itu sering bikin deg-degan atau malu. Kamu tidak perlu memaksakan diri sendiri. Guru BK bisa bantu melatih rasa percayamu secara perlahan, lho."
  },
  {
    keywords: ["Gak diajak main"],
    response: "Rasanya pasti sedih ya kalau merasa ditinggalkan oleh teman-teman. Jangan dipendam sendiri, sampaikan hal ini ke BK agar mereka bisa bantu menciptakan suasana kelas yang lebih merangkul semua siswa."
  },
  {
    keywords: ["Masalah di rumah", "Orang tua", "Broken home"],
    response: "Aku sangat menghargai ceritamu. Masalah di rumah memang seringkali terbawa sampai ke pikiran saat di sekolah. Bapak/Ibu guru BK siap mendengarkan tanpa menghakimi, yuk cari waktu untuk berbagi dengan mereka."
  },
  {
    keywords: ["Gak semangat belajar karena rumah"],
    response: "Kelihatannya situasi di rumah sedang sangat menguras energimu ya. Supaya belajarmu tidak terganggu, silakan mampir ke ruang BK untuk mencari solusi bersama guru pembimbing."
  },
  {
    keywords: ["Malas", "Gak fokus", "Bosan"],
    response: "Setiap orang pasti pernah merasa di titik jenuh atau kehilangan fokus. Agar semangatmu kembali, coba konsultasikan dengan guru BK atau bagian Kurikulum untuk tips belajar yang lebih seru."
  },
  {
    keywords: ["Nilai jelek", "Takut remedial"],
    response: "Wajar kalau kamu merasa cemas dengan hasil belajarmu. Yuk, komunikasikan kesulitanmu ini ke guru mata pelajaran atau minta arahan dari BK supaya nilai-nilaimu bisa membaik."
  },
  {
    keywords: ["Sedih", "Nangis", "Overthinking"],
    response: "Aku di sini untuk mendengarkanmu. Merasa sedih atau lelah itu manusiawi kok. Supaya hatimu lebih plong, sangat disarankan untuk bicara langsung dengan konselor di sekolah (BK) yang lebih ahli menangani ini."
  },
  {
    keywords: ["Marah", "Kesal", "Emosi"],
    response: "Sepertinya kamu sedang sangat kesal ya? Menumpuk emosi sendirian itu melelahkan. Yuk, salurkan energimu lewat diskusi dengan guru BK agar kamu merasa lebih tenang."
  },
  {
    keywords: ["Trauma"],
    response: "Aku mengerti kalau kejadian masa lalu terkadang masih membekas dan bikin takut. Kamu hebat sudah bertahan sejauh ini. Mari kita bicara dengan guru BK untuk membantumu melangkah perlahan menuju pemulihan."
  }
];

export const GENERAL_BOT_RESPONSES = [
  "Terima kasih sudah berbagi bebanmu di sini. Aku siap jadi tempat ceritamu, tapi untuk solusi yang lebih mendalam, jangan ragu untuk menemui guru BK ya.",
  "Setiap masalah pasti ada jalan keluarnya. Langkah awal yang baik adalah bercerita. Langkah selanjutnya, yuk sampaikan ke pihak sekolah (BK/Kesiswaan) agar dibantu sampai tuntas.",
  "Aku menangkap perasaanmu yang sedang tidak baik-baik saja. Jangan sungkan untuk mencari dukungan dari guru BK yang selalu ada untuk mendukung perkembanganmu.",
  "Ceritamu aman di sini. Namun, karena aku hanya bot, alangkah baiknya jika kamu juga bicara dengan guru BK agar ada tindakan nyata yang membantu masalahmu.",
  "Kamu sudah sangat kuat dengan bertahan hingga titik ini. Mari luangkan waktu sebentar ke ruang BK, mereka adalah teman bicara yang sangat baik untuk siswa.",
  "Jangan biarkan masalahmu mengganggu keceriaanmu di sekolah. Kesiswaan dan BK ada di sini untuk membantumu, silakan hubungi mereka kapan saja.",
  "Ingat ya, curhat itu sehat! Setelah ini, pastikan kamu juga ngobrol dengan bapak/ibu guru di sekolah agar masalahmu mendapatkan penanganan yang paling tepat."
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
