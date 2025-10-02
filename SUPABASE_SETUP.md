# Supabase Setup Guide - Fix Library & Image Generation

## Problem
The library is empty because:
1. Your Supabase schema has duplicate columns with wrong naming
2. No Storage bucket exists for images
3. Sessions can't be saved properly

## Solution - Follow These Steps:

### Step 1: Run the SQL Migration

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. Click on your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-migration.sql`
6. Click **Run** (or press Ctrl/Cmd + Enter)

✅ This will fix all duplicate columns and add performance indexes

### Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Settings:
   - **Name**: `uploads` (exactly this name)
   - **Public bucket**: ✅ YES (toggle ON)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave as `image/*` or add:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
4. Click **Create bucket**

### Step 3: Update Environment Variables on Railway

1. Go to Railway Dashboard: https://railway.app
2. Select your project
3. Go to **Variables** tab
4. Add these variables (if not already set):
   ```
   SUPABASE_URL=your-project-url-here
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   ```

To find these values:
- Go to Supabase Dashboard → Settings → API
- **SUPABASE_URL** = Project URL
- **SUPABASE_SERVICE_KEY** = service_role key (click "Reveal" to see it)

### Step 4: Deploy to Railway

After the above steps, push your code:

```bash
git add .
git commit -m "Fix Supabase schema and add migration"
git push origin main
```

Railway will automatically deploy.

### Step 5: Test It

1. Go to your deployed app
2. Log in or register
3. Go to Generator
4. Upload a product image
5. Select category and prompts
6. Click Generate
7. ✅ Images should appear in your Library!

## What This Fixes:

✅ Library will show generated images and sessions
✅ Images will be stored in Supabase Storage with public URLs
✅ Sessions will save correctly to database
✅ Public gallery will work
✅ No more 500 errors when saving sessions

## Troubleshooting

### If library is still empty after deployment:
1. Check Railway logs for Supabase connection errors
2. Verify environment variables are set correctly
3. Check Supabase Dashboard → Database → Tables to see if sessions are being saved

### If images fail to upload:
1. Verify the `uploads` bucket exists and is PUBLIC
2. Check Railway logs for upload errors
3. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set

### If you see "Failed to save session":
1. Check Railway logs for the specific error
2. Verify the schema was migrated correctly
3. Run the verification queries from the migration file
