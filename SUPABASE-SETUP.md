# 🚀 วิธีเปลี่ยนจาก SQLite ไปใช้ Supabase (ตาราง ai_edugame)

## ขั้นตอนที่ 1: รัน SQL ใน Supabase

1. เปิด Supabase Dashboard: https://supabase.com/dashboard
2. เลือก Project: `ikfioqvjrhquiyeylmsv`
3. ไปที่ **SQL Editor** (เมนูด้านซ้าย)
4. สร้าง **New Query**
5. คัดลอกโค้ดจากไฟล์ `supabase-alter-table.sql`
6. วาง (Paste) ลงใน SQL Editor
7. คลิก **Run** (หรือกด `Ctrl+Enter`)

### ตรวจสอบว่ารันสำเร็จ:
- ไปที่ **Table Editor**
- ดูตาราง `ai_edugame` ควรมี columns:
  - `status` (enum: PENDING, APPROVED, REJECTED)
  - `submitted_by` (text, nullable)

---

## ขั้นตอนที่ 2: หารหัสผ่าน Database

1. ไปที่ **Settings** → **Database**
2. หาส่วน **Connection string** → **URI**
3. จะเห็นรูปแบบแบบนี้:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.ikfioqvjrhquiyeylmsv.supabase.co:5432/postgres
   ```
4. คัดลอก **[YOUR-PASSWORD]** (รหัสผ่าน database)

---

## ขั้นตอนที่ 3: อัพเดท `.env`

แก้ไขไฟล์ `.env`:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.ikfioqvjrhquiyeylmsv.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ikfioqvjrhquiyeylmsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmlvcXZqcmhxdWl5ZXlsbXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzQ3MTcsImV4cCI6MjA2NjQxMDcxN30.m0RHqLl6RmM5rTN-TU3YrcvHNpSB9FnH_XN_Y3uhhRc

# Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Allowed domains
ALLOWLIST_DOMAINS=loveable.dev,*.loveable.dev,lovable.app,*.lovable.app
```

⚠️ **สำคัญ:** แทนที่ `YOUR_ACTUAL_PASSWORD` ด้วยรหัสผ่านจริง!

---

## ขั้นตอนที่ 4: อัพเดท Prisma Schema

แก้ไข `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // เปลี่ยนจาก sqlite
  url      = env("DATABASE_URL")
}
```

---

## ขั้นตอนที่ 5: Generate Prisma Client

รันคำสั่งนี้ใน terminal:

```bash
# หยุด dev server ก่อน (Ctrl+C)

# ลบ cache
rm -rf .next node_modules/.prisma

# Generate Prisma Client ใหม่
npx prisma generate

# ไม่ต้องรัน prisma db push เพราะเรารัน SQL ใน Supabase แล้ว

# รัน dev server อีกครั้ง
npm run dev
```

---

## ขั้นตอนที่ 6: ทดสอบระบบ

1. เปิดเบราว์เซอร์: http://localhost:3003
2. ไปที่ `/submit` ส่งสื่อทดสอบ
3. Login admin: `/auth/signin` (admin/admin123)
4. ไปที่ `/admin/approve` อนุมัติสื่อ
5. กลับหน้าแรก → ควรเห็นสื่อที่อนุมัติ

---

## 🔧 Troubleshooting

### ปัญหา: "Unknown argument `status`"
- แก้: ยังไม่ได้รัน `npx prisma generate`
- วิธีแก้: รันคำสั่ง `npx prisma generate` อีกครั้ง

### ปัญหา: "Can't reach database server"
- แก้: รหัสผ่านใน DATABASE_URL ไม่ถูกต้อง
- วิธีแก้: ตรวจสอบรหัสผ่านใน Supabase Dashboard อีกครั้ง

### ปัญหา: "Relation does not exist"
- แก้: ยังไม่ได้รัน SQL script ใน Supabase
- วิธีแก้: รัน `supabase-alter-table.sql` ใน SQL Editor

---

## ✅ Checklist

- [ ] รัน SQL script ใน Supabase
- [ ] คัดลอกรหัสผ่าน database
- [ ] อัพเดท `.env` (DATABASE_URL)
- [ ] แก้ไข `prisma/schema.prisma` (provider = "postgresql")
- [ ] รัน `npx prisma generate`
- [ ] รัน `npm run dev`
- [ ] ทดสอบส่งสื่อและอนุมัติ

---

## 📊 ข้อมูลเพิ่มเติม

### SQL Scripts ที่มี:
1. **supabase-migration.sql** - สร้างตารางใหม่ทั้งหมด
2. **supabase-alter-table.sql** - เพิ่ม columns ในตาราง ai_edugame ที่มีอยู่

### Columns ที่เพิ่ม:
- `status` - สถานะ (PENDING/APPROVED/REJECTED)
- `submitted_by` - ชื่อผู้ส่งสื่อ

### Indexes ที่สร้าง:
- `idx_ai_edugame_status` - เร็วขึ้นตอน query by status
- `idx_ai_edugame_category` - เร็วขึ้นตอน query by category
- `idx_ai_edugame_view_count` - เร็วขึ้นตอนเรียงตาม views
- `idx_ai_edugame_created_at` - เร็วขึ้นตอนเรียงตามวันที่
