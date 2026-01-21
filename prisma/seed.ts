import { PrismaClient, Category } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sampleMedia = [
    {
      title: 'Interactive Math Game - Fractions',
      slug: 'math-fractions-game',
      url: 'https://loveable.dev/projects/math-fractions',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop&auto=format',
      description: 'เรียนรู้เศษส่วนผ่านเกมที่สนุกและเข้าใจง่าย',
      category: Category.MATH,
      tags: JSON.stringify(['คณิต', 'เศษส่วน', 'เกม', 'ป.4', 'ป.5']),
      viewCount: 156,
      playCount: 89,
    },
    {
      title: 'Science Lab - Plant Life Cycle',
      slug: 'science-plant-lifecycle',
      url: 'https://loveable.dev/projects/plant-cycle-sim',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format',
      description: 'สำรวจวงจรชีวิตของพืชผ่านการจำลองแบบโต้ตอบ',
      category: Category.SCIENCE,
      tags: JSON.stringify(['วิทยาศาสตร์', 'พืช', 'วงจรชีวิต', 'ป.3', 'ป.4']),
      viewCount: 203,
      playCount: 134,
    },
    {
      title: 'Thai Reading Adventure',
      slug: 'thai-reading-adventure',
      url: 'https://loveable.dev/projects/thai-reading-game',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format',
      description: 'การผจญภัยการอ่านภาษาไทยสำหรับเด็กประถม',
      category: Category.THAI,
      tags: JSON.stringify(['ภาษาไทย', 'การอ่าน', 'ป.1', 'ป.2']),
      viewCount: 178,
      playCount: 156,
    },
    {
      title: 'English Vocabulary Builder',
      slug: 'english-vocab-builder',
      url: 'https://learn.loveable.dev/english-vocab',
      thumbnail: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a0?w=400&h=300&fit=crop&auto=format',
      description: 'Build English vocabulary through interactive games and activities',
      category: Category.ENGLISH,
      tags: JSON.stringify(['English', 'Vocabulary', 'ป.4', 'ป.5', 'ป.6']),
      viewCount: 267,
      playCount: 189,
    },
    {
      title: 'Solar System Explorer',
      slug: 'solar-system-explorer',
      url: 'https://loveable.dev/projects/solar-system',
      thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&auto=format',
      description: 'สำรวจระบบสุริยะและเรียนรู้เกี่ยวกับดาวเคราะห์',
      category: Category.SCIENCE,
      tags: JSON.stringify(['ดาราศาสตร์', 'ระบบสุริยะ', 'ม.1', 'ม.2']),
      viewCount: 312,
      playCount: 245,
    },
    {
      title: 'Geography Quiz Thailand',
      slug: 'geography-quiz-thailand',
      url: 'https://loveable.dev/projects/thailand-geography',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
      description: 'ควิซภูมิศาสตร์ประเทศไทย เรียนรู้จังหวัดและภูมิประเทศ',
      category: Category.SOCIAL,
      tags: JSON.stringify(['ภูมิศาสตร์', 'ประเทศไทย', 'จังหวัด', 'ป.4', 'ป.5']),
      viewCount: 198,
      playCount: 167,
    },
    {
      title: 'Multiplication Master',
      slug: 'multiplication-master',
      url: 'https://games.loveable.dev/multiply-master',
      thumbnail: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400&h=300&fit=crop&auto=format',
      description: 'เกมฝึกสมองตารางสูตรคูณ สนุกและท้าทาย',
      category: Category.MATH,
      tags: JSON.stringify(['คณิต', 'คูณ', 'ตารางสูตรคูณ', 'ป.3', 'ป.4']),
      viewCount: 445,
      playCount: 378,
    },
    {
      title: 'Water Cycle Simulator',
      slug: 'water-cycle-simulator',
      url: 'https://loveable.dev/projects/water-cycle',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
      description: 'จำลองวงจรน้ำในธรรมชาติแบบโต้ตอบ',
      category: Category.SCIENCE,
      tags: JSON.stringify(['วงจรน้ำ', 'ธรรมชาติ', 'วิทยาศาสตร์', 'ป.5', 'ป.6']),
      viewCount: 234,
      playCount: 189,
    },
    {
      title: 'Thai History Timeline',
      slug: 'thai-history-timeline',
      url: 'https://loveable.dev/projects/thai-history',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format',
      description: 'เส้นทางประวัติศาสตร์ไทยแบบโต้ตอบ',
      category: Category.SOCIAL,
      tags: JSON.stringify(['ประวัติศาสตร์', 'ไทย', 'ม.1', 'ม.2']),
      viewCount: 156,
      playCount: 134,
    },
    {
      title: 'Creative Writing Studio',
      slug: 'creative-writing-studio',
      url: 'https://create.loveable.dev/writing-studio',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&auto=format',
      description: 'สตูดิโอสำหรับสร้างสรรค์งานเขียนและเรื่องสั้น',
      category: Category.OTHER,
      tags: JSON.stringify(['การเขียน', 'สร้างสรรค์', 'เรื่องสั้น', 'ม.1', 'ม.2', 'ม.3']),
      viewCount: 98,
      playCount: 67,
    },
  ]

  console.log('Start seeding...')

  for (const media of sampleMedia) {
    await prisma.media.create({
      data: media,
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })