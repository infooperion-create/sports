import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

// Helper function to generate 8-character alphanumeric ID
function generateId(): string {
  const chars = '0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.event.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')

  // Admin user - Mr. Touqeer
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      name: 'Mr. Touqeer',
      email: 'touqeer@numl.edu.pk',
      password: adminPassword,
      role: 'ADMIN',
      studentID: null,
    },
  })

  // Coach user - Ghulam Bahu
  const coachPassword = await hashPassword('coach123')
  const coach = await prisma.user.create({
    data: {
      name: 'Ghulam Bahu',
      email: 'ghulam.bahu@numl.edu.pk',
      password: coachPassword,
      role: 'COACH',
      department: 'BS Computer Science',
    },
  })

  // Captain - Kashif
  const captainPassword = await hashPassword('captain123')
  const captain = await prisma.user.create({
    data: {
      name: 'Kashif',
      email: 'kashif@numl.edu.pk',
      password: captainPassword,
      role: 'STUDENT',
      studentID: generateId(),
      department: 'BS Computer Science',
    },
  })

  // Additional team members
  const teamMembers = []
  const memberNames = [
    'Ahmed Khan', 'Fatima Zahra', 'Muhammad Ali', 'Sara Ahmed', 
    'Umer Farooq', 'Ayesha Khan', 'Bilal Hussain', 'Zainab Ali'
  ]

  for (let i = 0; i < memberNames.length; i++) {
    const member = await prisma.user.create({
      data: {
        name: memberNames[i],
        email: `${memberNames[i].toLowerCase().replace(' ', '.')}@numl.edu.pk`,
        password: await hashPassword('student123'),
        role: 'STUDENT',
        studentID: generateId(),
        department: 'BS Computer Science',
      },
    })
    teamMembers.push(member)
  }

  console.log('🏆 Creating teams for all departments...')

  // Define departments and their sports
  const departments = [
    {
      name: 'BS Computer Science',
      sports: ['Football', 'Cricket', 'Basketball', 'Table Tennis', 'Esports']
    },
    {
      name: 'BS English',
      sports: ['Football', 'Cricket', 'Hockey', 'Badminton', 'Chess']
    },
    {
      name: 'BS Business Administration',
      sports: ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Squash']
    },
    {
      name: 'BS Physics',
      sports: ['Cricket', 'Hockey', 'Athletics', 'Swimming', 'Table Tennis']
    },
    {
      name: 'BS Chemistry',
      sports: ['Football', 'Volleyball', 'Badminton', 'Chess', 'Athletics']
    },
    {
      name: 'BS Mathematics',
      sports: ['Cricket', 'Basketball', 'Chess', 'Table Tennis', 'Esports']
    },
    {
      name: 'BS Economics',
      sports: ['Football', 'Hockey', 'Tennis', 'Squash', 'Athletics']
    },
    {
      name: 'BS Psychology',
      sports: ['Basketball', 'Volleyball', 'Badminton', 'Chess', 'Table Tennis']
    }
  ]

  const createdTeams = []

  // Create teams for each department and sport
  for (const department of departments) {
    for (const sport of department.sports) {
      const team = await prisma.team.create({
        data: {
          id: generateId(),
          name: `${department.name} ${sport} Team`,
          sport: sport,
          department: department.name,
          createdBy: admin.id,
        },
      })
      createdTeams.push(team)
    }
  }

  // Assign coach to Football Team (BS Computer Science)
  const footballTeam = createdTeams.find(team => 
    team.department === 'BS Computer Science' && team.sport === 'Football'
  )
  
  if (footballTeam) {
    await prisma.team.update({
      where: { id: footballTeam.id },
      data: { coachId: coach.id },
    })

    // Assign captain and team members to Football Team
    await prisma.user.update({
      where: { id: captain.id },
      data: { teamID: footballTeam.id },
    })

    for (const member of teamMembers.slice(0, 7)) {
      await prisma.user.update({
        where: { id: member.id },
        data: { teamID: footballTeam.id },
      })
    }
  }

  // Assign some students to other teams
  for (let i = 0; i < teamMembers.length; i++) {
    const randomTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)]
    await prisma.user.update({
      where: { id: teamMembers[i].id },
      data: { teamID: randomTeam.id },
    })
  }

  console.log('📅 Creating events...')

  // Create events for different sports
  const events = [
    {
      title: 'Inter-Department Football Championship 2024',
      description: 'Annual football championship featuring all departments. Teams will compete in knockout format.',
      date: new Date('2024-03-15T10:00:00Z'),
      sport: 'Football',
      type: 'TOURNAMENT',
      location: 'Main Football Ground',
      teamAID: footballTeam?.id,
    },
    {
      title: 'Cricket Premier League',
      description: 'Cricket tournament with league format. All department teams participate.',
      date: new Date('2024-03-20T14:00:00Z'),
      sport: 'Cricket',
      type: 'TOURNAMENT',
      location: 'Cricket Ground',
    },
    {
      title: 'Basketball 3x3 Tournament',
      description: 'Fast-paced basketball tournament with 3-player teams.',
      date: new Date('2024-03-25T16:00:00Z'),
      sport: 'Basketball',
      type: 'TOURNAMENT',
      location: 'Indoor Basketball Court',
    },
    {
      title: 'Table Tennis Championship',
      description: 'Individual and team table tennis championship.',
      date: new Date('2024-04-01T09:00:00Z'),
      sport: 'Table Tennis',
      type: 'TOURNAMENT',
      location: 'Table Tennis Hall',
    },
    {
      title: 'Athletics Meet',
      description: 'Track and field events including 100m, 200m, 400m, long jump, and high jump.',
      date: new Date('2024-04-05T08:00:00Z'),
      sport: 'Athletics',
      type: 'TOURNAMENT',
      location: 'Athletics Track',
    }
  ]

  for (const eventData of events) {
    await prisma.event.create({
      data: {
        ...eventData,
        createdBy: admin.id,
      },
    })
  }

  console.log('📝 Creating posts...')

  // Create posts by admin
  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏆 Sports registrations are now open for all departments! Contact the sports office to join your favorite team. Last date for registration: March 10, 2024. #Sports #Registration',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '📢 Important Notice: All team captains are requested to attend a meeting on March 5, 2024 at 2:00 PM in the conference room. Agenda: Tournament schedule and rules discussion.',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '⚽ Football practice schedule: Every Monday and Wednesday at 4:00 PM. All team members must attend. For any queries, contact Coach Ghulam Bahu. #Football #Practice',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏏 Cricket trials for new players will be held on March 8, 2024. Interested students should bring their sports kit and register at the sports office. #Cricket #Trials',
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('🔑 Admin Account:')
  console.log('   Name: Mr. Touqeer')
  console.log('   Email: touqeer@numl.edu.pk')
  console.log('   Password: admin123')
  console.log('\n👨‍💼 Coach Account:')
  console.log('   Name: Ghulam Bahu')
  console.log('   Email: ghulam.bahu@numl.edu.pk')
  console.log('   Password: coach123')
  console.log('\n👨‍🎓 Captain Account:')
  console.log('   Name: Kashif')
  console.log('   Email: kashif@numl.edu.pk')
  console.log('   Password: captain123')
  console.log('\n🔑 Student Accounts:')
  console.log('   Password: student123 (for all student accounts)')
  console.log('\n📊 Summary:')
  console.log(`   Users: ${11 + teamMembers.length} (1 Admin, 1 Coach, 1 Captain, ${teamMembers.length} Team Members)`)
  console.log(`   Teams: ${createdTeams.length} (Multiple sports across 8 departments)`)
  console.log(`   Events: 5 (Tournaments and championships)`)
  console.log(`   Posts: 4 (Admin announcements)`)
  console.log('\n🏫 Department-Sports Structure:')
  departments.forEach(dept => {
    console.log(`   ${dept.name}: ${dept.sports.join(', ')}`)
  })
  console.log('\n⚽ Special Assignments:')
  console.log('   Football Team (BS Computer Science): Coach - Ghulam Bahu, Captain - Kashif')
  console.log('   Team IDs: 8-character alphanumeric codes')
  console.log('   Student IDs: 8-character alphanumeric codes')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })