# Pop Academy - Local Setup Guide

## 🚀 Running Locally on Your PC

This app works **fully offline-first** with a cloud-hosted database, so you can develop on your PC and it will work seamlessly!

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

### Installation Steps

1. **Clone/Open the project**
   ```bash
   cd pop-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will connect to the hosted Supabase database automatically

## 🔐 Authentication

### Creating Your First Admin Account

1. **Sign up for an account**
   - Go to `/auth` in the app
   - Create a new account with your email and password
   - Email confirmation is disabled for development, so you can log in immediately

2. **Make yourself an admin**
   - After signing up, you need to manually add admin role to your account
   - Go to the Lovable Cloud backend or run this SQL in the database:

   ```sql
   -- Replace YOUR_USER_ID with your actual user ID from the profiles table
   INSERT INTO user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```

   **OR** use the Lovable Cloud UI:
   - Click "View Backend" in Lovable
   - Go to Database → Tables → user_roles
   - Add a new row with your user_id and role='admin'

3. **Access Admin Dashboard**
   - After adding the admin role, navigate to `/admin`
   - You now have full CRUD access to manage:
     - Videos
     - Lesson Plans
     - Daily Practice Problems (DPP)
     - Games

## 🎮 Features Working Locally

### ✅ Fully Functional
- **Authentication**: Sign up, log in, log out
- **3 Interactive Games**:
  - Memory Match Game
  - Math Speed Challenge
  - Pattern Memory Game
- **PDF Viewer**: View, print, and download lesson plans and DPPs
- **Video Player**: Embedded YouTube/Vimeo videos with full controls
- **Admin Dashboard**: Complete CRUD operations for all resources
- **Course Browsing**: View all courses and their details
- **Progress Tracking**: Games save scores to database

### 🎯 How It Works

#### Database Connection
- Uses **Supabase** (Lovable Cloud) hosted database
- Connection details are in `.env` (auto-generated)
- Works from localhost automatically - no VPN or special setup needed
- All data syncs in real-time

#### File Structure
```
src/
├── pages/
│   ├── Auth.tsx              # Login & Signup
│   ├── AdminDashboard.tsx    # Admin panel
│   ├── GamePlay.tsx          # Game player
│   ├── Resources.tsx         # PDF/Video viewer
│   └── CourseDetail.tsx      # Course info
├── components/
│   ├── admin/
│   │   ├── VideoManager.tsx      # CRUD for videos
│   │   ├── LessonPlanManager.tsx # CRUD for lesson plans
│   │   ├── DPPManager.tsx        # CRUD for DPPs
│   │   └── GameManager.tsx       # CRUD for games
│   ├── games/
│   │   ├── MemoryGame.tsx
│   │   ├── MathSpeedGame.tsx
│   │   └── PatternMatchGame.tsx
│   ├── PDFViewer.tsx         # PDF display
│   └── VideoPlayer.tsx       # Video display
└── integrations/supabase/
    └── client.ts             # Auto-configured DB client
```

## 📝 Admin Operations

### Adding Videos
1. Go to `/admin` → Videos tab
2. Click "Add Video"
3. Fill in:
   - Course (select from dropdown)
   - Title
   - YouTube/Vimeo URL
   - Optional: Thumbnail, description, duration
4. Save - video appears immediately on course pages

### Adding Lesson Plans
1. Go to `/admin` → Lesson Plans tab
2. Click "Add Lesson Plan"
3. Fill in:
   - Course
   - Title
   - PDF URL (can be Google Drive, Scribd, etc.)
   - Week/Day numbers
4. Save - accessible in course resources

### Adding Daily Practice Problems (DPP)
1. Go to `/admin` → DPP tab
2. Click "Add DPP"
3. Fill in:
   - Course
   - Title
   - PDF URL
   - Difficulty (easy/medium/hard)
   - Day number
4. Save - students can access immediately

### Adding Games
1. Go to `/admin` → Games tab
2. Click "Add Game"
3. Select:
   - Game type (Memory Match, Math Speed, Pattern Match)
   - Difficulty level
   - Associated course
4. Game configuration is handled automatically

## 🎨 Games Included

### 1. Memory Match Game
- Classic card-matching memory game
- Tracks moves, time, and matches
- Scoring based on speed and accuracy
- Fully playable, saves high scores

### 2. Math Speed Challenge
- 60-second rapid-fire math problems
- Three difficulty levels (easy/medium/hard)
- Streak bonuses for consecutive correct answers
- Real-time scoring

### 3. Pattern Memory Game
- Watch and recreate color patterns
- Increasing difficulty with each level
- Tests visual memory and recall
- Progressive challenge system

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Admin role required for content management
- User authentication required for personal data
- Public read access for course content
- Secure password requirements (min 6 characters)

## 📊 Database Schema

### Key Tables
- `profiles` - User information
- `user_roles` - Role management (admin/student)
- `videos` - Video library
- `lesson_plans` - Lesson plan documents
- `daily_practice_problems` - Practice problem sets
- `games` - Game configurations
- `game_scores` - Player scores and progress
- `course_enrollments` - Student course enrollments
- `exercise_completions` - Exercise tracking

## 🛠️ Development Tips

### Hot Reload
- Changes to React components reload automatically
- Database schema changes require migration approval
- New routes need to be added to `App.tsx`

### Adding New Games
1. Create game component in `src/components/games/`
2. Add to `GamePlay.tsx` tabs
3. Implement scoring callback
4. Scores auto-save to database

### Debugging
- Check browser console for errors
- Database errors show in toast notifications
- Use Lovable Cloud backend viewer for data inspection

## 📱 Mobile Responsive
All features work on mobile devices:
- Touch controls for games
- Responsive PDF viewer
- Mobile-optimized navigation
- Adaptive layouts

## 🚢 Deployment
When ready to deploy:
1. Click "Publish" button in Lovable
2. Your app goes live immediately
3. No additional configuration needed
4. Database works in production automatically

## ❓ Troubleshooting

**Can't log in?**
- Check email/password are correct
- Email confirmation is disabled in dev
- Check browser console for errors

**Admin panel not accessible?**
- Verify you added admin role to user_roles table
- Log out and log back in
- Check database connection

**Games not loading?**
- Clear browser cache
- Check browser console for errors
- Ensure JavaScript is enabled

**PDFs not displaying?**
- Check PDF URL is publicly accessible
- Some sites block iframe embedding
- Try using Google Drive or Scribd links

## 🎯 Next Steps

1. **Create your admin account** and add admin role
2. **Add some content** - videos, lesson plans, DPPs
3. **Test the games** - play through each one
4. **Customize styling** - edit index.css for your brand
5. **Add more features** - the architecture is ready for expansion!

---

**Need Help?** Check the Lovable documentation or reach out in the community Discord!
