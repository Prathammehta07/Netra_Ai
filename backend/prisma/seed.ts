import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Netra AI database...');

  // Hash demo password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Seed Demo User & Profile
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@swasthmitra.org' },
    update: {},
    create: {
      email: 'demo@swasthmitra.org',
      name: 'Shraddha Patil',
      password: hashedPassword,
      role: 'PATIENT',
      profile: {
        create: {
          mobile: '+91 98765 43210',
          age: 19,
          gender: 'Female',
          city: 'Mumbai',
          state: 'Maharashtra',
          language: 'en',
          medicalHistory: 'Type 1 Diabetes Mellitus (2 years duration)',
          diabeticStatus: 'Type 1 Diabetes',
          onboardingComplete: true
        }
      }
    }
  });
  console.log(`Demo User created: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Seed Government Schemes
  const schemes = [
    {
      title: 'Ayushman Bharat (PM-JAY)',
      description: 'Provides health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.',
      eligibility: 'Low-income households based on SECC 2011 data, Ayushman Card holders.',
      officialUrl: 'https://pmjay.gov.in',
      category: 'National Health Cover'
    },
    {
      title: 'National Programme for Control of Blindness (NPCBVI)',
      description: 'Comprehensive scheme providing free cataract surgeries, screening for diabetic retinopathy, glaucoma management, and free distribution of spectacles.',
      eligibility: 'All Indian citizens with visual impairment or needing ophthalmic screening.',
      officialUrl: 'https://dghs.gov.in/content/1354_3_NationalProgrammeControlBlindnessVisualImpairment.aspx',
      category: 'Eye Care & Prevention'
    },
    {
      title: 'Rashtriya Vayoshri Yojana (RVY)',
      description: 'Scheme for providing physical aids and assisted-living devices for Senior Citizens belonging to BPL category.',
      eligibility: 'Senior citizens (Aged 60+ years) belonging to BPL category.',
      officialUrl: 'https://socialjustice.gov.in',
      category: 'Senior Citizen Support'
    },
    {
      title: 'Pradhan Mantri Swasthya Suraksha Yojana (PMSSY)',
      description: 'Aims at correcting regional imbalances in the availability of affordable and reliable tertiary healthcare services.',
      eligibility: 'All citizens seeking specialized medical care at AIIMS institutions.',
      officialUrl: 'https://pmssy.mohfw.gov.in',
      category: 'Tertiary Medical Care'
    }
  ];

  for (const scheme of schemes) {
    await prisma.governmentScheme.create({ data: scheme });
  }
  console.log('Seeded Government Schemes.');

  // 3. Seed Emergency Numbers
  const emergencies = [
    {
      service: 'National Emergency Response System',
      number: '112',
      description: 'All-in-one single emergency number for police, fire, and medical help across India.',
      icon: 'ShieldAlert'
    },
    {
      service: 'National Ambulance Service',
      number: '108',
      description: 'Free emergency medical transport and ambulance service across Indian states.',
      icon: 'Ambulance'
    },
    {
      service: 'Tele-MANAS Health Helpline',
      number: '14416',
      description: '24/7 free mental health and medical counseling tele-helpline by MoHFW.',
      icon: 'PhoneCall'
    },
    {
      service: 'Senior Citizen Helpline (Elder Line)',
      number: '14567',
      description: 'Free toll-free helpline providing information, support, and emergency guidance for elderly.',
      icon: 'HeartHandshake'
    },
    {
      service: 'Women Helpline',
      number: '181',
      description: '24-hour emergency phone line for women seeking medical or emergency support.',
      icon: 'UserCheck'
    }
  ];

  for (const emergency of emergencies) {
    await prisma.emergencyNumber.create({ data: emergency });
  }
  console.log('Seeded Emergency Numbers.');

  // 4. Seed Initial Retinal Scan Demo Data
  const sampleScan = await prisma.retinalScan.create({
    data: {
      userId: demoUser.id,
      imagePath: '/uploads/sample_retina_1.jpg',
      originalFilename: 'fundus_right_eye.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024 * 350,
      eye: 'Right Eye',
      scanDate: new Date('2025-09-06'),
      analysisResult: {
        create: {
          qualityScore: 0.94,
          qualityUsable: true,
          screeningCategory: 'Possible Moderate Diabetic Retinopathy Detected',
          screeningConfidence: 0.89,
          severity: 'Moderate',
          explanation: 'Early to moderate retinal microvascular changes were identified by the AI screening system. Microaneurysms and intraretinal hemorrhages detected.',
          clinicalNotes: 'Fundus scan shows several microaneurysms in the macular periphery with minor hard exudates. Retinal arterioles demonstrate mild focal narrowing.',
          modelVersion: 'v1.0.0-demo-model',
          isDemo: true
        }
      },
      findings: {
        create: [
          {
            type: 'microaneurysm',
            count: 12,
            confidence: 0.91,
            locationsJson: JSON.stringify([
              { x: 220, y: 180, radius: 10 },
              { x: 310, y: 240, radius: 8 },
              { x: 190, y: 290, radius: 12 }
            ])
          },
          {
            type: 'hemorrhage',
            count: 4,
            confidence: 0.86,
            locationsJson: JSON.stringify([
              { x: 380, y: 210, radius: 14 }
            ])
          },
          {
            type: 'exudate',
            count: 5,
            confidence: 0.88,
            locationsJson: JSON.stringify([
              { x: 270, y: 320, radius: 10 }
            ])
          }
        ]
      },
      review: {
        create: {
          status: 'PENDING',
          comments: 'Awaiting expert ophthalmologist review.'
        }
      },
      report: {
        create: {
          reportNumber: 'REP-20250906-001'
        }
      }
    }
  });

  console.log(`Sample scan created: ${sampleScan.id}`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
