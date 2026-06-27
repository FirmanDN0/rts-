# **Website Requirement — RTS Smart Pricing System**

## **Konsep Sistem Pricing**

Website RTS memiliki fitur utama berupa **konsultasi harga otomatis berbasis kebutuhan client**.

Sistem akan membaca input client kemudian melakukan kalkulasi berdasarkan:

* Kebutuhan layanan  
* Kompleksitas project  
* Durasi pengerjaan  
* Jumlah output  
* Equipment yang digunakan  
* Kebutuhan tenaga kerja  
* Lokasi pengerjaan

Output akhir:

**Estimasi Harga Project (Range Harga)**

Contoh:

Estimasi project:  
Rp 5.000.000 \- Rp 8.000.000

Dengan catatan:

Harga dapat berubah berdasarkan diskusi final bersama RTS.

---

# **Struktur Form Konsultasi**

Form konsultasi dibagi menjadi 2 kategori utama:

1. CP (Creative Production)  
2. CA (Content Asset)

---

# **FORM CP (Creative Production)**

CP digunakan untuk layanan produksi seperti:

* Videographer  
* Photographer  
* Editor

Pada awal form:

User memilih kebutuhan:

### **Pilihan:**

○ Videographer  
○ Photographer  
○ Editor

Tujuannya agar input form menyesuaikan kebutuhan.

Contoh:

Videographer:

* Bisa memilih lokasi  
* Bisa memilih alat  
* Bisa memilih crew

Editor:

* Tidak perlu lokasi  
* Tidak perlu akomodasi

---

# **Alur Form CP**

## **1\. Pilih Jenis Produksi**

User memilih:

Contoh:

* Company Profile  
* Commercial Video  
* Social Media Content  
* Dokumentasi Event  
* Film  
* Project lainnya

---

# **2\. Equipment / Fixed Cost**

Equipment tidak ditampilkan sebagai "sewa alat".

Karena tujuan RTS bukan menjadi penyedia rental.

Maka UI menggunakan konsep:

## **"Production Package"**

Contoh:

### **Basic Production Package**

Isi:

* Kamera entry level  
* Basic lighting  
* Basic audio

### **Professional Production Package**

Isi:

* Kamera profesional  
* Drone  
* Gimbal  
* Lighting

### **Custom Equipment**

User dapat memilih manual:

☑ Kamera Sony A6400  
☑ Drone DJI  
☑ Gimbal  
☑ Mic Professional

Setiap alat memiliki nilai cost internal.

Sistem menghitung berdasarkan:

Harga alat per jam × durasi pengerjaan

Data Fixed Cost berasal dari:

* Kamera  
* Drone  
* Mic  
* Gimbal  
* Lighting  
* Tripod  
* Laptop

yang sudah memiliki harga per jam penggunaan.

---

# **3\. Development Fee System (Project Complexity)**

Bagian ini menentukan tingkat kesulitan project.

User mengisi:

## **Durasi pengerjaan**

Contoh:

\< 12 jam  
12 \- 24 jam

24 jam

## **Jumlah Output**

Contoh:

1 output

2 output

2 output

## **Durasi Output**

Contoh:

1-2 menit

2-3 menit

3 menit

## **Kompleksitas Konsep**

Pilihan:

* Simple/informatif  
* Storyline \+ visual planning  
* Konsep naratif \+ riset

## **Kebutuhan Crew**

* 1-2 orang  
* 3-4 orang  
* 4 orang

## **Tingkat Teknis**

Jumlah alat:

* 1-3 alat  
* 3-4 alat  
* 4 alat

## **Lokasi**

* 1 lokasi  
* Beberapa lokasi

## **Deadline**

* 14 hari  
* 7-14 hari  
* \<7 hari

## **Jumlah Person**

* 1-20  
* 20-50  
* 50

Semua pilihan menghasilkan:

## **Score Project**

Contoh:

Score:  
10

Maka masuk:

Kategori:  
**Project Ringan**

Berdasarkan cost structure:

* 8-12 \= Ringan  
* 13-18 \= Menengah  
* 19-24 \= Besar

---

# **Perhitungan Development Fee**

Sistem:

Score × harga kategori

Contoh:

Project Ringan:

Score:  
10

Harga dasar:  
Rp 2.000

Development:

10 × 2000

\= Rp20.000

Kategori besar memiliki multiplier berbeda.

---

# **4\. Profit Adjustment (Bulatan)**

Setelah total sementara:

Sistem menambahkan keuntungan berdasarkan kategori.

Contoh:

Project Ringan:

\+10%

Project Menengah:

\+15%

Project Besar:

\+30%

---

# **5\. Labor Cost**

User dapat memilih tambahan tenaga kerja.

Contoh:

Butuh:

☑ Photographer  
☑ Editor  
☑ Animator  
☑ Talent  
☑ Drone Pilot

Sistem membaca:

Kategori project:

Ringan / Menengah / Besar

Lalu mengambil harga labor.

Contoh:

Fotografer:

Project ringan:

Rp18.000

Project menengah:

Rp48.000

Project besar:

Rp108.000

Harga sudah termasuk tambahan 20%.

---

# **6\. Variable Cost (Akomodasi)**

Input lokasi:

Pilihan:

○ Sidoarjo

○ Luar Sidoarjo

Sistem menambahkan:

Sidoarjo:

Rp11.000

Luar Sidoarjo:

Rp30.000

---

# **FORM CA (Content Asset)**

CA digunakan untuk kebutuhan asset digital.

Contoh:

* Design  
* Poster  
* Konten sosial media  
* Asset visual

Input:

Jenis kebutuhan:

Contoh:

* Social media content  
* Poster  
* Branding asset  
* Dokumentasi digital

Jumlah kebutuhan:

Contoh:

5 desain

10 desain

Sistem mengambil harga dari:

Content Asset Price

Kemudian menghitung:

Jumlah asset × harga asset

---

# **AI Pricing Engine**

Sistem menggunakan AI untuk membantu membaca kebutuhan client.

Flow:

User Input

↓

AI membaca kebutuhan

↓

Mengambil data pricing database

↓

Menghitung:

* Fixed Cost  
* Development Fee  
* Labor Cost  
* Variable Cost  
* Asset Cost

↓

Menghasilkan:

Estimasi Harga

---

# **Output Akhir User**

Contoh:

## **Project Summary**

Jenis:  
Company Profile

Kategori:  
Project Menengah

Estimasi:

Rp7.500.000 \- Rp10.000.000

Button:

**Negosiasi Dengan RTS**

---

# **WhatsApp Auto Message**

Ketika klik:

Pesan otomatis:

Halo RTS, saya ingin konsultasi project.

Jenis layanan:  
Videographer

Project:  
Company Profile

Kategori:  
Menengah

Estimasi:  
Rp7.500.000 \- Rp10.000.000

---

# **Database yang Dibutuhkan Developer**

## **Table Service**

Menyimpan:

* Jenis layanan

## **Table Equipment**

Menyimpan:

* Nama alat  
* Harga per jam

## **Table Development Score**

Menyimpan:

* Parameter  
* Score  
* Kategori

## **Table Labor**

Menyimpan:

* Jabatan  
* Harga ringan  
* Harga menengah  
* Harga besar

## **Table Consultation**

Menyimpan:

* Data client  
* Input form  
* Hasil kalkulasi  
* Status

