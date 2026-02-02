# Laravel Admin Dashboard - Installation Guide

## 📁 Files Created

All Laravel files have been created in the `laravel-admin/` directory:

```
laravel-admin/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/
│   │   │   └── VisitorAnalyticsController.php
│   │   └── Api/
│   │       └── VisitorTrackingController.php
│   └── Models/
│       └── Visitor.php
├── database/migrations/
│   └── 2026_02_02_000001_create_visitors_table.php
├── resources/views/admin/analytics/
│   ├── index.blade.php
│   └── partials/
│       ├── overview.blade.php
│       ├── visitors.blade.php
│       └── analytics.blade.php
├── routes/
│   ├── web.php
│   └── api.php
└── public/
    ├── css/
    │   └── admin-styles.css
    └── js/
        ├── admin-dashboard.js
        └── visitor-tracking.js
```

---

## 🚀 Installation Steps

### Step 1: Create a New Laravel Project

```bash
# Navigate to where you want your Laravel project
cd /home/jubayer/personal

# Create new Laravel project
composer create-project laravel/laravel visitor-analytics

cd visitor-analytics
```

### Step 2: Copy the Files

```bash
# Copy all files from laravel-admin/ to your Laravel project
cp -r /home/jubayer/personal/laravel/laravel-admin/* /home/jubayer/personal/visitor-analytics/

# Or if you're in the laravel directory:
cd /home/jubayer/personal/laravel
cp -r laravel-admin/* ../visitor-analytics/
```

### Step 3: Configure Database

Edit `.env` file in your Laravel project:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=visitor_analytics
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Create the database:

```bash
mysql -u root -p
CREATE DATABASE visitor_analytics;
EXIT;
```

### Step 4: Install Laravel Breeze (Authentication)

```bash
composer require laravel/breeze --dev

php artisan breeze:install blade

npm install
npm run dev
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

### Step 6: Create Admin User

```bash
php artisan tinker
```

In Tinker:
```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@example.com';
$user->password = bcrypt('your-secure-password');
$user->save();
exit
```

### Step 7: Start Development Server

```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## 🔧 Integration with Your Existing Site

### Update Your HTML Site to Track Visitors

Add this to your `index.html` (or any page you want to track):

```html
<!-- Add before closing </body> tag -->
<script src="http://localhost:8000/js/visitor-tracking.js"></script>
```

**For production:**
```html
<script src="https://yourdomain.com/js/visitor-tracking.js"></script>
```

---

## 🎯 Accessing the Dashboard

1. **Login**: Visit `http://localhost:8000/login`
2. **Email**: `admin@example.com`
3. **Password**: (the password you set)
4. **Dashboard**: Visit `http://localhost:8000/admin/analytics`

---

## 📊 API Endpoints

### Public Endpoints (No Auth Required)

- `POST /api/track-visitor` - Track a new visitor
- `GET /api/visitor-stats` - Get public stats

### Admin Endpoints (Auth Required)

- `GET /admin/analytics` - Dashboard view
- `GET /admin/analytics/stats` - Overview statistics
- `GET /admin/analytics/visitors` - All visitors
- `GET /admin/analytics/locations` - Top locations
- `GET /admin/analytics/charts` - Chart data
- `GET /admin/analytics/isps` - ISP data
- `GET /admin/analytics/export` - Export CSV

---

## 🔐 Security Features

✅ **Server-side Authentication** - Laravel's built-in auth system
✅ **CSRF Protection** - Automatic token validation
✅ **SQL Injection Protection** - Eloquent ORM
✅ **Rate Limiting** - 60 requests/minute for tracking
✅ **Password Hashing** - Bcrypt encryption
✅ **Session Management** - Secure sessions
✅ **Middleware Protection** - Auth middleware on admin routes

---

## 🎨 Customization

### Change Colors

Edit `public/css/admin-styles.css`:

```css
:root {
    --primary: #6366f1;  /* Change to your brand color */
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
}
```

### Add More Analytics

Edit `app/Http/Controllers/Admin/VisitorAnalyticsController.php` to add custom analytics methods.

---

## 📱 Deployment

### Production Checklist

```bash
# 1. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 2. Build assets
npm run build

# 3. Set environment
# Edit .env:
APP_ENV=production
APP_DEBUG=false

# 4. Set up proper database
# 5. Configure web server (Nginx/Apache)
# 6. Set up SSL certificate
# 7. Configure CORS if needed
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/visitor-analytics/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 🧪 Testing

### Test Visitor Tracking

```bash
# Send a test visitor
curl -X POST http://localhost:8000/api/track-visitor \
  -H "Content-Type: application/json" \
  -d '{
    "ip_address": "192.168.1.1",
    "country": "Bangladesh",
    "city": "Dhaka",
    "device_type": "Desktop",
    "browser": "Chrome",
    "os": "Windows"
  }'
```

### Test Admin Access

1. Visit `http://localhost:8000/admin/analytics`
2. Should redirect to login if not authenticated
3. After login, should show dashboard

---

## 🔄 Updating

### Database Changes

If you need to modify the visitors table:

```bash
php artisan make:migration add_column_to_visitors_table
php artisan migrate
```

### Adding New Features

1. Add controller methods
2. Add routes
3. Update Blade views
4. Update JavaScript

---

## 📞 Troubleshooting

### Issue: "Class not found"
```bash
composer dump-autoload
```

### Issue: "Route not found"
```bash
php artisan route:clear
php artisan route:cache
```

### Issue: "View not found"
```bash
php artisan view:clear
```

### Issue: "CSRF token mismatch"
- Clear browser cookies
- Check if CSRF meta tag is in Blade template
- Verify CSRF token is being sent with requests

### Issue: "Database connection failed"
- Check `.env` database credentials
- Ensure database exists
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

---

## ✅ Quick Start Commands

```bash
# Full setup from scratch
composer create-project laravel/laravel visitor-analytics
cd visitor-analytics
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install && npm run dev
php artisan migrate
php artisan serve

# Then copy the files from laravel-admin/ directory
# Create admin user with tinker
# Access at http://localhost:8000/admin/analytics
```

---

**Your Laravel admin dashboard is ready to deploy!** 🎉

All files are in the `laravel-admin/` directory. Just follow the installation steps above to integrate them into a Laravel project.
