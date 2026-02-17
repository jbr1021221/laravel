# Admin Dashboard Setup Guide

## 🎯 Overview

Your admin dashboard is now in a **separate Git repository** from your main website. This allows you to:
- ✅ Update the main site without exposing admin files
- ✅ Pull admin dashboard on different devices independently
- ✅ Keep admin credentials and tracking separate
- ✅ Deploy main site and admin dashboard separately

---

## 📂 Repository Structure

### Main Website Repository
**Location**: `/home/jubayer/personal/laravel/`
**GitHub**: `https://github.com/jbr1021221/laravel.git`
**Contains**:
- `index.html` - Main website
- `script.js` - Main website JavaScript
- `styles.css` - Main website styles
- `firebase-config.js` - Visitor tracking (excluded from git)

**Excludes** (via .gitignore):
- All admin files (admin.html, admin-script.js, admin-styles.css)
- `threwbew-admin/` folder

### Admin Dashboard Repository
**Location**: `/home/jubayer/personal/laravel/threwbew-admin/`
**GitHub**: You need to create this repository
**Contains**:
- `admin.html` - Admin dashboard
- `admin-script.js` - Dashboard logic
- `admin-styles.css` - Dashboard styles
- `firebase-config.js` - Firebase config
- Documentation files

---

## 🚀 Setup Instructions

### Step 1: Create GitHub Repository for Admin Dashboard

1. Go to GitHub: https://github.com/new
2. Create a new **PRIVATE** repository named: `threwbew-admin`
3. **Do NOT** initialize with README (we already have one)
4. Click "Create repository"

### Step 2: Connect Local Admin Folder to GitHub

Run these commands in your terminal:

```bash
cd /home/jubayer/personal/laravel/threwbew-admin
git branch -M main
git remote add origin https://github.com/jbr1021221/threwbew-admin.git
git push -u origin main
```

### Step 3: Verify Setup

Check that both repositories are separate:

```bash
# Main website repo
cd /home/jubayer/personal/laravel
git remote -v
# Should show: https://github.com/jbr1021221/laravel.git

# Admin dashboard repo
cd /home/jubayer/personal/laravel/threwbew-admin
git remote -v
# Should show: https://github.com/jbr1021221/threwbew-admin.git
```

---

## 💻 Using on Multiple Devices

### On a New Device

#### Clone Main Website:
```bash
git clone https://github.com/jbr1021221/laravel.git
cd laravel
```

#### Clone Admin Dashboard (separately):
```bash
cd laravel
git clone https://github.com/jbr1021221/threwbew-admin.git
```

Now you have both repositories in the same parent folder!

### Updating Files

#### Update Main Website:
```bash
cd /home/jubayer/personal/laravel
git pull origin main
# Make changes to index.html, script.js, etc.
git add .
git commit -m "Update main website"
git push origin main
```

#### Update Admin Dashboard:
```bash
cd /home/jubayer/personal/laravel/threwbew-admin
git pull origin main
# Make changes to admin files
git add .
git commit -m "Update admin dashboard"
git push origin main
```

---

## 🌐 Deployment

### Main Website (threwbew.com)
Deploy from: `https://github.com/jbr1021221/laravel`
- GitHub Pages
- Netlify
- Vercel

**Important**: Admin files are excluded via .gitignore, so they won't be deployed!

### Admin Dashboard
Deploy from: `https://github.com/jbr1021221/threwbew-admin`
- Keep this deployment **private** or password-protected
- Use a different subdomain (e.g., `admin.threwbew.com`)
- Or access locally via `file://` protocol

---

## 🔐 Security Notes

1. **Keep admin repo PRIVATE** on GitHub
2. **Never commit** real Firebase credentials to public repos
3. **Change default password** after first login
4. **Use different domains** for main site and admin dashboard
5. Admin files are **automatically excluded** from main website deployments

---

## 📝 Quick Reference

### File Locations

```
/home/jubayer/personal/laravel/
├── .git/                          # Main website git
├── index.html                     # Main website
├── script.js                      # Main website JS
├── styles.css                     # Main website CSS
├── firebase-config.js             # Visitor tracking (gitignored)
├── threwbew-admin/                # Admin dashboard (gitignored)
│   ├── .git/                      # Admin dashboard git (separate!)
│   ├── admin.html                 # Admin dashboard
│   ├── admin-script.js            # Admin JS
│   ├── admin-styles.css           # Admin CSS
│   ├── firebase-config.js         # Firebase config
│   └── README.md                  # Admin docs
└── .gitignore                     # Excludes admin files
```

### Common Commands

```bash
# Update main site
cd /home/jubayer/personal/laravel
git pull && git add . && git commit -m "Update" && git push

# Update admin dashboard
cd /home/jubayer/personal/laravel/threwbew-admin
git pull && git add . && git commit -m "Update" && git push

# Check which repo you're in
git remote -v
```

---

## ✅ Benefits of This Setup

1. **Security**: Admin files never appear in public deployments
2. **Modularity**: Update each part independently
3. **Portability**: Pull admin dashboard on any device
4. **Clean Separation**: Main site and admin are completely separate
5. **Version Control**: Track changes to each separately

---

## 🆘 Troubleshooting

### "Admin files showing in main repo"
```bash
cd /home/jubayer/personal/laravel
git rm --cached admin.html admin-script.js admin-styles.css
git commit -m "Remove admin files from main repo"
git push
```

### "Can't push admin repo"
Make sure you created the GitHub repository and set the remote:
```bash
cd threwbew-admin
git remote add origin https://github.com/jbr1021221/threwbew-admin.git
git push -u origin main
```

### "Admin folder not showing"
The admin folder is gitignored in the main repo. This is intentional!
To see it: `ls -la` (it's there, just not tracked by git)

---

**Setup Complete!** 🎉

You now have a clean separation between your main website and admin dashboard!
