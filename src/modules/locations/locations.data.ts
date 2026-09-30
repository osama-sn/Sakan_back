export interface AreaItem {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface CityLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  areas: AreaItem[];
}

export const EGYPT_LOCATIONS: CityLocation[] = [
  {
    id: "cairo",
    nameAr: "القاهرة",
    nameEn: "Cairo",
    areas: [
      { id: "nasr-city", nameAr: "مدينة نصر", nameEn: "Nasr City" },
      { id: "heliopolis", nameAr: "مصر الجديدة", nameEn: "Heliopolis" },
      { id: "new-cairo", nameAr: "التجمع الخامس / القاهرة الجديدة", nameEn: "New Cairo / 5th Settlement" },
      { id: "first-settlement", nameAr: "التجمع الأول", nameEn: "1st Settlement" },
      { id: "third-settlement", nameAr: "التجمع الثالث", nameEn: "3rd Settlement" },
      { id: "rehab-city", nameAr: "الرحاب", nameEn: "Al Rehab" },
      { id: "madinaty", nameAr: "مدينتي", nameEn: "Madinaty" },
      { id: "shorouk-city", nameAr: "مدينة الشروق", nameEn: "El Shorouk City" },
      { id: "badr-city", nameAr: "مدينة بدر", nameEn: "Badr City" },
      { id: "maadi", nameAr: "المعادي", nameEn: "Maadi" },
      { id: "zahraa-maadi", nameAr: "زهراء المعادي", nameEn: "Zahraa El Maadi" },
      { id: "abbassia", nameAr: "العباسية", nameEn: "Abbassia" },
      { id: "ain-shams", nameAr: "عين شمس", nameEn: "Ain Shams" },
      { id: "helwan", nameAr: "حلوان", nameEn: "Helwan" },
      { id: "hadayek-helwan", nameAr: "حدائق حلوان", nameEn: "Hadayek Helwan" },
      { id: "el-manial", nameAr: "المنيل / الروضة", nameEn: "El Manial" },
      { id: "shubra", nameAr: "شبرا مصر", nameEn: "Shubra" },
      { id: "zaytoun", nameAr: "الزيتون", nameEn: "El Zaytoun" },
      { id: "downtown", nameAr: "وسط البلد / التحرير", nameEn: "Downtown / Tahrir" },
      { id: "mokattam", nameAr: "المقطم", nameEn: "Mokattam" },
      { id: "sayeda-zeinab", nameAr: "السيدة زينب", nameEn: "Sayeda Zeinab" },
      { id: "zamalek", nameAr: "الزمالك", nameEn: "Zamalek" },
      { id: "hadayek-kobba", nameAr: "حدائق القبة", nameEn: "Hadayek El Kobba" },
      { id: "new-heliopolis", nameAr: "هليوبوليس الجديدة", nameEn: "New Heliopolis" },
      { id: "future-city", nameAr: "مدينة المستقبل", nameEn: "Mostakbal City" }
    ]
  },
  {
    id: "giza",
    nameAr: "الجيزة",
    nameEn: "Giza",
    areas: [
      { id: "dokki", nameAr: "الدقي", nameEn: "Dokki" },
      { id: "mohandessin", nameAr: "المهندسين", nameEn: "Mohandessin" },
      { id: "bain-el-sarayat", nameAr: "بين السرايات (أمام جامعة القاهرة)", nameEn: "Bain El Sarayat" },
      { id: "giza-square", nameAr: "ميدان الجيزة / شارع الجامعة", nameEn: "Giza Square / University St" },
      { id: "october-6", nameAr: "مدينة 6 أكتوبر", nameEn: "6th of October City" },
      { id: "sheikh-zayed", nameAr: "الشيخ زايد", nameEn: "Sheikh Zayed" },
      { id: "hadayek-october", nameAr: "حدائق أكتوبر", nameEn: "Hadayek October" },
      { id: "october-gardens", nameAr: "أكتوبر الجديدة", nameEn: "New October" },
      { id: "faisal", nameAr: "فيصل", nameEn: "Faisal" },
      { id: "haram", nameAr: "الهرم", nameEn: "Haram" },
      { id: "hadayek-ahram", nameAr: "حدائق الأهرام (البوابة)", nameEn: "Hadayek El Ahram" },
      { id: "omraniya", nameAr: "العمرانية", nameEn: "El Omraniya" },
      { id: "kit-kat", nameAr: "الكيت كات / إمبابة", nameEn: "Kit Kat / Imbaba" },
      { id: "agouza", nameAr: "العجوزة", nameEn: "Agouza" },
      { id: "smart-village", nameAr: "القرية الذكية", nameEn: "Smart Village" }
    ]
  },
  {
    id: "alexandria",
    nameAr: "الإسكندرية",
    nameEn: "Alexandria",
    areas: [
      { id: "shatby", nameAr: "الشاطبي (مجمع كليات الجامعة)", nameEn: "Shatby" },
      { id: "azarita", nameAr: "الأزاريطة (المجمع الطبي)", nameEn: "Azarita" },
      { id: "smouha", nameAr: "سموحة", nameEn: "Smouha" },
      { id: "sidi-gaber", nameAr: "سيدي جابر", nameEn: "Sidi Gaber" },
      { id: "ibrahimiya", nameAr: "الإبراهيمية", nameEn: "Ibrahimia" },
      { id: "camp-cesar", nameAr: "كامب شيزار", nameEn: "Camp Cesar" },
      { id: "cleopatra", nameAr: "كليوباترا", nameEn: "Cleopatra" },
      { id: "gleem", nameAr: "جليم", nameEn: "Gleem" },
      { id: "loran", nameAr: "لوران", nameEn: "Loran" },
      { id: "miami", nameAr: "ميامي", nameEn: "Miami" },
      { id: "sidi-bishr", nameAr: "سيدي بشر", nameEn: "Sidi Bishr" },
      { id: "asafra", nameAr: "العصافرة", nameEn: "Asafra" },
      { id: "mandara", nameAr: "المندرة", nameEn: "Mandara" },
      { id: "rushdy", nameAr: "رشدي", nameEn: "Rushdy" },
      { id: "moharam-bek", nameAr: "محرم بك", nameEn: "Moharam Bek" },
      { id: "borg-el-arab", nameAr: "برج العرب الجديدة (الجامعة اليابانية)", nameEn: "New Borg El Arab" }
    ]
  },
  {
    id: "dakahlia",
    nameAr: "الدقهلية (المنصورة)",
    nameEn: "Dakahlia (Mansoura)",
    areas: [
      { id: "university-district", nameAr: "حي الجامعة", nameEn: "University District" },
      { id: "gehan-street", nameAr: "شارع جيهان (بوابة الجامعة)", nameEn: "Gehan Street" },
      { id: "teraa-street", nameAr: "شارع الترعة", nameEn: "El Teraa Street" },
      { id: "ahmed-maher", nameAr: "شارع أحمد ماهر", nameEn: "Ahmed Maher Street" },
      { id: "mashaya", nameAr: "المشاية السفلية / العلوية", nameEn: "El Mashaya" },
      { id: "tourel", nameAr: "توريل", nameEn: "Tourel" },
      { id: "koleyet-adab", nameAr: "منطقة كلية الآداب القديمة", nameEn: "Faculty of Arts Area" },
      { id: "samia-el-gamal", nameAr: "شارع سامية الجمل", nameEn: "Samia El Gamal" },
      { id: "obour-mansoura", nameAr: "مساكن العبور", nameEn: "El Obour" },
      { id: "sandoub", nameAr: "سندوب", nameEn: "Sandoub" },
      { id: "talkha", nameAr: "طلخا", nameEn: "Talkha" },
      { id: "gamasa", nameAr: "جمصة (جامعة المنصورة الأهلية/الدلتا)", nameEn: "Gamasa" }
    ]
  },
  {
    id: "gharbia",
    nameAr: "الغربية (طنطا)",
    nameEn: "Gharbia (Tanta)",
    areas: [
      { id: "geish-street", nameAr: "شارع الجيش", nameEn: "El Geish Street" },
      { id: "bahr-street", nameAr: "شارع البحر", nameEn: "El Bahr Street" },
      { id: "nahas-street", nameAr: "شارع النحاس", nameEn: "El Nahas Street" },
      { id: "estad", nameAr: "منطقة الاستاد", nameEn: "El Estad" },
      { id: "seberbay", nameAr: "سبرباي (مجمع كليات سبرباي)", nameEn: "Seberbay Campus" },
      { id: "kafr-essam", nameAr: "كفر عصام (بجوار المجمع الطبي)", nameEn: "Kafr Essam" },
      { id: "helwa-street", nameAr: "شارع الحلو", nameEn: "El Helw Street" },
      { id: "moheb-street", nameAr: "شارع محب", nameEn: "Moheb Street" },
      { id: "mahalla-kobra", nameAr: "المحلة الكبرى", nameEn: "El Mahalla El Kubra" }
    ]
  },
  {
    id: "qalyubia",
    nameAr: "القليوبية (بنها)",
    nameEn: "Qalyubia (Banha)",
    areas: [
      { id: "el-felal", nameAr: "منطقة الفلل (كورنيش النيل)", nameEn: "El Felal" },
      { id: "el-ahram", nameAr: "شارع الأهرام", nameEn: "El Ahram Street" },
      { id: "kafr-el-gazar", nameAr: "كفر الجزار", nameEn: "Kafr El Gazar" },
      { id: "kafr-el-saraya", nameAr: "كفر السرايا (خلف هندسة بنها)", nameEn: "Kafr El Saraya" },
      { id: "el-mansheya", nameAr: "المنشية الجديدة", nameEn: "El Mansheya" },
      { id: "el-obour-city", nameAr: "مدينة العبور (جامعة بنها الأهلية)", nameEn: "El Obour City" },
      { id: "shubra-el-kheima", nameAr: "شبرا الخيمة", nameEn: "Shubra El Kheima" },
      { id: "toukh", nameAr: "طوخ / مشتهر (كلية الزراعة والبيطري)", nameEn: "Moshtohor" }
    ]
  },
  {
    id: "sharqia",
    nameAr: "الشرقية (الزقازيق)",
    nameEn: "Sharqia (Zagazig)",
    areas: [
      { id: "el-qawmeya", nameAr: "حي القومية", nameEn: "El Qawmeya" },
      { id: "university-villas", nameAr: "فلل الجامعة", nameEn: "University Villas" },
      { id: "el-mohafza-street", nameAr: "شارع المحافظة", nameEn: "El Mohafza Street" },
      { id: "el-montazah", nameAr: "المنتزه", nameEn: "El Montazah" },
      { id: "el-sayadeen", nameAr: "الصيادين", nameEn: "El Sayadeen" },
      { id: "el-zohoor", nameAr: "حي الزهور", nameEn: "El Zohoor" },
      { id: "tenth-of-ramadan", nameAr: "مدينة العاشر من رمضان", nameEn: "10th of Ramadan City" },
      { id: "salheya-new", nameAr: "الصالحية الجديدة (جامعة الصالحية)", nameEn: "New Salhia" }
    ]
  },
  {
    id: "monufia",
    nameAr: "المنوفية (شبين الكوم / السادات)",
    nameEn: "Monufia",
    areas: [
      { id: "east-bank", nameAr: "شبين الكوم - البر الشرقي", nameEn: "Shibin El Kom - East Bank" },
      { id: "west-bank", nameAr: "شبين الكوم - البر الغربي", nameEn: "Shibin El Kom - West Bank" },
      { id: "colleges-complex", nameAr: "مجمع الكليات والمستشفيات", nameEn: "Colleges Complex" },
      { id: "sadat-city", nameAr: "مدينة السادات (جامعة مدينة السادات)", nameEn: "Sadat City" },
      { id: "menouf", nameAr: "منوف (كلية الهندسة الإلكترونية)", nameEn: "Menouf" },
      { id: "ashmoun", nameAr: "أشمون", nameEn: "Ashmoun" }
    ]
  },
  {
    id: "assiut",
    nameAr: "أسيوط",
    nameEn: "Assiut",
    areas: [
      { id: "el-walidiya", nameAr: "الوليدية (أمام بوابات جامعة أسيوط)", nameEn: "El Walidiya" },
      { id: "gomhoureya-street", nameAr: "شارع الجمهورية", nameEn: "El Gomhoureya Street" },
      { id: "yousri-ragheb", nameAr: "شارع يسري راغب", nameEn: "Yousri Ragheb Street" },
      { id: "nazlet-abdellah", nameAr: "نزلة عبد اللاه", nameEn: "Nazlet Abd Ellah" },
      { id: "feryal", nameAr: "حي فريال", nameEn: "Feryal" },
      { id: "sadat-assiut", nameAr: "حي السادات", nameEn: "Sadat District" },
      { id: "nemees", nameAr: "شارع النميس", nameEn: "Nemees Street" },
      { id: "new-assiut", nameAr: "مدينة أسيوط الجديدة (جامعة أسيوط الأهلية/سفنكس)", nameEn: "New Assiut City" }
    ]
  },
  {
    id: "beni-suef",
    nameAr: "بني سويف",
    nameEn: "Beni Suef",
    areas: [
      { id: "east-nile", nameAr: "بني سويف الجديدة / شرق النيل (مجمع الجامعة)", nameEn: "East Nile / New Beni Suef" },
      { id: "old-beni-suef", nameAr: "بني سويف القديمة / الجزيرة", nameEn: "Old Beni Suef" },
      { id: "abdel-salam-aref", nameAr: "شارع عبد السلام عارف", nameEn: "Abdel Salam Aref Street" },
      { id: "moqbel", nameAr: "حي مقبل", nameEn: "Moqbel District" },
      { id: "el-hamraya", nameAr: "الحمرايا", nameEn: "El Hamraya" }
    ]
  },
  {
    id: "fayoum",
    nameAr: "الفيوم",
    nameEn: "Fayoum",
    areas: [
      { id: "keman-fares", nameAr: "كيمان فارس (محيط جامعة الفيوم)", nameEn: "Keman Fares" },
      { id: "el-masala", nameAr: "المسلة", nameEn: "El Masala" },
      { id: "dalla", nameAr: "منطقة دلة", nameEn: "Dalla Area" },
      { id: "baghous", nameAr: "حي باغوص", nameEn: "Baghous District" },
      { id: "lotfallah", nameAr: "حي لطف الله", nameEn: "Lotfallah District" },
      { id: "new-fayoum", nameAr: "الفيوم الجديدة", nameEn: "New Fayoum" }
    ]
  },
  {
    id: "minya",
    nameAr: "المنيا",
    nameEn: "Minya",
    areas: [
      { id: "shalaby", nameAr: "منطقة شلبي (بوابة جامعة المنيا الرئيسية)", nameEn: "Shalaby" },
      { id: "ard-sultan", nameAr: "أرض سلطان", nameEn: "Ard Sultan" },
      { id: "taha-hussein", nameAr: "شارع طه حسين", nameEn: "Taha Hussein Street" },
      { id: "sekket-tala", nameAr: "سكة تله", nameEn: "Sekket Tala" },
      { id: "new-minya", nameAr: "مدينة المنيا الجديدة (جامعة المنيا الأهلية/دراية)", nameEn: "New Minya City" }
    ]
  },
  {
    id: "sohag",
    nameAr: "سوهاج",
    nameEn: "Sohag",
    areas: [
      { id: "new-sohag", nameAr: "مدينة سوهاج الجديدة / الكوامل (مقر الجامعة)", nameEn: "New Sohag / El Kawamel" },
      { id: "nasr-city-sohag", nameAr: "مدينة ناصر", nameEn: "Nasr City (Sohag)" },
      { id: "makhbaz-aly", nameAr: "منطقة المخبز الآلي", nameEn: "El Makhbaz El Aly" },
      { id: "street-15", nameAr: "شارع 15", nameEn: "15th Street" },
      { id: "shark-teraa", nameAr: "شرق الترعة", nameEn: "Sharq El Teraa" }
    ]
  },
  {
    id: "qena",
    nameAr: "قنا",
    nameEn: "Qena",
    areas: [
      { id: "south-valley-univ", nameAr: "محيط جامعة جنوب الوادي", nameEn: "South Valley University Area" },
      { id: "hod-10", nameAr: "منطقة حوض 10", nameEn: "Hod 10" },
      { id: "shooun", nameAr: "حي الشؤون", nameEn: "El Sho'oun District" },
      { id: "new-qena", nameAr: "مدينة قنا الجديدة", nameEn: "New Qena City" }
    ]
  },
  {
    id: "aswan",
    nameAr: "أسوان",
    nameEn: "Aswan",
    areas: [
      { id: "sahari", nameAr: "صحاري (مقر جامعة أسوان)", nameEn: "Sahari" },
      { id: "new-aswan", nameAr: "مدينة أسوان الجديدة", nameEn: "New Aswan City" },
      { id: "akkad", nameAr: "حي العقاد", nameEn: "El Akkad District" },
      { id: "sadat-road", nameAr: "طريق السادات", nameEn: "Sadat Road" },
      { id: "atlas", nameAr: "حي أطلس", nameEn: "Atlas District" }
    ]
  },
  {
    id: "ismailia",
    nameAr: "الإسماعيلية",
    nameEn: "Ismailia",
    areas: [
      { id: "sheikh-zayed-ismailia", nameAr: "حي الشيخ زايد (محيط جامعة قناة السويس)", nameEn: "Sheikh Zayed District" },
      { id: "old-university-ismailia", nameAr: "محيط الجامعة القديمة", nameEn: "Old University Area" },
      { id: "fifth-district", nameAr: "الحي الخامس", nameEn: "5th District" },
      { id: "arayesheya", nameAr: "عرايشية مصر", nameEn: "Arayesheya" },
      { id: "salam-district", nameAr: "حي السلام", nameEn: "El Salam District" },
      { id: "new-ismailia", nameAr: "الإسماعيلية الجديدة (جامعة قناة السويس الأهلية)", nameEn: "New Ismailia" }
    ]
  },
  {
    id: "port-said",
    nameAr: "بورسعيد",
    nameEn: "Port Said",
    areas: [
      { id: "port-fouad", nameAr: "بورفؤاد (مقر كليات جامعة بورسعيد)", nameEn: "Port Fouad" },
      { id: "zohoor-port-said", nameAr: "حي الزهور", nameEn: "El Zohoor District" },
      { id: "sharq-port-said", nameAr: "حي الشرق", nameEn: "El Sharq District" },
      { id: "arab-port-said", nameAr: "حي العرب", nameEn: "El Arab District" },
      { id: "manakh-port-said", nameAr: "حي المناخ", nameEn: "El Manakh District" },
      { id: "dowahey", nameAr: "حي الضواحي", nameEn: "El Dowahey District" }
    ]
  },
  {
    id: "suez",
    nameAr: "السويس",
    nameEn: "Suez",
    areas: [
      { id: "salam-suez", nameAr: "السلام 1 و 2 (محيط جامعة السويس)", nameEn: "El Salam 1 & 2" },
      { id: "arbaeen", nameAr: "حي الأربعين", nameEn: "El Arbaeen District" },
      { id: "suez-district", nameAr: "حي السويس", nameEn: "El Suez District" },
      { id: "faisal-suez", nameAr: "حي فيصل", nameEn: "Faisal District" },
      { id: "tawfiq", nameAr: "مدينة التوفيق", nameEn: "El Tawfiq City" },
      { id: "galala-city", nameAr: "هضبة الجلالة (جامعة الجلالة الدولية)", nameEn: "Galala City" }
    ]
  },
  {
    id: "kafr-el-sheikh",
    nameAr: "كفر الشيخ",
    nameEn: "Kafr El Sheikh",
    areas: [
      { id: "sakha", nameAr: "سخا (محيط كليات الجامعة)", nameEn: "Sakha" },
      { id: "qantara-baydaa", nameAr: "القنطرة البيضاء", nameEn: "El Qantara El Baydaa" },
      { id: "moharebeen", nameAr: "تقسيم المحاربين الجديدة", nameEn: "Moharebeen Division" },
      { id: "zohoor-kafr", nameAr: "حي الزهور", nameEn: "El Zohoor District" },
      { id: "nabawi-mohandes", nameAr: "شارع النبوي المهندس", nameEn: "El Nabawi El Mohandes" }
    ]
  },
  {
    id: "damietta",
    nameAr: "دمياط",
    nameEn: "Damietta",
    areas: [
      { id: "new-damietta", nameAr: "دمياط الجديدة (مقر جامعة دمياط وجامعة حورس)", nameEn: "New Damietta" },
      { id: "old-damietta", nameAr: "دمياط القديمة", nameEn: "Old Damietta" },
      { id: "ras-el-bar", nameAr: "رأس البر", nameEn: "Ras El Bar" },
      { id: "aasar", nameAr: "الأعصر", nameEn: "El Aasar" }
    ]
  },
  {
    id: "beheira",
    nameAr: "البحيرة (دمنهور)",
    nameEn: "Beheira (Damanhour)",
    areas: [
      { id: "abaadeya", nameAr: "الأبعادية (مجمع كليات جامعة دمنهور)", nameEn: "El Abaadeya Campus" },
      { id: "shubra-damanhour", nameAr: "حي شبرا", nameEn: "Shubra (Damanhour)" },
      { id: "abu-el-reesh", nameAr: "أبو الريش", nameEn: "Abu El Reesh" },
      { id: "madreb-roz", nameAr: "مضرب الأرز", nameEn: "Madreb El Roz" },
      { id: "nubariya", nameAr: "النوبارية الجديدة (جامعة السادات/دمنهور الزراعية)", nameEn: "New Nubariya" }
    ]
  },
  {
    id: "matrouh",
    nameAr: "مطروح (العلمين / مرسى مطروح)",
    nameEn: "Matrouh",
    areas: [
      { id: "new-alamein", nameAr: "العلمين الجديدة (جامعة العلمين الدولية)", nameEn: "New Alamein City" },
      { id: "marsa-matrouh", nameAr: "مرسى مطروح (جامعة مطروح)", nameEn: "Marsa Matrouh City" },
      { id: "el-kilo-4", nameAr: "الكيلو 4 والكيلو 7 (مجمع الكليات)", nameEn: "Kilo 4 / Kilo 7" }
    ]
  },
  {
    id: "red-sea",
    nameAr: "البحر الأحمر (الغردقة)",
    nameEn: "Red Sea (Hurghada)",
    areas: [
      { id: "hurghada-univ", nameAr: "محيط فرع جامعة جنوب الوادي بالغردقة", nameEn: "Hurghada University Area" },
      { id: "el-ahyaa", nameAr: "منطقة الأحياء", nameEn: "El Ahyaa" },
      { id: "el-kawthar", nameAr: "منطقة الكوثر", nameEn: "El Kawthar" },
      { id: "el-dahar", nameAr: "الدهار", nameEn: "El Dahar" }
    ]
  },
  {
    id: "north-sinai",
    nameAr: "شمال سيناء (العريش)",
    nameEn: "North Sinai (Arish)",
    areas: [
      { id: "el-masaeed", nameAr: "المساعيد (جامعة العريش وجامعة سيناء)", nameEn: "El Masaeed" },
      { id: "dahyet-el-salam", nameAr: "ضاحية السلام", nameEn: "Dahyet El Salam" },
      { id: "el-fawakhriya", nameAr: "الفواخرية", nameEn: "El Fawakhriya" }
    ]
  },
  {
    id: "south-sinai",
    nameAr: "جنوب سيناء",
    nameEn: "South Sinai",
    areas: [
      { id: "tor-sinai", nameAr: "طور سيناء (جامعة الملك سلمان)", nameEn: "Tor Sinai" },
      { id: "sharm-el-sheikh", nameAr: "شرم الشيخ (فرع جامعة الملك سلمان)", nameEn: "Sharm El Sheikh" },
      { id: "ras-sedr", nameAr: "رأس سدر (فرع جامعة الملك سلمان)", nameEn: "Ras Sedr" }
    ]
  },
  {
    id: "new-valley",
    nameAr: "الوادي الجديد",
    nameEn: "New Valley",
    areas: [
      { id: "el-kharga", nameAr: "الخارجة (مقر جامعة الوادي الجديد)", nameEn: "El Kharga" },
      { id: "el-dakhla", nameAr: "الداخلة", nameEn: "El Dakhla" }
    ]
  }
];
