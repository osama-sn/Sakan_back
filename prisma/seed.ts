import { PrismaClient, UserRole, PropertyType, GenderPolicy, BookingStatus, NotificationType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const predefinedAmenities = [
  { name: "WiFi", category: "Connectivity", icon: "wifi" },
  { name: "Air Conditioning", category: "Comfort", icon: "ac" },
  { name: "Washing Machine", category: "Appliances", icon: "washer" },
  { name: "Kitchen", category: "General", icon: "kitchen" },
  { name: "Refrigerator", category: "Appliances", icon: "fridge" },
  { name: "Elevator", category: "Building", icon: "elevator" },
  { name: "Security", category: "Safety", icon: "security" },
  { name: "Parking", category: "Building", icon: "parking" },
  { name: "Study Area", category: "Facilities", icon: "study" },
  { name: "Electricity", category: "Utilities", icon: "electricity" },
  { name: "Water", category: "Utilities", icon: "water" },
  { name: "Gas", category: "Utilities", icon: "gas" },
  { name: "Private Bathroom", category: "Comfort", icon: "bathroom" },
  { name: "Balcony", category: "Comfort", icon: "balcony" },
  { name: "Desk", category: "Furniture", icon: "desk" },
  { name: "Wardrobe", category: "Furniture", icon: "wardrobe" },
  { name: "Smart TV", category: "Entertainment", icon: "tv" },
  { name: "Microwave", category: "Appliances", icon: "microwave" }
];

async function main() {
  console.log("🌱 Starting complete SAKAN database seeding...");

  // 1. Seed Amenities
  console.log("👉 Seeding amenities...");
  const amenityMap = new Map<string, string>();
  for (const item of predefinedAmenities) {
    const amenity = await prisma.amenity.upsert({
      where: { name: item.name },
      update: { category: item.category, icon: item.icon, isActive: true },
      create: { name: item.name, category: item.category, icon: item.icon, isActive: true }
    });
    amenityMap.set(item.name, amenity.id);
  }

  // 2. Seed Users
  console.log("👉 Seeding users...");
  const passwordHash = await bcrypt.hash("Password123", 10);

  // Owners
  const owner1 = await prisma.user.upsert({
    where: { email: "owner@sakan.com" },
    update: {},
    create: {
      fullName: "إبراهيم الدسوقي",
      firstName: "إبراهيم",
      lastName: "الدسوقي",
      email: "owner@sakan.com",
      phone: "01011223344",
      passwordHash,
      role: UserRole.OWNER,
      gender: "MALE",
      bio: "مؤجر عقارات وسكن طلابي معتمد بخبرة أكثر من 10 سنوات في خدمة طلاب الجامعات المصرية.",
      isActive: true
    }
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@sakan.com" },
    update: {},
    create: {
      fullName: "د. سمير المنشاوي",
      firstName: "سمير",
      lastName: "المنشاوي",
      email: "owner2@sakan.com",
      phone: "01122334455",
      passwordHash,
      role: UserRole.OWNER,
      gender: "MALE",
      bio: "أستاذ جامعي ومسؤول عن توفير مساكن هادئة وآمنة مخصصة للطالبات.",
      isActive: true
    }
  });

  // Students
  const student1 = await prisma.user.upsert({
    where: { email: "student@sakan.com" },
    update: {
      fullName: "أحمد محمد إبراهيم",
      governorate: "القاهرة",
      university: "جامعة عين شمس",
      faculty: "كلية الهندسة",
      major: "هندسة مدنية",
      academicYear: "سنة 3",
      gender: "MALE",
      housingStatus: "يبحث عن شريك سكن",
      interests: "عاشق للقراءة، غير مدخن، هادئ"
    },
    create: {
      fullName: "أحمد محمد إبراهيم",
      firstName: "أحمد",
      lastName: "محمد إبراهيم",
      email: "student@sakan.com",
      phone: "01012345678",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "MALE",
      governorate: "القاهرة",
      university: "جامعة عين شمس",
      faculty: "كلية الهندسة",
      major: "هندسة مدنية",
      academicYear: "سنة 3",
      housingStatus: "يبحث عن شريك سكن",
      interests: "عاشق للقراءة، غير مدخن، هادئ",
      bio: "طالب هندسة أبحث عن سكن هادئ ونظيف قريب من الكلية للمذاكرة والتركيز.",
      isActive: true
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: "mariam@sakan.com" },
    update: {
      housingStatus: "يبحث عن شريكة سكن",
      interests: "طبيبة مستقبلية، هادئة، منظمة"
    },
    create: {
      fullName: "مريم علي حسن",
      firstName: "مريم",
      lastName: "علي حسن",
      email: "mariam@sakan.com",
      phone: "01234567890",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "FEMALE",
      governorate: "الجيزة",
      university: "جامعة القاهرة",
      faculty: "كلية الطب البشري",
      major: "طب وجراحة",
      academicYear: "سنة 2",
      housingStatus: "يبحث عن شريكة سكن",
      interests: "طبيبة مستقبلية، هادئة، منظمة",
      bio: "طالبة طب تبحث عن رفيقات سكن هادئات وسكن قريب من قصر العيني.",
      isActive: true
    }
  });

  const student3 = await prisma.user.upsert({
    where: { email: "omar_shafey@sakan.com" },
    update: {
      housingStatus: "يبحث عن شريك سكن",
      interests: "عاشق للتقنية، هادئ، غير مدخن"
    },
    create: {
      fullName: "عمر خالد الشافعي",
      firstName: "عمر",
      lastName: "خالد الشافعي",
      email: "omar_shafey@sakan.com",
      phone: "01555443322",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "MALE",
      governorate: "الإسكندرية",
      university: "جامعة القاهرة",
      faculty: "كلية الهندسة",
      major: "حاسبات واتصالات",
      academicYear: "سنة 3",
      housingStatus: "يبحث عن شريك سكن",
      interests: "عاشق للتقنية، هادئ، غير مدخن",
      bio: "طالب هندسة حاسبات واتصالات بجامعة القاهرة من الإسكندرية.",
      isActive: true
    }
  });

  const student4 = await prisma.user.upsert({
    where: { email: "mostafa_kareem@sakan.com" },
    update: {},
    create: {
      fullName: "مصطفى كريم",
      firstName: "مصطفى",
      lastName: "كريم",
      email: "mostafa_kareem@sakan.com",
      phone: "01188776655",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "MALE",
      governorate: "المنصورة",
      university: "جامعة القاهرة",
      faculty: "كلية الهندسة",
      major: "حاسبات واتصالات",
      academicYear: "سنة 3",
      housingStatus: "لديه سكن حالي / غرفة شاغرة",
      interests: "لاعب كرة قدم، اجتماعي، منظم",
      bio: "لدي غرفة شاغرة في شقة مفروشة راقية بالقرب من الجامعة وأبحث عن زميل ملتزم.",
      isActive: true
    }
  });

  const student5 = await prisma.user.upsert({
    where: { email: "youssef_naggar@sakan.com" },
    update: {},
    create: {
      fullName: "يوسف النجار",
      firstName: "يوسف",
      lastName: "النجار",
      email: "youssef_naggar@sakan.com",
      phone: "01099887766",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "MALE",
      governorate: "طنطا",
      university: "جامعة القاهرة",
      faculty: "كلية الهندسة",
      major: "عمارة",
      academicYear: "سنة 2",
      housingStatus: "يبحث عن شريك سكن",
      interests: "فنان ومصمم، هادئ، محب للموسيقى",
      bio: "طالب عمارة أبحث عن زميل سكن قريب من الكلية للتركيز في المشاريع الهندسية.",
      isActive: true
    }
  });

  const student6 = await prisma.user.upsert({
    where: { email: "ziad_badr@sakan.com" },
    update: {},
    create: {
      fullName: "زياد بدر",
      firstName: "زياد",
      lastName: "بدر",
      email: "ziad_badr@sakan.com",
      phone: "01277665544",
      passwordHash,
      role: UserRole.STUDENT,
      gender: "MALE",
      governorate: "الإسماعيلية",
      university: "جامعة القاهرة",
      faculty: "كلية الهندسة",
      major: "مدنية",
      academicYear: "سنة 4",
      housingStatus: "لديه سكن بالمهندسين",
      interests: "رياضي، مهتم بالدراسة، غير مدخن",
      bio: "أسكن في شقة بالمهندسين ومتاح سرير في غرفة ثنائية لطالب ملتزم.",
      isActive: true
    }
  });

  // 3. Seed Properties
  console.log("👉 Seeding properties and rooms...");

  // Update existing properties with rating, isVerified, distanceFromUniversity
  await prisma.property.updateMany({
    data: {
      isVerified: true,
      rating: 4.9,
      reviewsCount: 19,
      distanceFromUniversity: "5 دقائق من الجامعة"
    }
  });

  const existingPropCount = await prisma.property.count();
  if (existingPropCount === 0) {
    // Property 1: Male Student Housing in Nasr City
    const property1 = await prisma.property.create({
      data: {
        ownerId: owner1.id,
        title: "سكن الفخامة لطلاب الهندسة - مدينة نصر",
        description: "سكن طلابي متكامل على أعلى مستوى، مجهز بإنترنت فائق السرعة، غرف هادئة للدراسة، وخدمة نظافة أسبوعية. يبعد 10 دقائق فقط عن هندسة عين شمس ومحطة المترو.",
        propertyType: PropertyType.STUDENT_HOUSING,
        genderPolicy: GenderPolicy.MALE,
        city: "القاهرة",
        area: "مدينة نصر",
        address: "شارع عباس العقاد، متفرع من شارع الطيران، مدينة نصر",
        latitude: 30.0594,
        longitude: 31.3415,
        viewsCount: 145,
        isActive: true,
        images: {
          create: [
            { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 },
            { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
            { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80", sortOrder: 2 }
          ]
        },
        rooms: {
          create: [
            {
              name: "غرفة فردية VIP (مكيف هواء ومكتب خاص)",
              description: "غرفة مستقلة لشخص واحد مع سرير مريح، مكتب دراسي، دولاب خاص، وتكييف هواء.",
              capacity: 1,
              occupiedBeds: 0,
              monthlyPrice: 3200,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            },
            {
              name: "غرفة ثنائية واسعة (سريرين ودولابين)",
              description: "غرفة مشتركة لطالبين مجهزة بسريرين منفصلين ومكتبين للمذاكرة وشرفة مطلة.",
              capacity: 2,
              occupiedBeds: 1,
              monthlyPrice: 2100,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            }
          ]
        }
      },
      include: { rooms: true }
    });

    // Property 2: Female Shared Apartment in Dokki
    const property2 = await prisma.property.create({
      data: {
        ownerId: owner2.id,
        title: "شقة طالبات راقية ومجهزة بالكامل - الدقي",
        description: "شقة سكنية هادئة جداً مخصصة للطالبات بالقرب من جامعة القاهرة ومستشفيات قصر العيني. أمن وحراسة 24 ساعة، بيئة مناسبة للدراسة، ومطبخ مجهز بالكامل.",
        propertyType: PropertyType.SHARED_APARTMENT,
        genderPolicy: GenderPolicy.FEMALE,
        city: "الجيزة",
        area: "الدقي",
        address: "شارع مصدق، بالقرب من محطة مترو الدقي",
        latitude: 30.0384,
        longitude: 31.2115,
        viewsCount: 98,
        isActive: true,
        images: {
          create: [
            { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 },
            { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
            { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80", sortOrder: 2 }
          ]
        },
        rooms: {
          create: [
            {
              name: "غرفة ماستر مع حمام خاص",
              description: "غرفة واسعة بها حمام خاص وتكييف ودولاب ملابس كبير وشرفة خاصة.",
              capacity: 1,
              occupiedBeds: 0,
              monthlyPrice: 3800,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            },
            {
              name: "غرفة ثنائية لطالبات الطب",
              description: "غرفة مشتركة مريحة وهادئة مصممة للدراسة لفتاتين.",
              capacity: 2,
              occupiedBeds: 0,
              monthlyPrice: 2400,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            }
          ]
        }
      },
      include: { rooms: true }
    });

    // Property 3: Modern Apartment in New Cairo
    const property3 = await prisma.property.create({
      data: {
        ownerId: owner1.id,
        title: "استوديو فاخر مفروش بالكامل - التجمع الخامس",
        description: "استوديو حديث وفاخر قريب جداً من الجامعة الألمانية (GUC) والجامعة الأمريكية (AUC). إنترنت سريع، فرش فندقي، موقف سيارات، ومحيط هادئ وآمن.",
        propertyType: PropertyType.APARTMENT,
        genderPolicy: GenderPolicy.MIXED,
        city: "القاهرة",
        area: "التجمع الخامس",
        address: "الحي الأول، بالقرب من شارع التسعين الجنوبي",
        latitude: 30.0074,
        longitude: 31.4312,
        viewsCount: 230,
        isActive: true,
        images: {
          create: [
            { url: "https://images.unsplash.com/photo-1502005229762-ae1b46b20285?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 },
            { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 }
          ]
        },
        rooms: {
          create: [
            {
              name: "الاستوديو بالكامل (سرير كينج + ركن معيشة)",
              description: "شقة استوديو كاملة تشمل مساحة للنوم ومكتب عمل ومطبخ أمريكي وحمام خاص.",
              capacity: 2,
              occupiedBeds: 0,
              monthlyPrice: 5500,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            }
          ]
        }
      },
      include: { rooms: true }
    });

    // Property 4: Male Student Housing in Shoubra
    const property4 = await prisma.property.create({
      data: {
        ownerId: owner1.id,
        title: "سكن النخبة الجامعي - شبرا (أمام كلية الهندسة)",
        description: "سكن شبابي اقتصادي ومريح بجوار هندسة شبرا مباشرة. بالقرب من جميع المواصلات ومحطة المترو، شامل الفواتير والإنترنت.",
        propertyType: PropertyType.STUDENT_HOUSING,
        genderPolicy: GenderPolicy.MALE,
        city: "القاهرة",
        area: "شبرا",
        address: "شارع شبرا الرئيسي، بالقرب من محطة مترو روض الفرج",
        latitude: 30.0821,
        longitude: 31.2465,
        viewsCount: 64,
        isActive: true,
        images: {
          create: [
            { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }
          ]
        },
        rooms: {
          create: [
            {
              name: "غرفة ثلاثية اقتصادية",
              description: "سكن اقتصادي لـ 3 طلاب مع دواليب ومكاتب مذاكرة.",
              capacity: 3,
              occupiedBeds: 1,
              monthlyPrice: 1500,
              isActive: true,
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", sortOrder: 0 }
                ]
              }
            }
          ]
        }
      },
      include: { rooms: true }
    });

    // 4. Link Amenities to Properties
    console.log("👉 Linking amenities...");
    const popularAmenities = ["WiFi", "Air Conditioning", "Washing Machine", "Kitchen", "Refrigerator", "Elevator", "Security", "Study Area"];
    for (const prop of [property1, property2, property3, property4]) {
      for (const name of popularAmenities) {
        const amenityId = amenityMap.get(name);
        if (amenityId) {
          await prisma.propertyAmenity.upsert({
            where: { propertyId_amenityId: { propertyId: prop.id, amenityId } },
            update: {},
            create: { propertyId: prop.id, amenityId }
          });
        }
      }
    }

    // 5. Seed Booking Requests
    console.log("👉 Seeding booking requests...");
    const p1Room1 = property1.rooms[0];
    const p2Room1 = property2.rooms[0];

    const booking1 = await prisma.bookingRequest.create({
      data: {
        studentId: student1.id,
        propertyId: property1.id,
        roomId: p1Room1.id,
        status: BookingStatus.PENDING,
        message: "مرحباً، أود حجز الغرفة الفردية للفصل الدراسي القادم، أنا طالب بالفرقة الثالثة بهندسة عين شمس."
      }
    });

    const booking2 = await prisma.bookingRequest.create({
      data: {
        studentId: student2.id,
        propertyId: property2.id,
        roomId: p2Room1.id,
        status: BookingStatus.APPROVED,
        message: "أرغب في حجز الغرفة الماستر لمدة عام دراسي كامل تبدأ من الشهر القادم.",
        reviewedById: owner2.id,
        reviewedAt: new Date()
      }
    });

    // 6. Seed Favorites
    console.log("👉 Seeding favorites...");
    await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: student1.id, propertyId: property1.id } },
      update: {},
      create: { userId: student1.id, propertyId: property1.id }
    });

    await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: student1.id, propertyId: property3.id } },
      update: {},
      create: { userId: student1.id, propertyId: property3.id }
    });

    await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: student2.id, propertyId: property2.id } },
      update: {},
      create: { userId: student2.id, propertyId: property2.id }
    });

    // 7. Seed Notifications
    console.log("👉 Seeding notifications...");
    await prisma.notification.create({
      data: {
        userId: owner1.id,
        type: NotificationType.NEW_BOOKING_REQUEST,
        title: "طلب حجز جديد",
        body: `قام الطالب أحمد محمد إبراهيم بتقديم طلب حجز للغرفة: ${p1Room1.name}`,
        metadata: { bookingId: booking1.id, propertyId: property1.id }
      }
    });

    await prisma.notification.create({
      data: {
        userId: student2.id,
        type: NotificationType.BOOKING_APPROVED,
        title: "تمت الموافقة على طلب الحجز 🎉",
        body: `وافق صاحب السكن د. سمير المنشاوي على طلب حجزك في: ${property2.title}`,
        metadata: { bookingId: booking2.id, propertyId: property2.id }
      }
    });
  }

  console.log("=================================================");
  console.log("🎉 Database seeding completed successfully!");
  console.log("📋 Test Accounts Available (All passwords: Password123):");
  console.log("   👨‍🎓 Student 1: student@sakan.com");
  console.log("   👩‍🎓 Student 2: mariam@sakan.com");
  console.log("   👨‍🎓 Student 3: omar@sakan.com");
  console.log("   🏠 Owner 1:   owner@sakan.com");
  console.log("   🏠 Owner 2:   owner2@sakan.com");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
