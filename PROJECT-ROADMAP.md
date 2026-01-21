# 📋 Project Roadmap: คลังเก็บสื่อการสอน (Learn Space)

> ระบบคลังเก็บสื่อการสอนที่นำลิงก์จาก Netlify/Loveable มาแปะ พร้อมระบบนับจำนวนการเข้าใช้ และการจัดการโดย Admin

---

## 📊 สถานะปัจจุบัน

| Feature | สถานะ |
|---------|--------|
| Database Schema (Prisma + PostgreSQL) | ✅ เสร็จสิ้น |
| Authentication (NextAuth.js) | ✅ เสร็จสิ้น |
| UI Components (shadcn/ui + TailwindCSS) | ✅ เสร็จสิ้น |
| Media CRUD APIs | ✅ เสร็จสิ้น |
| Analytics (View/Play Count) | ✅ เสร็จสิ้น |
| Security (CSP, Headers) | ✅ เสร็จสิ้น |
| Admin Dashboard | ✅ เสร็จสิ้น |
| Media Approval System | ✅ เสร็จสิ้น |

---

## 🎯 Phase 1: Foundation & Core Features (เสร็จสิ้นแล้ว)

### 1.1 Database Setup
- [x] ออกแบบ Schema สำหรับ Media
- [x] สร้าง ViewEvent model สำหรับติดตามการใช้งาน
- [x] ตั้งค่า Prisma ORM
- [x] Migration ไป PostgreSQL (Supabase)

### 1.2 Authentication
- [x] ติดตั้ง NextAuth.js
- [x] สร้างระบบ Login/Logout
- [x] แยกสิทธิ์ Admin vs User

### 1.3 Media Management
- [x] API สำหรับ CRUD Media
- [x] ดึง Metadata อัตโนมัติจาก URL
- [x] ระบบหมวดหมู่ (Category)
- [x] ระบบแท็ก (Tags)

### 1.4 Frontend
- [x] หน้าแรกแสดงสื่อยอดนิยม
- [x] หน้าค้นหา
- [x] หน้าหมวดหมู่
- [x] หน้าเล่นสื่อ (iframe)
- [x] Responsive + Dark Mode

---

## 🚀 Phase 2: Analytics & Tracking (เสร็จสิ้นแล้ว)

### 2.1 View/Play Tracking
- [x] API `/api/track/view` สำหรับบันทึกการดู
- [x] IP Hashing เพื่อความเป็นส่วนตัว
- [x] Rate Limiting ป้องกัน spam
- [x] แยก viewCount และ playCount

### 2.2 Dashboard Analytics
- [x] แสดงจำนวน views/plays รวม
- [x] แสดงสื่อยอดนิยม
- [x] สถิติแบบ real-time

---

## 🔒 Phase 3: Admin-Only Content Management (เสร็จสิ้นแล้ว)

### 3.1 Admin Access Control
- [x] Middleware ป้องกันหน้า `/admin/*`
- [x] API Protection (admin only)
- [x] Session Validation

### 3.2 Media Approval System
- [x] สถานะ: PENDING, APPROVED, REJECTED
- [x] หน้าอนุมัติสื่อ `/admin/approve`
- [x] เฉพาะสื่อ APPROVED แสดงบนหน้าเว็บ

---

## 🎨 Phase 4: Enhancements (เสร็จสิ้นแล้ว ✅)

### 4.1 UX Improvements
- [x] **Search Suggestions**: แสดงคำแนะนำขณะพิมพ์ค้นหา (`/api/search/suggestions`)
- [x] **Infinite Scroll**: โหลดสื่อเพิ่มเมื่อ scroll (`InfiniteMediaGrid` component)
- [x] **Favorites**: ให้ผู้ใช้บันทึกสื่อที่ชอบ (localStorage, `useFavorites` hook)
- [x] **Recently Viewed**: แสดงสื่อที่เพิ่งดูล่าสุด (`useRecentlyViewed` hook)

### 4.2 Admin Features
- [x] **Bulk Actions**: เลือกหลายรายการแล้วอนุมัติ/ลบพร้อมกัน (`/api/admin/bulk`)
- [x] **Media Preview**: ดูตัวอย่างก่อนอนุมัติ (`MediaPreviewModal` component)
- [x] **Export Data**: ส่งออกสถิติเป็น CSV/JSON (`/api/admin/export`)
- [ ] **Scheduled Publishing**: ตั้งเวลาเผยแพร่สื่อ (ยังไม่ได้ทำ)

### 4.3 Analytics Enhancements
- [x] **Time-based Analytics**: สถิติรายวัน/สัปดาห์/เดือน (`/api/admin/analytics`)
- [x] **Category Analytics**: สถิติแยกตามหมวดหมู่
- [x] **Charts & Graphs**: กราฟแสดงแนวโน้มการใช้งาน (`SimpleBarChart`, `SimpleLineChart`)
- [ ] **Top Referrers**: ดูว่าผู้ใช้มาจากที่ไหน (ยังไม่ได้ทำ)

---

## 🔐 Phase 5: Security & Performance (แนะนำ)

### 5.1 Security Hardening
- [x] **Rate Limiting**: จำกัดจำนวน API calls ต่อ IP (5 requests/minute สำหรับ submit)
- [x] **CAPTCHA**: ป้องกัน bot ในหน้า submit (ใช้ Honeypot field)

### 5.2 Performance
- [x] **Image Optimization**: ใช้ Next.js Image component (MediaCard)
- [x] **Caching**: Cache static assets ผ่าน middleware (max-age=31536000)
- [x] **Lazy Loading**: Intersection Observer สำหรับรูปภาพ (LazyImage component)
- [ ] **CDN**: ใช้ CDN สำหรับ static assets (Supabase มี CDN ในตัวแล้ว)

---

## 🌐 Phase 6: Deployment & Production

### 6.1 Deployment Setup
- [ ] **Environment Variables**: ตั้งค่า production env
- [ ] **Database Migration**: Migrate ไป production DB
- [ ] **Domain Setup**: ตั้งค่า custom domain
- [ ] **SSL Certificate**: ใช้ HTTPS

### 6.2 Monitoring
- [ ] **Error Tracking**: ติดตั้ง Sentry หรือ similar
- [ ] **Uptime Monitoring**: ตรวจสอบ server status
- [ ] **Performance Monitoring**: ติดตาม page load time

---

## 💡 คำแนะนำเพิ่มเติม

### 1. รองรับหลาย Domain
ปัจจุบันรองรับ `loveable.dev` แนะนำเพิ่ม:
- `*.netlify.app`
- Custom domains ที่ปลอดภัย
- สร้าง UI สำหรับ Admin จัดการ whitelist

### 2. ระบบ Backup
- ตั้งค่า automatic backup สำหรับ database
- Export/Import ข้อมูลสื่อ

### 3. Multi-Admin Support
- เพิ่ม User model ใน database
- ระบบจัดการผู้ดูแลหลายคน
- Role-based access control (Super Admin, Editor)

### 4. Content Organization
- **Playlists/Collections**: รวมสื่อเป็นชุด
- **Subject Mapping**: เชื่อมโยงกับหลักสูตร/ชั้นเรียน
- **Difficulty Level**: ระบุระดับความยากง่าย

### 5. Sharing Features
- **Shareable Links**: ลิงก์แชร์สำหรับครู
- **QR Code**: สร้าง QR code สำหรับแต่ละสื่อ
- **Embed Code**: โค้ดสำหรับฝังในเว็บอื่น

---

## 📅 Priority Matrix

| Task | Impact | Effort | Priority |
|------|--------|--------|----------|
| Rate Limiting API | สูง | ต่ำ | 🔴 ทำก่อน |
| Time-based Analytics | สูง | กลาง | 🟠 ทำเร็ว ๆ |
| Bulk Actions | กลาง | ต่ำ | 🟠 ทำเร็ว ๆ |
| Infinite Scroll | กลาง | ต่ำ | 🟡 ทำทีหลัง |
| 2FA for Admin | สูง | สูง | 🟡 ทำทีหลัง |
| Multi-Admin | กลาง | สูง | 🟢 วางแผน |

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Authentication | NextAuth.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Deployment | Vercel/Netlify (แนะนำ) |

---

*อัปเดตล่าสุด: มกราคม 2026*
