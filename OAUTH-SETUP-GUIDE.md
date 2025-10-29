# 🔐 OAuth Setup Guide - Google & Facebook Login

## 🎯 Overview

Hệ thống đã được cấu hình để hỗ trợ đăng nhập bằng:
- ✅ Email/Password (Credentials)
- ✅ Google OAuth
- ✅ Facebook OAuth

---

## 📋 Prerequisites

Bạn cần tạo OAuth apps trên:
1. Google Cloud Console
2. Facebook Developers

---

## 🔧 Setup Instructions

### 1. Google OAuth Setup

#### Bước 1: Tạo Google OAuth App
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Application type**: Web application
6. Điền thông tin:
   - **Name**: `Your App Name`
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google
     ```
7. Click **Create**
8. Copy **Client ID** và **Client Secret**

#### Bước 2: Thêm vào .env
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### 2. Facebook OAuth Setup

#### Bước 1: Tạo Facebook App
1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Chọn **Consumer** → **Next**
4. Điền thông tin:
   - **App name**: `Your App Name`
   - **App contact email**: your@email.com
5. Click **Create App**

#### Bước 2: Cấu hình Facebook Login
1. Trong dashboard, chọn **Add Product**
2. Tìm **Facebook Login** → Click **Set Up**
3. Chọn **Web**
4. Nhập **Site URL**:
   ```
   http://localhost:3000
   ```
5. Vào **Facebook Login** → **Settings**
6. Thêm **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://yourdomain.com/api/auth/callback/facebook
   ```
7. Save changes

#### Bước 3: Lấy App ID và Secret
1. Vào **Settings** → **Basic**
2. Copy **App ID** và **App Secret**

#### Bước 4: Thêm vào .env
```env
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

---

## 📝 Complete .env Configuration

Thêm các dòng sau vào file `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 🧪 Testing

### Test Google Login:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/login`
3. Click **Google** button
4. Login with Google account
5. Should redirect back to app

### Test Facebook Login:
1. Visit: `http://localhost:3000/login`
2. Click **Facebook** button
3. Login with Facebook account
4. Should redirect back to app

---

## 🔒 Security Notes

### Production Checklist:
- [ ] Update redirect URIs với production domain
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Review OAuth app permissions
- [ ] Set up proper error handling
- [ ] Configure rate limiting

### Environment Variables:
- ❌ **NEVER** commit `.env` files to git
- ✅ Use `.env.local` for local development
- ✅ Use environment variables in production (Vercel, Railway, etc.)

---

## 🎨 UI Features

### Login Page:
```
┌─────────────────────────────────────┐
│           Đăng nhập                 │
├─────────────────────────────────────┤
│ Email: [________________]           │
│ Password: [________________]        │
│ [Đăng nhập]                         │
├─────────────────────────────────────┤
│     Hoặc đăng nhập với              │
├─────────────────────────────────────┤
│  [🔵 Google]  [🔵 Facebook]        │
├─────────────────────────────────────┤
│ Chưa có tài khoản? Đăng ký ngay    │
└─────────────────────────────────────┘
```

### Features:
- ✅ Email/Password login
- ✅ Google OAuth button
- ✅ Facebook OAuth button
- ✅ Loading states
- ✅ Error handling
- ✅ Redirect to callback URL
- ✅ Link to register page

---

## 🔄 User Flow

### New OAuth User:
1. User clicks Google/Facebook button
2. Redirects to OAuth provider
3. User authorizes app
4. Redirects back to app
5. **NextAuth creates user in database**
6. **Sets default role: USER**
7. User logged in ✅

### Existing OAuth User:
1. User clicks Google/Facebook button
2. Redirects to OAuth provider
3. User authorizes app
4. Redirects back to app
5. **NextAuth finds existing user**
6. User logged in ✅

---

## 🗄️ Database Schema

OAuth users are stored in `User` table:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // NULL for OAuth users
  role          Role      @default(USER)
  
  // NextAuth tables
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // "google" or "facebook"
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

---

## 🛠️ Troubleshooting

### Error: "Redirect URI mismatch"
**Solution:** Check OAuth app settings, ensure redirect URI matches exactly:
```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/facebook
```

### Error: "Invalid client"
**Solution:** Check `GOOGLE_CLIENT_ID` and `FACEBOOK_CLIENT_ID` in `.env`

### Error: "Invalid client secret"
**Solution:** Check `GOOGLE_CLIENT_SECRET` and `FACEBOOK_CLIENT_SECRET` in `.env`

### OAuth button not working
**Solution:** 
1. Check console for errors
2. Verify environment variables are loaded
3. Restart dev server after changing `.env`

### User created but no role
**Solution:** Check `signIn` callback in `auth-options.ts` - should set default role to `USER`

---

## 📊 Admin User Management

### Access:
```
URL: http://localhost:3000/admin/users-management
Auth: Requires ADMIN role
```

### Features:
- ✅ View all users (OAuth + Credentials)
- ✅ Filter by role
- ✅ Search by name/email
- ✅ Edit user role
- ✅ Activate/Deactivate users
- ✅ Delete users
- ✅ View login history

### User Table:
```
┌────────────────────────────────────────────────────┐
│ Name       │ Email          │ Role  │ Provider    │
├────────────────────────────────────────────────────┤
│ John Doe   │ john@gmail.com │ USER  │ Google      │
│ Jane Smith │ jane@fb.com    │ USER  │ Facebook    │
│ Admin User │ admin@site.com │ ADMIN │ Credentials │
└────────────────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. ✅ Configure Google OAuth
2. ✅ Configure Facebook OAuth
3. ✅ Test login flows
4. ✅ Test user creation
5. ✅ Test admin user management
6. ✅ Deploy to production
7. ✅ Update OAuth redirect URIs for production

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [Facebook OAuth Setup](https://next-auth.js.org/providers/facebook)
- [Prisma Adapter](https://next-auth.js.org/adapters/prisma)

---

**Created:** 2025-10-29
**Status:** ✅ Ready to Configure
**Version:** 1.0.0

🎊 **OAuth Login System Complete!** 🎊
