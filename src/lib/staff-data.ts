export interface StaffMember {
  name: string
  age: number | null
  position: string
  staffType: string
}

export type AgeGroup = '20-30' | '31-40' | '41+'

export function getAgeGroup(age: number | null): AgeGroup | null {
  if (age === null) return null
  if (age >= 20 && age <= 30) return '20-30'
  if (age >= 31 && age <= 40) return '31-40'
  if (age >= 41) return '41+'
  return null
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '20-30': 'กลุ่มอายุ 20-30 ปี',
  '31-40': 'กลุ่มอายุ 31-40 ปี',
  '41+': 'กลุ่มอายุ 41 ปีขึ้นไป',
}

// Normalize name: remove extra spaces, \xa0, trim
function n(name: string): string {
  return name.replace(/\xa0/g, ' ').replace(/\s+/g, ' ').trim()
}

export const STAFF_LIST: StaffMember[] = [
  { name: n('นางกาญจนา จันทอุปรี'), age: 48, staffType: 'ข้าราชการ', position: 'รองผู้อำนวยการสถานศึกษา' },
  { name: n('นางนภาวัลย์ ซิ่วนัส'), age: 60, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางภาราดา พัสลัง'), age: 45, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางปวีนา จ่าแก้ว'), age: 48, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางยุภาวดี เทศไทย'), age: 42, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('ว่าที่ร้อยตรีหญิงลักขณา ยี่สุ่น'), age: 38, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายภัชรกุล ม่วงงาม'), age: 40, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวอฑิตยา คณาศักดิ์'), age: 32, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายพงษ์พิพัฒน์ เขียนเจริญ'), age: 40, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายเอกพงษ์ สมบัติพิบูลย์'), age: 33, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายชูชีพ ร่มโพธิ์'), age: 46, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวณัชชามน บุญทัน'), age: 39, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวนุชนาฎ สามสี'), age: 36, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาววิมลมาศ แก่นสวัสดิ์'), age: 44, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายธนิษฐ์ กลิ่นเลขา'), age: 43, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายณัชภัค แสงเพ็ชร'), age: 49, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวธมลณัฏฐ์ พรมมาเขียว'), age: 33, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายวีรศักดิ์ มั่นประสงค์'), age: 34, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวธัญดา สุหฤทรุจนนุกูล'), age: 44, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายธีรภัทร เลียงวัฒนชัย'), age: 32, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายเกษมสันต์ คุ้มสุวรรณ'), age: 33, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายบรรณวัชร บุญถาวร'), age: 33, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวจตุพร สินประเสริฐ'), age: 40, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวกิรณา สังข์เสวก'), age: 41, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวนิตยา แก้วน่าน'), age: 33, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวภัคร์ภัสสร ตาเกะงากิ'), age: 27, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวภัทราพร ฝั้นอิ่นแก้ว'), age: 30, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวภิชดา สีดำ'), age: 28, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายจิระ ม่วงมา'), age: 36, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายศุภณัฐ คลังกรณ์'), age: 36, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวรังสินี ตุ่นทอง'), age: 29, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวสุพิชญา หล่ายโท้'), age: 32, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวสมฤดี พจนาธำรงพงศ์'), age: 36, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายนิทัศน์ พันธ์บานชื่น'), age: 40, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายพงศกร สมบัติพิบูลย์'), age: 28, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายพิริยพงศ์ ทาจำปา'), age: 32, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายอนุรักษ์ รัตนพงษ์'), age: 31, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวธัญญาลักษณ์ กันขุนทด'), age: 43, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวจิตรา ปั้นเหน่งเพชร'), age: 34, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายวัชรพล อ่อนพันธ์'), age: 29, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายก้องกิดากอน ประจงแต่ง'), age: 28, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายกฤษฎา สุนทราเดชอังกูร'), age: 32, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นายสุรศักดิ์ ใจคำ'), age: 45, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวอัจฉราพรรณ แสนอะทะ'), age: 26, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวกรวรรณ จันภูงา'), age: 45, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวกรวรรณ ทองอร'), age: 35, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นายธีรยุทธ พันชำนาญ'), age: 32, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวจิราพร ฤาชัยราม'), age: 29, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวชฎากร ชรินทร์'), age: 29, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางศุภลักษณ์ สีคำบ่อ'), age: 36, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นายสิทธิชัย พุ่มราตรี'), age: 27, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวนลิน คำภักดี'), age: 27, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นายวรายุส ลัคนาศิโรรัตน์'), age: 32, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวจิตรา โซ่เมืองแซะ'), age: 32, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นายกรวรรณ ทันไธสง'), age: 35, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวซาบีลา หลีปุ่ม'), age: 26, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวอามาลีนา ดินอะ'), age: 29, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นายชินดนัย อินทชัย'), age: 33, staffType: 'ข้าราชการ', position: 'ครูผู้ช่วย' },
  { name: n('นางสาวน้ำฝน บัวหิรัญ'), age: 34, staffType: 'ข้าราชการ', position: 'ครู' },
  { name: n('นางสาวรภัทภร ทองศรีรุ้ง'), age: 45, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางโสภิชา บุญถาวร'), age: 33, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวสุนิสา วรรณทอง'), age: 33, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวณัฐริกา แก่งศิริ'), age: 29, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวทิวาทิพย์ ธรรมมังสา'), age: 30, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวธนพร จงดี'), age: 25, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวภิญญดา ปานพรหม'), age: 31, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางธนิดา ดอกพิกุล'), age: 33, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวกมลชนก แก่นเรณู'), age: 29, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวอุบลวรรณ อะวะโห'), age: 25, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวเกศรินทร์ เข็มมาก'), age: 28, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวกัญญาณัฐ เกตุภูงา'), age: 46, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวสุรีรัตน์ เชนชาญ'), age: 32, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นายเต็มภพ ธรรมพิธี'), age: 28, staffType: 'พนักงานราชการ', position: 'ครูผู้สอน' },
  { name: n('นางสาวณัฐิดา ศิริมงคล'), age: 43, staffType: 'พนักงานราชการ', position: 'พนักงานพิมพ์เบรลล์' },
  { name: n('นางสาวอภิสรา กล่อมจันทร์'), age: 25, staffType: 'พนักงานธุรการ', position: 'พนักงานธุรการ' },
  { name: n('นางสาวธนัชพร เทียมหลา'), age: 31, staffType: 'ครูอัตราจ้าง', position: 'ครูคู่ขนานออทิสติก' },
  { name: n('นายวัทธิกร บุญก่ำ'), age: 28, staffType: 'ครูอัตราจ้าง', position: 'ครูคู่ขนานออทิสติก' },
  { name: n('ว่าที่ ร.ต.หญิงทิพย์สุดา เงาะสงคราม'), age: 24, staffType: 'ครูอัตราจ้าง', position: 'ครูสอนเด็กเจ็บป่วย' },
  { name: n('นางสาวกุสุมา รัตนพงษ์'), age: 30, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายพิพัฒน์ รื่นชล'), age: 33, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางนวลพรรณ กะมะโน'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาววาสนา บุญนาค'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางรุ่งนภา ปัดโตยันทัง'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวพัชรินทร์ แซ่เตียว'), age: 32, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวอัจฉรา สมเสียง'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวมนิชา มาตย์สิมมา'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายธราธิป ยีสันเทียะ'), age: 25, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายณวัสน์ งามสีห์พิมล'), age: 40, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายปฏิภาณ อุตรา'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวประนอม แก้วก้อน'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวนิโลบล พรมอ่อน'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวเยาวเรศ ผลากาญจน์'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวฐิติมา จรรยา'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวดวงพร เกี้ยวพิมาย'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวฐิตาภา เทพพนม'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายนิวัฒน์ จันทร์กระจ่าง'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวอรพิน สมสอง'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางมาลี เกตุเชื้อ'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาววัชราภรณ์ เจริญผล'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวนาฎตยา กันทอง'), age: 36, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวพิมพ์วิภา ประทุม'), age: 29, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายพัชรเทพ พัฒนะ'), age: 23, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวสุธิษา สุขประเสริฐ'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางสาวเหมรัศมิ์ บรรลุกิจ'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นางบุบผา จันทร'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กพิการ' },
  { name: n('นายเฉลิมชัย เกิดสมบัติ'), age: null, staffType: 'จ้างเหมา', position: 'ยาม' },
  { name: n('นางสาวสุนันท์ นรายศ'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กปัญญาอ่อน' },
  { name: n('นางสาวเสาวลักษณ์ ศรีหานาม'), age: null, staffType: 'จ้างเหมา', position: 'พี่เลี้ยงเด็กปัญญาอ่อน' },
  { name: n('นายเสมา พูลวงษ์'), age: null, staffType: 'จ้างเหมา', position: 'ภารโรง' },
]

// Thai prefixes to strip for matching
const PREFIXES = [
  'ว่าที่ร้อยตรีหญิง',
  'ว่าที่ ร.ต.หญิง',
  'ว่าที่ ร.ต.',
  'นางสาว',
  'นาง',
  'นาย',
]

// Strip prefix, extra text, and normalize spaces
function stripName(name: string): string {
  let s = name.replace(/\xa0/g, ' ').replace(/\s+/g, ' ').trim()
  // Remove prefix
  for (const p of PREFIXES) {
    if (s.startsWith(p)) {
      s = s.slice(p.length).trim()
      break
    }
  }
  // Remove trailing extra info like "ตำแหน่ง ครู"
  const cutWords = ['ตำแหน่ง']
  for (const w of cutWords) {
    const idx = s.indexOf(w)
    if (idx > 0) s = s.slice(0, idx).trim()
  }
  return s
}

// Extract surname (last word) from a name
function getSurname(name: string): string {
  const parts = stripName(name).split(' ').filter(Boolean)
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

// Extract first name (first word after stripping prefix)
function getFirstName(name: string): string {
  const parts = stripName(name).split(' ').filter(Boolean)
  return parts[0] || ''
}

/**
 * Build a matcher that finds the best staff match for a submittedBy name.
 * Match priority: exact normalized → surname+firstname → surname only
 */
export function buildStaffMatcher(staffList: StaffMember[]) {
  // Index by normalized full name (no prefix, no spaces)
  const byExact = new Map<string, StaffMember>()
  // Index by surname → staff members
  const bySurname = new Map<string, StaffMember[]>()

  for (const staff of staffList) {
    const stripped = stripName(staff.name).replace(/\s+/g, '')
    byExact.set(stripped, staff)

    const surname = getSurname(staff.name)
    if (surname) {
      const arr = bySurname.get(surname) || []
      arr.push(staff)
      bySurname.set(surname, arr)
    }
  }

  return function match(submittedBy: string): StaffMember | null {
    const stripped = stripName(submittedBy).replace(/\s+/g, '')

    // 1. Exact match (stripped, no spaces)
    const exact = byExact.get(stripped)
    if (exact) return exact

    // 2. Match by surname + first name
    const surname = getSurname(submittedBy)
    const firstName = getFirstName(submittedBy)

    if (surname) {
      const candidates = bySurname.get(surname)
      if (candidates) {
        // If only 1 person with that surname, it's a match
        if (candidates.length === 1) return candidates[0]
        // If multiple, match by first name
        if (firstName) {
          const found = candidates.find(c => getFirstName(c.name) === firstName)
          if (found) return found
        }
      }
    }

    // 3. First name only (single word input like "วัชรพล")
    if (firstName && !surname) {
      for (const staff of staffList) {
        if (getFirstName(staff.name) === firstName) return staff
      }
    }

    return null
  }
}

// Keep for backward compat
export function normalizeName(name: string): string {
  return name.replace(/\xa0/g, ' ').replace(/\s+/g, '').trim()
}
