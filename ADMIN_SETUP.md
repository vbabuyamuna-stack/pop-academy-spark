# 🔐 Admin Setup Guide

## Quick Start: Make Yourself an Admin

After creating your account, run this SQL query to become an admin:

### Step 1: Find Your User ID

1. Sign up at `/auth` with your email
2. Click "View Backend" button below
3. Go to **Database** → **Tables** → **profiles**
4. Find your profile and copy your `id` (it looks like: `abc123-def4-56gh-789i-jklmno012345`)

### Step 2: Add Admin Role

1. In Lovable Cloud Backend, go to **Database** → **SQL Editor**
2. Paste this query (replace `YOUR_USER_ID` with your actual ID):

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

3. Click **Run**
4. Log out and log back in
5. Navigate to `/admin` - you now have full access!

---

## Alternative Method: Using the Tables UI

1. Click "View Backend" below
2. Go to **Database** → **Tables** → **user_roles**
3. Click **"Insert row"**
4. Fill in:
   - `user_id`: Your user ID from profiles table
   - `role`: Select **"admin"** from dropdown
5. Click **Save**
6. Log out and log back in
7. Go to `/admin`

---

## Admin Features

Once you're an admin, you can:

### 📹 Video Management
- Add YouTube/Vimeo/Direct video links
- Organize by course
- Set categories (lesson, tutorial, demo, exercise)
- Add thumbnails and duration

### 📄 Lesson Plan Management  
- Upload PDF lesson plans
- Organize by week and day
- Link to courses
- Add descriptions

### 📝 Daily Practice Problems (DPP)
- Create practice problem sets
- Set difficulty levels (easy/medium/hard)
- Add PDF links
- Track by day number

### 🎮 Game Management
- Configure game types (Memory Match, Math Speed, Pattern Match)
- Set difficulty levels
- Associate with courses
- View high scores

---

## Sample Data Included

The app now has **sample data** pre-loaded:
- 6 sample videos across courses
- 7 lesson plans
- 5 DPPs
- 6 games

You can edit or delete these to add your own content!

---

## Troubleshooting

### "You do not have admin access"
- Make sure you added the admin role correctly
- Log out and log back in
- Check that the user_id matches your profile id

### Can't see the data
- Click "View Backend" to verify your admin role was added
- Check the `user_roles` table for your entry
- Make sure RLS policies are enabled (they are by default)

### Admin panel shows empty
- Sample data should appear automatically
- If not, check the database tables in backend
- Try refreshing the page

---

## Security Notes

⚠️ **Important**: Admin role grants full CRUD access to:
- All videos, lesson plans, DPPs, and games
- Student data and analytics
- Course content

Only give admin role to trusted users!

---

## Next Steps

1. **Add yourself as admin** using steps above
2. **Explore the admin panel** at `/admin`
3. **Customize sample data** or add new content
4. **Create courses** with full resources
5. **Monitor student progress** (coming soon)

---

## Quick Links

- Admin Dashboard: `/admin`
- Backend Database: Click button below
- Documentation: Check SETUP.md for full details

<lov-presentation-actions>
<lov-presentation-open-backend>View Backend to Add Admin Role</lov-presentation-open-backend>
</lov-presentation-actions>

---

**Need help?** All features are fully functional and working. Just add your admin role and start managing content!
