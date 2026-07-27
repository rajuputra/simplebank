# Frontend Development Guidelines (Vue 3 + Vite)

## 1. Tech Stack

- **Framework:** Vue.js 3 (Composition API menggunakan `<script setup>`).
- **Build Tool:** Vite.
- **Bahasa:** TypeScript (Strict Mode).
- **HTTP Client:** Axios.
- **State Management:** Pinia (jika diperlukan untuk menyimpan data sesi/user).

## 2. Struktur Direktori

Semua kodingan harus ditempatkan sesuai struktur berikut:

- `src/api/` -> Tempat semua fungsi pemanggilan API (Axios). Jangan mencampur logika API di dalam komponen UI.
- `src/types/` -> Tempat deklarasi antarmuka (Interfaces) TypeScript. Semua _request_ dan _response_ dari Swagger harus dibuatkan _interface_-nya di sini.
- `src/views/` -> Komponen halaman utama (Pages).
- `src/components/` -> Komponen UI yang bisa digunakan ulang (Reusable Components).

## 3. Aturan Penulisan Kode (Coding Conventions)

- **Tipe Data:** Wajib menggunakan _strict typing_. Jangan menggunakan tipe `any` kecuali sangat terpaksa.
- **Penamaan Variabel:** Gunakan _camelCase_ untuk variabel dan fungsi, serta _PascalCase_ untuk nama komponen dan antarmuka (_Interface_).
- **Error Handling:** Tangkap semua _error_ dari API menggunakan `try-catch`. Tampilkan pesan _error_ (seperti 400 Bad Request atau 401 Unauthorized) dengan rapi ke pengguna, bukan hanya di _console.log_.
- **Token Management:** Jika API mengembalikan `accessToken`, simpan dengan aman dan gunakan Axios Interceptor untuk menyisipkan token tersebut di _header_ `Authorization: Bearer <token>` pada setiap _request_ selanjutnya.

## 4. Referensi API

Aplikasi ini berinteraksi dengan "Simple Bank API". Selalu rujuk ke dokumen Swagger/OpenAPI yang diberikan untuk mengetahui tipe data dan _endpoint_ yang tepat.
