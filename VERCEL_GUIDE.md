# 🎯 Panduan Deploy ke Vercel - Step by Step

## ✅ Yang Sudah Disetup
1. ✅ `vercel.json` - Konfigurasi deployment
2. ✅ `package.json` di root - Build scripts
3. ✅ `.gitignore` - File yang tidak di-track
4. ✅ Environment variables setup
5. ✅ API URL dinamis (dev/production)
6. ✅ Sudah di-push ke GitHub

---

## 🚀 Cara Deploy - PILIH SALAH SATU

### ⭐ OPSI 1: Frontend Only ke Vercel (PALING MUDAH & RECOMMENDED)

#### Step 1: Deploy Backend ke Railway
1. Buka https://railway.app
2. Login dengan GitHub
3. Klik "New Project" → "Deploy from GitHub repo"
4. Pilih repository **LostItem-Tracker**
5. Pilih **backend** folder
6. Di Settings → Variables, tambahkan:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lost-found-db
   JWT_SECRET=rahasia_jwt_kamu_yang_panjang_dan_aman
   PORT=5000
   NODE_ENV=production
   ```
7. Deploy! Simpan URL backend, contoh: `https://lostitem-tracker-production.up.railway.app`

#### Step 2: Deploy Frontend ke Vercel
1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New..." → "Project"
4. Import repository **LostItem-Tracker**
5. Configure project:
   - **Root Directory**: `frontend` ← PENTING!
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (otomatis)
   - **Output Directory**: `build` (otomatis)
6. Environment Variables:
   ```
   REACT_APP_API_URL=https://lostitem-tracker-production.up.railway.app/api
   ```
   (Ganti dengan URL Railway kamu dari Step 1)
7. Klik "Deploy"
8. Tunggu 2-3 menit, DONE! 🎉

---

### OPSI 2: Full Stack di Vercel (Backend + Frontend)

⚠️ **Catatan**: Upload file tidak persistent di Vercel serverless. Untuk production gunakan Cloudinary/S3.

#### Step 1: Setup MongoDB Atlas
1. Buka https://www.mongodb.com/cloud/atlas
2. Buat akun → Create Free Cluster (M0)
3. Database Access → Add User (username & password)
4. Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string

#### Step 2: Deploy ke Vercel
1. Login ke https://vercel.com
2. Import repository **LostItem-Tracker**
3. Configure:
   - **Root Directory**: `./` (kosongkan / default)
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
4. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lost-found-db
   JWT_SECRET=your_super_secret_key_min_32_characters_long
   PORT=5000
   NODE_ENV=production
   REACT_APP_API_URL=/api
   ```
5. Deploy!

---

## 🔧 Troubleshooting

### ❌ Vercel Error: "No Build Output Found"
**Solusi:**
- Pastikan Root Directory: `frontend` (untuk opsi 1)
- atau Build Command: `cd frontend && npm install && npm run build` (untuk opsi 2)

### ❌ Error: "Failed to load items"
**Penyebab**: Backend belum deploy atau API URL salah

**Solusi:**
1. Cek backend sudah jalan (buka URL backend di browser, harus muncul: `{"message": "Lost & Found API is running"}`)
2. Cek Environment Variable `REACT_APP_API_URL` di Vercel → harus sama dengan URL backend

### ❌ MongoDB Connection Error
**Solusi:**
1. Pastikan MongoDB Atlas IP Whitelist: `0.0.0.0/0`
2. Check format connection string: `mongodb+srv://...`
3. Pastikan username & password benar

### ❌ Repo tidak muncul di Vercel
**Solusi:**
1. Refresh halaman import
2. Atau: Vercel Dashboard → Settings → Git Integration → Reconnect GitHub
3. Atau: Install Vercel app di GitHub repository settings

### ❌ Frontend jalan tapi tidak bisa register/login
**Penyebab**: CORS atau backend belum deploy

**Solusi:**
1. Pastikan backend sudah jalan
2. Check CORS sudah diaktifkan di `backend/server.js` (sudah ✅)
3. Test backend: `curl https://backend-url.com/api`

---

## 📋 Checklist Sebelum Deploy

### Untuk Railway + Vercel (Opsi 1):
- [ ] MongoDB Atlas cluster sudah dibuat
- [ ] Backend sudah deploy di Railway
- [ ] Environment variables di Railway sudah diisi
- [ ] Backend URL sudah dicopy
- [ ] Frontend environment variable `REACT_APP_API_URL` sudah diset
- [ ] Root Directory di Vercel = `frontend`

### Untuk Full Vercel (Opsi 2):
- [ ] MongoDB Atlas cluster sudah dibuat
- [ ] IP Whitelist: 0.0.0.0/0
- [ ] Connection string sudah dicopy
- [ ] Semua environment variables sudah diisi di Vercel
- [ ] Root Directory = `./` (default)
- [ ] Build command correct

---

## 🎉 Setelah Deploy Berhasil

1. **Test Aplikasi**:
   - Buka URL Vercel
   - Coba register user baru
   - Coba login
   - Coba add report
   - Coba upload gambar

2. **Setup Admin**:
   - Connect ke MongoDB dengan MongoDB Compass
   - Update collection `users`, set `role: "admin"` untuk user pertama

3. **Custom Domain** (Opsional):
   - Vercel Dashboard → Settings → Domains
   - Add domain kamu

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:
1. Check logs di Vercel/Railway
2. Test backend manual: `curl https://backend-url/api`
3. Check browser console (F12) untuk error messages

---

**Good luck! 🚀**
