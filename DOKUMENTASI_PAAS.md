# ☁️ Laporan & Panduan Presentasi Arsitektur Platform as a Service (PaaS)
> **Proyek CRUD:** RTS Web Application (Next.js + PostgreSQL + Object Storage)  
> **Peran:** DevOps / Cloud Engineer  
> **Tanggal:** 5 Agustus 2026  

---

## 📌 1. Profil Proyek CRUD

- **Nama Aplikasi:** RTS Web Application
- **Deskripsi:** Aplikasi Full-Stack web yang menyediakan layanan CRUD (Create, Read, Update, Delete) untuk Manajemen Portfolio, Tracking System, dan Pengelolaan Media/Gambar.
- **Tech Stack Utama:**
  - **Frontend & Backend API:** Next.js 16 (React 19, TypeScript, App Router)
  - **Database ORM:** Prisma ORM
  - **Database Engine:** PostgreSQL
  - **File Storage:** Object Storage Service (Supabase Storage / S3 Compatible)

---

## 💬 2. Skenario Diskusi DevOps Engineer & AI Cloud Architect

Berikut adalah simulasi diskusi strategis antara seorang **DevOps Engineer** dan **AI Cloud Architect** dalam menentukan arsitektur PaaS terbaik untuk proyek ini:

```
[DevOps Engineer]: "Kami memiliki aplikasi web CRUD berbasis Next.js dengan Prisma ORM yang memerlukan database SQL dan penyimpanan file upload. Kami ingin menggunakan pendekatan PaaS (Platform as a Service) yang terpisah agar setiap layer scalable, mudah dimaintain, dan tidak perlu pusing mengurus infrastruktur VM (IaaS)."

[AI Cloud Architect]: "Pilihan yang sangat bijak. Dengan membagi arsitektur ke dalam 3 PaaS terpisah (App, Database, dan File Storage), Anda mendapatkan decoupling (pemisahan dependensi) yang baik. Jika traffic aplikasi melonjak, aplikasi frontend/backend bisa di-scale terpisah tanpa membebani server storage atau database."

[DevOps Engineer]: "Bagaimana kita membagi 3 kategori PaaS ini secara optimal?"

[AI Cloud Architect]: "Rekomendasi arsitektur PaaS terpisah untuk RTS Web Application:
1. App PaaS (Frontend & Backend): Vercel (atau Cloud Run / Render) — Menjalankan Next.js Serverless & Edge API Routes.
2. Database PaaS (SQL): Supabase Managed PostgreSQL (atau Neon DB) — Menyediakan PostgreSQL terkelola dengan Connection Pooling & Auto Backup.
3. Storage File PaaS: Supabase Storage (atau Cloudinary / AWS S3 PaaS) — Menyediakan Bucket Storage terkelola dengan CDN bawaan untuk gambar & aset."

[DevOps Engineer]: "Mengapa kita memilih PaaS daripada mendirikan VM sendiri (IaaS seperti AWS EC2 / DigitalOcean Droplet)?"

[AI Cloud Architect]: "Dengan PaaS:
- Zero Infrastructure Maintenance: Tidak perlu update OS, install Docker engine manual, atau setup SSL certificate manual.
- Automated CI/CD: Setiap kali `git push`, build & deployment berjalan otomatis.
- High Availability & Security: PaaS sudah menangani DDoS protection, auto-failover, dan backup secara built-in."
```

---

## 🏗️ 3. Pembagian Arsitektur PaaS Terpisah

```mermaid
architecture-beta
    group user_group(internet)[Client / Browser]
    service client(internet)[User Client] in user_group

    group app_paas(cloud)[PaaS App Layer - Vercel / Render]
    service nextjs(server)[Next.js App Router (SSR & API)] in app_paas

    group db_paas(database)[PaaS Database Layer - Supabase / Neon]
    service postgres(database)[Managed PostgreSQL + Prisma] in db_paas

    group storage_paas(disk)[PaaS Storage Layer - Supabase Storage]
    service bucket(disk)[Object Storage Bucket + CDN] in storage_paas

    client -- logic --> nextjs
    nextjs -- SQL via Connection Pool --> postgres
    nextjs -- REST/SDK Upload Media --> bucket
```

---

### 💻 A. PaaS untuk App (Frontend & Backend)
* **Layanan Utama:** **Vercel** (Alternatif: Render / Google Cloud Run)
* **Peran:** Menjalankan aplikasi Next.js (Rendering UI Frontend React 19, Server-Side Rendering / SSR, dan API Backend Routes / Server Actions).
* **Fitur Utama & Alasan Pemilihan DevOps:**
  1. **Native Next.js Support:** Vercel secara otomatis mengoptimalkan Next.js ke dalam bentuk *Serverless Functions* dan *Global Edge CDN*.
  2. **Automated CI/CD:** Terintegrasi langsung dengan GitHub. Setiap `git push` ke branch `main` langsung men-deploy versi production.
  3. **Zero Server Management:** Bebas dari tugas OS patching, Nginx reverse proxy configuration, dan renewal SSL/TLS certificate.
  4. **Environment Variable Security:** Manajemen rahasia (environment variables) terpusat dan terenkripsi untuk staging & production.

---

### 🗄️ B. PaaS untuk Database (SQL)
* **Layanan Utama:** **Supabase Managed PostgreSQL** (Alternatif: Neon / Railway Postgres)
* **Peran:** Menyimpan data terstruktur (User, Portfolio, Data Tracking, Metadata) menggunakan relational database PostgreSQL.
* **Fitur Utama & Alasan Pemilihan DevOps:**
  1. **Fully Managed PostgreSQL:** Database dikelola penuh oleh penyedia PaaS (tidak perlu instalasi PostgreSQL manual di VM).
  2. **Built-in Connection Pooling (Supavisor / pgBouncer):** Mencegah error *"Too many connections"* ketika Next.js Serverless meluncurkan banyak instance secara bersamaan.
  3. **Automated Backup & Disaster Recovery:** Backup harian otomatis dengan kemampuan Point-in-Time Recovery (PITR).
  4. **Kompatibilitas Prisma ORM:** Sangat cepat diintegrasikan melalui Prisma Client & Prisma Migration CLI (`npx prisma migrate dev`).

---

### 📁 C. PaaS untuk Storage File
* **Layanan Utama:** **Supabase Storage** (Alternatif: Cloudinary / AWS S3 Object Storage)
* **Peran:** Menyimpan berkas gambar, media portofolio, avatar, dan file dokumen yang diunggah pengguna.
* **Fitur Utama & Alasan Pemilihan DevOps:**
  1. **Global Content Delivery Network (CDN):** Berkas media secara otomatis didistribusikan melalui CDN global sehingga waktu *loading* gambar sangat cepat di mana saja.
  2. **Row Level Security (RLS) & Bucket Policies:** Pengaturan hak akses granular (misal: gambar portofolio publik, berkas dokumen privat).
  3. **Image Optimization & Transformation:** Dapat mengubah ukuran (*resize*) dan mengompres format gambar secara otomatis on-the-fly.
  4. **Decoupled System:** Penyimpanan file tidak memenuhi ruang disk server aplikasi atau database SQL.

---

## 📊 4. Tabel Perbandingan & Rangkuman Kategori PaaS

| Kategori PaaS | Teknologi Proyek | Penyedia PaaS Terpilih | Fungsi Dalam Proyek | Keunggulan Utama |
| :--- | :--- | :--- | :--- | :--- |
| **App (Front & Back)** | Next.js 16 (TS) | **Vercel** | Hosting UI & API Route CRUD | Auto CI/CD, Serverless, Fast CDN |
| **Database (SQL)** | PostgreSQL + Prisma | **Supabase DB / Neon** | Penyimpanan Data Relasional | Managed DB, Connection Pooler, Auto Backup |
| **File Storage** | Blob / Media Files | **Supabase Storage** | Penyimpanan Upload Gambar & File | High Availability, Built-in CDN, RLS Access Control |

---

## 🎤 5. Panduan & Script Presentasi untuk Besok

Saat menjelaskan di depan penguji / dosen / tim besok, gunakan alur presentasi berikut:

### 1. Pembuka (Opening) - 30 Detik
> *"Selamat pagi/siang bapak/ibu dan rekan-rekan. Hari ini saya berperan sebagai DevOps Cloud Engineer untuk mempresentasikan arsitektur berbasis **Platform as a Service (PaaS)** pada proyek web **RTS Application** — sebuah aplikasi CRUD berbasis Next.js dan PostgreSQL."*

### 2. Penjelasan 3 Pilar PaaS - 1.5 Menit
> *"Dalam proyek ini, kami membagi arsitektur sistem ke dalam **3 Kategori PaaS Terpisah** agar sistem modular, aman, dan mudah di-scale:*
> 1. **PaaS Aplikasi (Frontend & Backend):** Kami menggunakan **Vercel**. Vercel menangani hosting Next.js secara Serverless. Setiap kali developer melakukan `git push`, CI/CD Vercel akan otomatis melakukan build dan deploy tanpa mematikan aplikasi (Zero Downtime).
> 2. **PaaS Database (SQL):** Kami menggunakan **Supabase Managed PostgreSQL**. Dibandingkan membuat database di VM sendiri yang berisiko terhapus atau kehabisan memori, PaaS Database menangani backup otomatis, security patching, dan ketersediaan *Connection Pooling* untuk Prisma ORM.
> 3. **PaaS File Storage:** Kami menggunakan **Supabase Storage**. Berkas gambar dan upload pengguna dipisahkan dari database SQL dan server aplikasi. Dengan CDN terintegrasi, akses gambar menjadi sangat cepat dan tidak membebani kapasitas disk server utama."*

### 3. Keunggulan Arsitektur Ini (DevOps Perspective) - 1 Menit
> *"Sebagai DevOps Engineer, alasan utama memilih arsitektur PaaS terpisah ini adalah:*
> - **Skalabilitas Independent:** Jika lalu lintas pengunjung tinggi, Vercel men-scale fungsi API secara otomatis tanpa mengganggu database.
> - **Efisiensi Waktu & Biaya:** Tim developer fokus pada koding fitur CRUD, sementara perawatan infrastruktur, SSL, dan backup 100% ditangani oleh provider PaaS.
> - **Security & Reliability:** Setiap komponen terisolasi dengan akses kredensial yang ketat via Environment Variables."*

---

## 💡 6. Potensi Pertanyaan Penguji & Cara Menjawabnya

> **Q: Mengapa tidak memakai IaaS seperti VPS / DigitalOcean / AWS EC2 saja lalu install semuanya di satu server (Monolit)?**  
> **A:** *"Menggunakan VPS tunggal (IaaS) berisiko tinggi menciptakan **Single Point of Failure (SPOF)**. Jika server VPS down atau disk penuh karena upload gambar, seluruh aplikasi dan database ikut mati. Selain itu, IaaS memerlukan waktu DevOps yang banyak untuk OS update, firewall configuration, dan manual backup. Dengan PaaS terpisah, ketersediaan (availability) jauh lebih tinggi dan pemeliharaannya jauh lebih efisien."*

> **Q: Bagaimana keamanan antar PaaS ini terhubung?**  
> **A:** *"Koneksi antara App PaaS (Vercel) ke Database PaaS dan Storage PaaS menggunakan koneksi terenkripsi HTTPS/TLS serta string koneksi database yang dilindungi oleh Environment Variable rahasia (Secret Key). Akses storage juga dilindungi oleh policy hak akses Bucket."*

---
*Dokumentasi ini disiapkan untuk tugas PaaS & Diskusi DevOps Engineer.*
