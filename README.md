# LostItem-Tracker

### Lost & Found Web Application

| No  | Nama                   | NRP        |
| --- | ---------------------- | ---------- |
| 1   | Kanafira Vanesha Putri | 5027241010 |

## 📖 Overview
Aplikasi web untuk mengelola barang hilang dan ditemukan. Pengguna dapat melaporkan barang yang hilang atau ditemukan, dengan sistem verifikasi admin.

## 🛠️ Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih baru)
- MongoDB (local atau Atlas)
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone https://github.com/shenaavv/LostItem-Tracker.git
cd LostItem-Tracker
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Setup environment variables

**Backend** - Buat file `.env` di folder `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-found-db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Frontend** - Buat file `.env.local` di folder `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Jalankan aplikasi
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

5. Buka browser ke `http://localhost:3000`

## 📁 Struktur Project
```
LostItem-Tracker/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth & upload middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/        # Axios config
│       ├── components/ # React components
│       ├── context/    # Auth context
│       └── pages/      # Page components
└── README.md
```

## 🌐 Deploy ke Production
Lihat panduan lengkap di [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy:
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: MongoDB Atlas

## 👤 User Roles
- **User**: Dapat melaporkan dan melihat barang
- **Admin**: Dapat memverifikasi dan mengelola semua laporan

## 📝 Features
✅ Register & Login dengan JWT  
✅ Report barang hilang/ditemukan  
✅ Upload foto barang  
✅ Search & filter items  
✅ Admin panel untuk verifikasi  
✅ Status tracking (Open, Verified, Returned)  
✅ Unique ticket number untuk setiap laporan  

## 📄 License
MIT

## 👨‍💻 Author
Kanafira Vanesha Putri - 5027241010