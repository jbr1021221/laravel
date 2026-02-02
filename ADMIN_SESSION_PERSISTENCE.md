# Admin Session Persistence

## What Changed
Added session persistence to the admin dashboard so you don't need to log in again every time you reload the page.

## How It Works

### Session Storage
The system now uses `sessionStorage` to remember your login state:
- ✅ **Stays logged in** when you refresh the page
- ✅ **Stays logged in** when you navigate away and come back
- ✅ **Auto-logout** when you close the browser tab/window
- ✅ **Manual logout** still works with the logout button

### Technical Details

**On Login:**
```javascript
sessionStorage.setItem('adminLoggedIn', 'true');
```

**On Page Load:**
```javascript
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    // Skip login screen, show dashboard
    initializeFirebase();
}
```

**On Logout:**
```javascript
sessionStorage.removeItem('adminLoggedIn');
```

## Session vs Local Storage

### Why `sessionStorage` instead of `localStorage`?

| Feature | sessionStorage | localStorage |
|---------|---------------|--------------|
| **Persistence** | Until tab closes | Forever (until manually cleared) |
| **Security** | ✅ Better (auto-expires) | ⚠️ Less secure (stays forever) |
| **Use Case** | ✅ Login sessions | Settings, preferences |

**sessionStorage** is more secure for login sessions because:
- Automatically clears when you close the tab
- Prevents unauthorized access if you forget to logout
- Each tab has its own session (more secure)

## User Experience

### Before (Without Session Persistence)
```
1. Login to admin dashboard
2. View visitor data
3. Refresh page → 😞 Logged out, need to login again
```

### After (With Session Persistence)
```
1. Login to admin dashboard
2. View visitor data
3. Refresh page → ✅ Still logged in!
4. Close tab → Auto-logout
5. Reopen tab → Need to login (secure!)
```

## Security Features

✅ **Password still hashed** (SHA-256)
✅ **Session expires** when tab closes
✅ **Manual logout** clears session immediately
✅ **No password stored** in session (only login state)
✅ **Each tab independent** (can't hijack other tabs)

## Testing

1. **Login** to the admin dashboard
2. **Refresh** the page (F5 or Ctrl+R)
3. ✅ Should stay logged in
4. **Close the tab** completely
5. **Reopen** the admin page
6. ✅ Should show login screen (session expired)

## If You Want Longer Persistence

If you want to stay logged in even after closing the browser, you can change `sessionStorage` to `localStorage`:

**In admin-script.js, replace:**
```javascript
sessionStorage.setItem('adminLoggedIn', 'true');
sessionStorage.getItem('adminLoggedIn');
sessionStorage.removeItem('adminLoggedIn');
```

**With:**
```javascript
localStorage.setItem('adminLoggedIn', 'true');
localStorage.getItem('adminLoggedIn');
localStorage.removeItem('adminLoggedIn');
```

**⚠️ Note:** This is less secure as you'll stay logged in forever until you manually logout.

## Best Practices

✅ **Always logout** when using a shared computer
✅ **Close the tab** when done (auto-logout)
✅ **Don't share** your admin credentials
✅ **Use strong password** (change from default "admin123")

## Changing Default Password

To change your admin password:

1. Open browser console on admin page
2. Run this command with your new password:
```javascript
const newPassword = 'your-new-secure-password';
crypto.subtle.digest('SHA-256', new TextEncoder().encode(newPassword))
    .then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('adminPasswordHash', hashHex);
        console.log('Password updated! New hash:', hashHex);
    });
```

3. Your new password is now set!
