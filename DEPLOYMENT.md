# 🚀 Cara Deploy ke Vercel

## Persiapan

### 1. Setup MongoDB Atlas (Database Cloud)
Karena Vercel serverless, kamu perlu database cloud:

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Buat cluster gratis (Free Tier - M0)
3. Whitelist semua IP (0.0.0.0/0) untuk development
4. Copy MongoDB Connection String, contoh:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lost-found-db
   ```

### 2. Push ke GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

---

## Deploy ke Vercel

### Opsi 1: Deploy Full Stack di Vercel (Frontend + Backend)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan akun GitHub

2. **Import Project**
   - Klik "Add New Project"
   - Import repository `LostItem-Tracker`
   
3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: `./` (biarkan kosong)
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

4. **Environment Variables**
   Tambahkan di Vercel Dashboard:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lost-found-db
   JWT_SECRET=your_super_secret_jwt_key_change_this
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy!**
   Klik "Deploy" dan tunggu prosesnya selesai

---

### Opsi 2: Deploy Frontend Only (Recommended)

Karena backend butuh persistent storage untuk upload file, lebih baik:

#### A. Deploy Backend ke Railway/Render
1. **Railway.app** (Recommended):
   - Buka [railway.app](https://railway.app)
   - "Start a New Project" → Deploy from GitHub
   - Pilih folder `backend`
   - Tambahkan Environment Variables:
     ```
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

2. **Render.com**:
   - Buka [render.com](https://render.com)
   - "New Web Service"
   - Connect repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### B. Deploy Frontend ke Vercel
1. Import project ke Vercel
2. Root Directory: `frontend`
3. Framework Preset: **Create React App**
4. Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
5. Deploy!

---

## Update Setelah Deploy

### Update API URL di Frontend
Setelah backend deploy, update environment variable di Vercel:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

Redeploy frontend dari Vercel dashboard.

---

## Troubleshooting

### Error: "No build output found"
- Pastikan Root Directory: `frontend` (jika deploy frontend only)
- atau Build Command: `cd frontend && npm run build` (jika full stack)

### Error: "Module not found"
- Jalankan: `npm install` di local
- Push ulang ke GitHub
- Redeploy di Vercel

### Backend tidak bisa upload file
- Gunakan Railway/Render untuk backend
- Atau gunakan cloud storage (Cloudinary, AWS S3) untuk images

### Database connection error
- Pastikan MongoDB Atlas IP whitelist: `0.0.0.0/0`
- Check connection string format
- Test connection dengan MongoDB Compass

---

## Quick Commands

```bash
# Test build di local
cd frontend
npm run build

# Check jika build berhasil
ls -la build/

# Test production mode
cd ../backend
NODE_ENV=production node server.js
```

---

## Notes
- Vercel free tier cocok untuk frontend
- Railway/Render free tier cocok untuk backend dengan database
- MongoDB Atlas free tier (512MB) cukup untuk development
- Upload files di Vercel serverless tidak persistent, gunakan cloud storage untuk production
