# 🚀 วิธี Deploy เพื่อสร้าง URL แชร์ได้

## URL ที่ได้ (ตัวอย่าง)
```
https://suwansa-datraksa.github.io/physics/M4/
```

---

## ขั้นตอน (ทำครั้งเดียว ~10 นาที)

### 1. สมัคร GitHub (ถ้ายังไม่มีบัญชี)
- ไปที่ https://github.com/signup
- ใช้ username: `suwansa-datraksa` (GitHub ไม่รองรับ underscore)

### 2. สร้าง Repository ใหม่
- ไปที่ https://github.com/new
- Repository name: `physics`
- ตั้งเป็น **Public**
- กด **Create repository**

### 3. อัปโหลดไฟล์
- ใน repo ที่สร้าง → คลิก **Add file** → **Upload files**
- สร้างโฟลเดอร์ M4: พิมพ์ `M4/` ในช่องชื่อไฟล์ก่อน จะสร้างโฟลเดอร์ให้อัตโนมัติ
- อัปโหลดไฟล์ทั้งหมด:
  - `M4/index.html`
  - `M4/styles.css`
  - `M4/script.js`
- กด **Commit changes**

### 4. เปิด GitHub Pages
- ไปที่ **Settings** ของ repo
- เลื่อนลงหา **Pages** (ในเมนูซ้าย)
- Source: **Deploy from a branch**
- Branch: **main** / folder: **/ (root)**
- กด **Save**

### 5. รอ 1-3 นาที แล้วเข้า URL:
```
https://suwansa-datraksa.github.io/physics/M4/
```

---

## ทางเลือกอื่น (ง่ายกว่า): Netlify Drop

1. ไปที่ https://app.netlify.com/drop
2. ลากโฟลเดอร์ `สื่อการสอน` ทั้งโฟลเดอร์ไปวาง
3. ได้ URL ทันที เช่น `https://abc123.netlify.app`
4. เปลี่ยนชื่อ site ในการตั้งค่าเป็น `suwansa-physics-m4`
5. URL จะเป็น: `https://suwansa-physics-m4.netlify.app`
