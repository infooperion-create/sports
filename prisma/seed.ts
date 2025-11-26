import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.event.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')

  // Admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@numl.edu.pk',
      password: adminPassword,
      role: 'ADMIN',
      studentID: null,
    },
  })

  // Student users
  const studentPassword = await hashPassword('student123')
  const student1 = await prisma.user.create({
    data: {
      name: 'Ahmed Khan',
      email: 'ahmed.khan@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024001',
      department: 'BS Computer Science',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Fatima Zahra',
      email: 'fatima.zahra@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024002',
      department: 'BS English',
    },
  })

  const student3 = await prisma.user.create({
    data: {
      name: 'Muhammad Ali',
      email: 'muhammad.ali@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024003',
      department: 'BS Business Administration',
    },
  })

  console.log('🏆 Creating teams...')

  // Create teams
  const cricketTeam = await prisma.team.create({
    data: {
      name: 'NUML Cricket Club',
      sport: 'Cricket',
      department: 'BS Computer Science',
      createdBy: admin.id,
    },
  })

  const footballTeam = await prisma.team.create({
    data: {
      name: 'NUML Football Club',
      sport: 'Football',
      department: 'BS English',
      createdBy: admin.id,
    },
  })

  const basketballTeam = await prisma.team.create({
    data: {
      name: 'NUML Basketball Club',
      sport: 'Basketball',
      department: 'BS Business Administration',
      createdBy: admin.id,
    },
  })

  const badmintonTeam = await prisma.team.create({
    data: {
      name: 'NUML Badminton Club',
      sport: 'Badminton',
      department: 'BS Business Administration',
      createdBy: admin.id,
    },
  })

  // Update students with team assignments
  await prisma.user.update({
    where: { id: student1.id },
    data: { teamID: cricketTeam.id },
  })

  await prisma.user.update({
    where: { id: student2.id },
    data: { teamID: footballTeam.id },
  })

  await prisma.user.update({
    where: { id: student3.id },
    data: { teamID: basketballTeam.id },
  })

  console.log('📅 Creating events...')

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Cricket Tournament - Spring 2026',
      description: 'Annual cricket tournament featuring all university teams. Come and support your favorite team!',
      date: new Date('2026-03-15T10:00:00Z'),
      sport: 'Cricket',
      type: 'TOURNAMENT',
      location: 'NUML Sports Ground',
      createdBy: admin.id,
    },
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Football Championship',
      description: 'Inter-department football championship. Registration open for all students.',
      date: new Date('2026-03-20T14:00:00Z'),
      sport: 'Football',
      type: 'TOURNAMENT',
      location: 'Main Football Field',
      createdBy: admin.id,
    },
  })

  const event3 = await prisma.event.create({
    data: {
      title: 'Basketball 3x3 Tournament',
      description: 'Fast-paced 3x3 basketball tournament. Teams of 3-4 players can register.',
      date: new Date('2026-03-25T16:00:00Z'),
      sport: 'Basketball',
      type: 'TOURNAMENT',
      location: 'Indoor Sports Complex',
      createdBy: admin.id,
    },
  })

  const event4 = await prisma.event.create({
    data: {
      title: 'Cricket vs Football Match',
      description: 'Friendly match between cricket and football club teams.',
      date: new Date('2026-04-01T10:00:00Z'),
      sport: 'Cricket',
      type: 'MATCH',
      location: 'Main Sports Ground',
      teamAID: cricketTeam.id,
      teamBID: footballTeam.id,
      status: 'UPCOMING',
      createdBy: admin.id,
    },
  })

  const event5 = await prisma.event.create({
    data: {
      title: 'Badminton Singles Final',
      description: 'Championship final match for badminton singles category.',
      date: new Date('2026-04-05T09:00:00Z'),
      sport: 'Badminton',
      type: 'MATCH',
      location: 'Indoor Badminton Court',
      teamAID: badmintonTeam.id,
      status: 'COMPLETED',
      scoreA: 21,
      scoreB: 19,
      createdBy: admin.id,
    },
  })

  // Recent Events (Completed)
  const recentEvent1 = await prisma.event.create({
    data: {
      title: 'Inter-Department Cricket Championship',
      description: ' thrilling cricket match between Computer Science and Engineering departments. Computer Science won by 3 wickets in a nail-biting finish!',
      date: new Date('2025-01-15T10:00:00Z'),
      sport: 'Cricket',
      type: 'TOURNAMENT',
      location: 'NUML Sports Ground',
      status: 'COMPLETED',
      createdBy: admin.id,
    },
  })

  const recentEvent2 = await prisma.event.create({
    data: {
      title: 'Basketball Friendly Match',
      description: 'An exciting basketball match between NUML Basketball Club and visiting team from Punjab University. NUML won 78-72.',
      date: new Date('2025-01-10T16:00:00Z'),
      sport: 'Basketball',
      type: 'MATCH',
      location: 'Indoor Sports Complex',
      teamAID: basketballTeam.id,
      status: 'COMPLETED',
      scoreA: 78,
      scoreB: 72,
      createdBy: admin.id,
    },
  })

  const recentEvent3 = await prisma.event.create({
    data: {
      title: 'Annual Sports Day 2024',
      description: 'A grand celebration of sports with multiple events including track and field, volleyball, and tug-of-war. Over 500 students participated.',
      date: new Date('2024-12-20T09:00:00Z'),
      sport: 'Multi-Sport',
      type: 'TOURNAMENT',
      location: 'Main Sports Ground',
      status: 'COMPLETED',
      createdBy: admin.id,
    },
  })

  const recentEvent4 = await prisma.event.create({
    data: {
      title: 'Football Training Camp',
      description: 'Week-long intensive training camp for the football team conducted by professional coaches from Pakistan Football Federation.',
      date: new Date('2024-12-05T08:00:00Z'),
      sport: 'Football',
      type: 'PRACTICE',
      location: 'Football Training Ground',
      status: 'COMPLETED',
      createdBy: admin.id,
    },
  })

  const recentEvent5 = await prisma.event.create({
    data: {
      title: 'Table Tennis Tournament',
      description: 'Inter-university table tennis tournament with participants from 12 universities. NUML secured 2nd position in team event.',
      date: new Date('2024-11-28T11:00:00Z'),
      sport: 'Table Tennis',
      type: 'TOURNAMENT',
      location: 'Indoor Sports Complex',
      status: 'COMPLETED',
      createdBy: admin.id,
    },
  })

  console.log('📝 Creating posts...')

  // Create posts - only admin posts
  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏏 Cricket tournament registration is now open! All interested students can register at the sports office. Last date for registration: March 10, 2024. #Cricket #Tournament',
      imageURL: 'https://unsplash.com/photos/a-group-of-men-standing-next-to-each-other-on-a-field-sAC58O7CQWE?w=800&h=600&fit=crop',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '📢 Important Notice: All sports club presidents are requested to attend a meeting on March 5, 2024 at 2:00 PM in the conference room. Agenda: Annual sports budget and upcoming events.',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏆 Congratulations to our Badminton team for winning the regional championship! The team showed exceptional skill and sportsmanship. We are proud of your achievement! #Champions #Badminton',
      imageURL: 'https://images.unsplash.com/photo-1592656074407-9b5a33e2b59b?w=800&h=600&fit=crop',
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('🔑 Admin Account:')
  console.log('   Email: admin@numl.edu.pk')
  console.log('   Password: admin123')
  console.log('\n🔑 Student Accounts:')
  console.log('   Email: ahmed.khan@numl.edu.pk')
  console.log('   Password: student123')
  console.log('   Email: fatima.zahra@numl.edu.pk')
  console.log('   Password: student123')
  console.log('   Email: muhammad.ali@numl.edu.pk')
  console.log('   Password: student123')
  console.log('\n📊 Summary:')
  console.log(`   Users: 4 (1 Admin, 3 Students)`)
  console.log(`   Teams: 4 (Cricket, Football, Basketball, Badminton)`)
  console.log(`   Events: 10 (5 Tournaments, 3 Matches, 1 Training, 1 Multi-Sport)`)
  console.log(`   Posts: 3 (Admin announcements only)`)
  console.log('\n🏫 Team-Department Structure:')
  console.log('   Cricket Team: BS Computer Science')
  console.log('   Football Team: BS English')
  console.log('   Basketball Team: BS Business Administration')
  console.log('   Badminton Team: BS Business Administration')
  console.log('\n⚽ Event Types:')
  console.log('   Tournaments: Cricket, Football, Basketball')
  console.log('   Matches: Cricket vs Football, Badminton Singles (Completed)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })