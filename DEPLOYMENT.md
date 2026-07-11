# 🚀 Free Deployment Guide for ማኅበረ ሥላሴ

Deploy your Member Management app for **FREE** with these steps.

---

## Option 1: Vercel + Neon (Recommended)

**You'll get:** `your-app-name.vercel.app` (free subdomain)

### Step 1: Create Free PostgreSQL Database

1. Go to **[neon.tech](https://neon.tech)**
2. Sign up with GitHub or email (FREE)
3. Click **"New Project"**
   - Name: `mahibere-silassie`
   - Region: Choose closest to your users
4. Once created, go to **Dashboard → Connection Details**
5. Copy the **Connection String** (starts with `postgresql://...`)

### Step 2: Push Code to GitHub

1. Create a GitHub account at [github.com](https://github.com) if you don't have one
2. Create a new repository:
   - Go to github.com → Click **"+"** → **"New repository"**
   - Name: `mahibere-silassie`
   - Keep it **Public** or **Private**
   - Click **"Create repository"**

3. In your terminal, run:
```bash
git init
git add .
git commit -m "Initial commit: Mahibere Silassie Member Management"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mahibere-silassie.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Sign up with your GitHub account (FREE)
3. Click **"Add New Project"**
4. Select your `mahibere-silassie` repository
5. **Configure Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     | Name | Value |
     |------|-------|
     | `DATABASE_URL` | `postgresql://...` (paste your Neon connection string) |
     | `JWT_SECRET` | `your-secret-key-here-make-it-long-and-random` |

6. Click **"Deploy"**
7. Wait 1-2 minutes... ✅ Done!

**Your app is now live at:** `https://mahibere-silassie.vercel.app`

### Step 4: Initialize Database

After deployment, visit these URLs in order:
1. `https://your-app.vercel.app/api/health` — Should show `{"ok":true}`
2. `https://your-app.vercel.app/api/seed` — (POST request) Seeds demo data

To seed via terminal:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```

---

## Option 2: Railway (All-in-One)

**You'll get:** `your-app.up.railway.app` (free subdomain)

Railway hosts BOTH your app AND database together.

1. Go to **[railway.app](https://railway.app)**
2. Sign up with GitHub (FREE, $5 credit/month)
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Select your repository
5. Railway auto-detects Next.js
6. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
7. Click on PostgreSQL → **"Variables"** → Copy `DATABASE_URL`
8. Click on your app → **"Variables"** → Add:
   - `DATABASE_URL` = (paste from step 7)
   - `JWT_SECRET` = `your-secret-key`
9. Deploy! 🚀

---

## Option 3: Render

**You'll get:** `your-app.onrender.com` (free subdomain)

1. Go to **[render.com](https://render.com)**
2. Sign up (FREE)
3. Create **PostgreSQL** database first:
   - New → PostgreSQL → Free tier
   - Copy **External Database URL**
4. Create **Web Service**:
   - New → Web Service → Connect GitHub repo
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `DATABASE_URL` = (your Render PostgreSQL URL)
     - `JWT_SECRET` = `your-secret-key`
5. Deploy!

⚠️ Note: Render free tier sleeps after 15 min of inactivity (cold start ~30 sec)

---

## 🌐 Custom Free Domain (Optional)

Want a domain like `mahiberesilassie.org`? Here are free options:

### Free Subdomains:
- **Vercel:** `yourname.vercel.app` ✅
- **Railway:** `yourname.up.railway.app` ✅
- **Render:** `yourname.onrender.com` ✅
- **Netlify:** `yourname.netlify.app` ✅

### Free Domain Names:
- **[Freenom](https://freenom.com):** Free `.tk`, `.ml`, `.ga`, `.cf` domains (1 year)
- **[is-a.dev](https://is-a.dev):** Free `yourname.is-a.dev` subdomain
- **[js.org](https://js.org):** Free `yourname.js.org` for JS projects

### Connect Custom Domain to Vercel:
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `mahiberesilassie.tk`)
3. Update DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

---

## 📱 After Deployment Checklist

- [ ] Visit your app URL
- [ ] Run `/api/seed` to create demo data
- [ ] Test login with `admin@mahiberesilassie.org` / `admin123`
- [ ] Register a new member
- [ ] Test the admin dashboard
- [ ] Test Amharic/English toggle

---

## 🔐 Security Notes

1. **Change default passwords** after deployment
2. **Use a strong JWT_SECRET** (generate one):
   ```bash
   openssl rand -base64 32
   ```
3. Keep your `DATABASE_URL` secret (never commit to git)

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel/Railway/Render logs
2. Verify environment variables are set
3. Make sure DATABASE_URL includes `?sslmode=require` for Neon

**Enjoy your free deployment! 🙏✝️**
