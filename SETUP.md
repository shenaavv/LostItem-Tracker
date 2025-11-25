# Instructions for Running the Lost & Found Application

## Quick Start Guide

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using system MongoDB
sudo systemctl start mongod

# Or if using MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 2: Start Backend Server
```bash
cd backend
npm install
npm run dev
```

The backend will be available at http://localhost:5000

### Step 3: Start Frontend Application
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

The frontend will open automatically at http://localhost:3000

### Step 4: Create Admin User (Optional)

1. First, register a user through the app interface
2. Then connect to MongoDB:
```bash
mongosh
use lost-found-db
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

3. Logout and login again to access admin features

## Testing the Application

1. **Register** a new account
2. **Login** with your credentials
3. **Add a Report** - Create a lost or found item
4. **Browse Items** - View all reports on the dashboard
5. **View Details** - Click on an item to see full information
6. **Edit/Delete** - Manage your own reports
7. **Admin Panel** - If admin, access the admin panel to manage all reports

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify .env file configuration

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS settings
- Clear browser cache

### Image upload issues
- Ensure uploads directory exists in backend folder
- Check file size (max 5MB)
- Verify multer configuration

## Environment Variables

Backend `.env` file should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-found-db
JWT_SECRET=your_secret_key_here
```

## Default Credentials (For Testing)

After registering your first user, you can promote it to admin using the MongoDB commands above.

## Development Notes

- Backend uses nodemon for auto-restart
- Frontend uses React development server with hot reload
- Images are stored locally in backend/uploads/
- JWT tokens expire in 7 days
