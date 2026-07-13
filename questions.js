// قاعدة أسئلة واختبارات العينة المضمّنة — تُبنى منها قاعدة البيانات عند كل تشغيل
// (انظر buildQuestionsDB في app.js). أضف الأسئلة الجديدة هنا.

function getSampleQuestions() {
    return [
{
        "id": 1,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "قلم : كتابة",
        "options": [
                "سيارة : طريق",
                "مقص : قطع",
                "كتاب : مكتبة",
                "باب : منزل"
        ],
        "correct": 1,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 2,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "طبيب : مستشفى",
        "options": [
                "معلم : مدرسة",
                "سيارة : شارع",
                "كتاب : ورق",
                "ماء : نهر"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 3,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "سماء : أزرق",
        "options": [
                "عشب : أخضر",
                "شمس : ليل",
                "بحر : سمك",
                "جبل : سهل"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 4,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "أسد : غابة",
        "options": [
                "سمكة : بحر",
                "طائر : ريش",
                "كتاب : قراءة",
                "شمس : ضوء"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 5,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "عين : بصر",
        "options": [
                "أذن : سمع",
                "يد : قدم",
                "رأس : جسم",
                "فم : وجه"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 6,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "نار : حرارة",
        "options": [
                "ثلج : برودة",
                "ماء : كوب",
                "شمس : قمر",
                "ليل : نوم"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 7,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "كتاب : صفحات",
        "options": [
                "شجرة : أوراق",
                "بيت : شارع",
                "سيارة : طريق",
                "قلم : حبر"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 8,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "طائرة : سماء",
        "options": [
                "سفينة : بحر",
                "سيارة : بنزين",
                "قطار : ركاب",
                "دراجة : عجلة"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 9,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "قمر : ليل",
        "options": [
                "شمس : نهار",
                "نجم : سماء",
                "غيم : مطر",
                "برق : رعد"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 10,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "خروف : صوف",
        "options": [
                "دجاجة : بيض",
                "بقرة : حليب",
                "نحلة : عسل",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 11,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "جذر : شجرة",
        "options": [
                "أساس : بناء",
                "سقف : منزل",
                "باب : غرفة",
                "نافذة : جدار"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 12,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "فرح : حزن",
        "options": [
                "نور : ظلام",
                "كتاب : قراءة",
                "ماء : عطش",
                "نوم : راحة"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 13,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "محامي : قضية",
        "options": [
                "طبيب : مريض",
                "مهندس : مبنى",
                "معلم : درس",
                "صحفي : خبر"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 14,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "مفتاح : قفل",
        "options": [
                "كلمة سر : حساب",
                "باب : منزل",
                "سيارة : مفتاح",
                "خزنة : مال"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 15,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "نحلة : خلية",
        "options": [
                "نملة : قرية",
                "عصفور : عش",
                "سمكة : بحر",
                "أسد : غابة"
        ],
        "correct": 1,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 16,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "ساعة : وقت",
        "options": [
                "ميزان : وزن",
                "تلفاز : برنامج",
                "هاتف : اتصال",
                "كمبيوتر : إنترنت"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 17,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "شاعر : قصيدة",
        "options": [
                "رسام : لوحة",
                "مغني : أغنية",
                "كاتب : كتاب",
                "نحات : تمثال"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 18,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "بذرة : شجرة",
        "options": [
                "بيضة : دجاجة",
                "طفل : رجل",
                "يرقة : فراشة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 19,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "سيف : محارب",
        "options": [
                "ريشة : فنان",
                "قلم : كاتب",
                "مطرقة : نجار",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 20,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "مرض : دواء",
        "options": [
                "جوع : طعام",
                "عطش : ماء",
                "تعب : راحة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 21,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "تواضع : غرور",
        "options": [
                "كرم : بخل",
                "صدق : كذب",
                "شجاعة : جبن",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 22,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "مجهر : بكتيريا",
        "options": [
                "تلسكوب : نجوم",
                "نظارة : كتاب",
                "عدسة : صورة",
                "كاميرا : فيلم"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 23,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "موسوعة : معرفة",
        "options": [
                "خزانة : ملابس",
                "مكتبة : كتب",
                "قاموس : كلمات",
                "أرشيف : وثائق"
        ],
        "correct": 2,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 24,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "فقر : ثروة",
        "options": [
                "مرض : صحة",
                "جهل : علم",
                "ضعف : قوة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 25,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "حذاء : قدم",
        "options": [
                "قفاز : يد",
                "قبعة : رأس",
                "نظارة : عين",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 26,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ملك : تاج",
        "options": [
                "شرطي : بزة",
                "طبيب : مريض",
                "معلم : طالب",
                "سائق : سيارة"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 27,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "قمح : خبز",
        "options": [
                "عنب : عصير",
                "بقرة : حليب",
                "شجرة : ظل",
                "نحلة : عسل"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 28,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "إبريق : شاي",
        "options": [
                "كوب : ماء",
                "قدر : طعام",
                "صحن : فاكهة",
                "ملعقة : سكر"
        ],
        "correct": 1,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 29,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "مطبخ : طبخ",
        "options": [
                "حمام : استحمام",
                "غرفة نوم : نوم",
                "مكتب : عمل",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 30,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "فيلسوف : حكمة",
        "options": [
                "عالم : معرفة",
                "شاعر : شعور",
                "فنان : جمال",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 31,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "قاضي : عدل",
        "options": [
                "شرطي : أمن",
                "جندي : دفاع",
                "إطفائي : إنقاذ",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 32,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "كهرباء : مصباح",
        "options": [
                "بنزين : سيارة",
                "غاز : موقد",
                "بطارية : ساعة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 33,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "ذاكرة : نسيان",
        "options": [
                "بصر : عمى",
                "سمع : صمم",
                "نطق : بكم",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 34,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "لقاح : مناعة",
        "options": [
                "تدريب : مهارة",
                "تعليم : معرفة",
                "ممارسة : خبرة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 35,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "بوصلة : اتجاه",
        "options": [
                "خريطة : موقع",
                "ساعة : وقت",
                "مقياس : درجة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 36,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "صيف : حار",
        "options": [
                "شتاء : بارد",
                "ربيع : معتدل",
                "خريف : جاف",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 37,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "سكين : قطع",
        "options": [
                "ملعقة : أكل",
                "شوكة : غرز",
                "كوب : شرب",
                "صحن : تقديم"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 38,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "جملة : كلمات",
        "options": [
                "فقرة : جمل",
                "كتاب : فصول",
                "قصيدة : أبيات",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 39,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "مهندس : تصميم",
        "options": [
                "طبيب : تشخيص",
                "محامي : مرافعة",
                "محاسب : تدقيق",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 40,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "زهرة : باقة",
        "options": [
                "لؤلؤة : عقد",
                "نجمة : مجرة",
                "حبة : سنبلة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 41,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "صباح : مساء",
        "options": [
                "شروق : غروب",
                "بداية : نهاية",
                "يمين : يسار",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 42,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ربيع : زهور",
        "options": [
                "خريف : أوراق",
                "شتاء : ثلج",
                "صيف : شمس",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 43,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "جيش : جندي",
        "options": [
                "شرطة : شرطي",
                "مدرسة : معلم",
                "مستشفى : ممرض",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 44,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "عقل : تفكير",
        "options": [
                "قلب : شعور",
                "عين : رؤية",
                "أذن : سماع",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 45,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "نهر : جسر",
        "options": [
                "طريق : نفق",
                "وادي : سد",
                "جبل : نفق",
                "شارع : رصيف"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 46,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "حرب : سلام",
        "options": [
                "فوضى : نظام",
                "ظلم : عدل",
                "كراهية : حب",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 47,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ملعب : كرة قدم",
        "options": [
                "مسبح : سباحة",
                "ميدان : سباق",
                "صالة : رياضة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 48,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "مزارع : محراث",
        "options": [
                "نجار : منشار",
                "حداد : مطرقة",
                "خياط : إبرة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 49,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "فضيلة : رذيلة",
        "options": [
                "إيمان : كفر",
                "يقين : شك",
                "صلاح : فساد",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 50,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "لحن : موسيقى",
        "options": [
                "لون : رسم",
                "كلمة : شعر",
                "حركة : رقص",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 51,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "طوب : جدار",
        "options": [
                "خرز : عقد",
                "حروف : كلمة",
                "خلايا : نسيج",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 52,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "كرسي : جلوس",
        "options": [
                "سرير : نوم",
                "مكتب : كتابة",
                "أريكة : استرخاء",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 53,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "دقيقة : ساعة",
        "options": [
                "ساعة : يوم",
                "يوم : أسبوع",
                "شهر : سنة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 54,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "قطة : مواء",
        "options": [
                "كلب : نباح",
                "أسد : زئير",
                "عصفور : تغريد",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 55,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "كتاب : مؤلف",
        "options": [
                "لوحة : رسام",
                "مدرسة : طالب",
                "مستشفى : مريض",
                "طريق : سيارة"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 56,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ماء : عطش",
        "options": [
                "طعام : جوع",
                "هواء : تنفس",
                "نوم : تعب",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 57,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "صحراء : جفاف",
        "options": [
                "غابة : رطوبة",
                "بحر : ملوحة",
                "جبل : ارتفاع",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 58,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "شجرة : غابة",
        "options": [
                "نجمة : سماء",
                "قطرة : بحر",
                "حبة : رمال",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 59,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "حقل : قمح",
        "options": [
                "بستان : فاكهة",
                "مصنع : منتج",
                "بحر : سمك",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 60,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "فنان : لوحة",
        "options": [
                "كاتب : رواية",
                "مخرج : فيلم",
                "شاعر : قصيدة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 61,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ورقة : كتاب",
        "options": [
                "طوبة : جدار",
                "خيط : ثوب",
                "حبة : سنبلة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 62,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "طيار : طائرة",
        "options": [
                "بحار : سفينة",
                "سائق : سيارة",
                "قائد : قطار",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 63,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "نار : دخان",
        "options": [
                "شمس : ضوء",
                "مطر : غيم",
                "برق : رعد",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 64,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "جزيرة : محيط",
        "options": [
                "واحة : صحراء",
                "قمة : جبل",
                "منزل : حي",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 65,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "قانون : عدالة",
        "options": [
                "دستور : حرية",
                "أخلاق : فضيلة",
                "تربية : سلوك",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 66,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "وعي : غيبوبة",
        "options": [
                "صحو : نوم",
                "انتباه : سهو",
                "يقظة : غفلة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 67,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "منطق : فلسفة",
        "options": [
                "نحو : لغة",
                "هندسة : رياضيات",
                "تشريح : طب",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 68,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "وصفة : طبيب",
        "options": [
                "حكم : قاضي",
                "أمر : ضابط",
                "قرار : مدير",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 69,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "شهادة : تخرج",
        "options": [
                "جائزة : فوز",
                "ميدالية : إنجاز",
                "وسام : تكريم",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 70,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "تضخم : انكماش",
        "options": [
                "ركود : انتعاش",
                "كساد : ازدهار",
                "هبوط : صعود",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 71,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "مبدأ : تطبيق",
        "options": [
                "قاعدة : استثناء",
                "نظرية : ممارسة",
                "فكر : عمل",
                "خطة : تنفيذ"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 72,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "إشارة : معنى",
        "options": [
                "رمز : دلالة",
                "علامة : مغزى",
                "كلمة : مفهوم",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 73,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "مخطوطة : مطبوعة",
        "options": [
                "يدوي : آلي",
                "قديم : حديث",
                "نادر : شائع",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 74,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "ناطحة سحاب : برج",
        "options": [
                "قصر : منزل",
                "يخت : قارب",
                "طائرة : طائرة ورقية",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 75,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "ديمقراطية : انتخابات",
        "options": [
                "ملكية : وراثة",
                "دكتاتورية : قمع",
                "فوضى : غياب نظام",
                "جمهورية : رئيس"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 76,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "مجهر : خلية",
        "options": [
                "تلسكوب : كوكب",
                "نظارة : حرف",
                "مكبر : صوت",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 77,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "تفاؤل : تشاؤم",
        "options": [
                "أمل : يأس",
                "سعادة : حزن",
                "نور : ظلام",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 78,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "ضوء : مرآة",
        "options": [
                "صوت : صدى",
                "موجة : شاطئ",
                "كرة : حائط",
                "كل ما سبق"
        ],
        "correct": 0,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 79,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "دستور : قوانين",
        "options": [
                "وصفة : مكونات",
                "خريطة : طرق",
                "فهرس : مواضيع",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 80,
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "استنتاج : مقدمات",
        "options": [
                "حصاد : زراعة",
                "نتيجة : سبب",
                "ثمرة : شجرة",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "العلاقة واضحة من السياق"
},
{
        "id": 81,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "العلم نور و______ ظلام",
        "options": [
                "الكتاب",
                "الجهل",
                "القراءة",
                "المعرفة"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 82,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من جد ______ ومن زرع حصد",
        "options": [
                "نجح",
                "وجد",
                "فاز",
                "ربح"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 83,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "الصبر مفتاح ______",
        "options": [
                "النجاح",
                "الفرج",
                "السعادة",
                "الراحة"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 84,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "الوقت كالسيف إن لم تقطعه ______",
        "options": [
                "ذهب",
                "قطعك",
                "ضاع",
                "فات"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 85,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "العقل السليم في الجسم ______",
        "options": [
                "القوي",
                "السليم",
                "الصحي",
                "المتين"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 86,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "رحلة الألف ميل تبدأ بـ ______",
        "options": [
                "خطوة",
                "قرار",
                "حلم",
                "فكرة"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 87,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "الصديق وقت ______",
        "options": [
                "الفرح",
                "الضيق",
                "الحاجة",
                "الشدة"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 88,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "خير الكلام ما قل و______",
        "options": [
                "أفاد",
                "دل",
                "نفع",
                "وضح"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 89,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "لا تؤجل عمل اليوم إلى ______",
        "options": [
                "الأمس",
                "الغد",
                "لاحقاً",
                "وقت آخر"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 90,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "إذا كان الكلام من فضة فالسكوت من ______",
        "options": [
                "ذهب",
                "ماس",
                "لؤلؤ",
                "مرجان"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 91,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من راقب الناس مات ______",
        "options": [
                "حزناً",
                "غماً",
                "هماً",
                "كمداً"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 92,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "ليس الفقير من لا مال له بل من لا ______ له",
        "options": [
                "أصدقاء",
                "أخلاق",
                "علم",
                "عمل"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 93,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "القناعة كنز لا ______",
        "options": [
                "يفنى",
                "ينفد",
                "يزول",
                "ينتهي"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 94,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "في الاتحاد ______",
        "options": [
                "قوة",
                "نجاح",
                "سعادة",
                "خير"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 95,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "الكتاب خير ______",
        "options": [
                "صديق",
                "رفيق",
                "جليس",
                "أنيس"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 96,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "كلما زادت المعرفة ______ التواضع",
        "options": [
                "قل",
                "زاد",
                "انعدم",
                "تراجع"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 97,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "النجاح ليس ______ بل رحلة مستمرة",
        "options": [
                "هدفاً",
                "وجهة",
                "غاية",
                "نهاية"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 98,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "القراءة للعقل كالرياضة ______",
        "options": [
                "للجسم",
                "للروح",
                "للنفس",
                "للصحة"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 99,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الإنسان ______ بعمله لا بقوله",
        "options": [
                "يُعرف",
                "يُقاس",
                "يُحكم",
                "يُقيّم"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 100,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "التاريخ يعيد ______ لمن لا يتعلم منه",
        "options": [
                "نفسه",
                "أحداثه",
                "دروسه",
                "عبره"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 101,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الحرية تعني ______ المسؤولية",
        "options": [
                "غياب",
                "تحمل",
                "رفض",
                "تجاهل"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 102,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "كل تجربة فاشلة هي ______ نحو النجاح",
        "options": [
                "عائق",
                "خطوة",
                "تراجع",
                "انتكاسة"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 103,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الإصلاح يبدأ من ______ قبل الخارج",
        "options": [
                "الداخل",
                "الأعلى",
                "القمة",
                "الأساس"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 104,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "التسامح علامة ______ لا الضعف",
        "options": [
                "القوة",
                "الحكمة",
                "الصبر",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 105,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الاختلاف في الرأي لا ______ للود قضية",
        "options": [
                "يفسد",
                "يمثل",
                "يشكل",
                "يكون"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 106,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "العلم في الصغر كالنقش على ______",
        "options": [
                "الماء",
                "الورق",
                "الحجر",
                "الخشب"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 107,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "أعدل الناس من أنصف من ______",
        "options": [
                "عدوه",
                "نفسه",
                "غيره",
                "ظالمه"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 108,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الأمم لا تُبنى بالأماني بل بـ ______",
        "options": [
                "الأحلام",
                "العمل",
                "الكلام",
                "الانتظار"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 109,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "المثقف الحقيقي من يُغيّر ______ لا من يُغيّر ملابسه",
        "options": [
                "مكانه",
                "أفكاره",
                "أصدقاءه",
                "بيئته"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 110,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الاستثمار الحقيقي هو الاستثمار في ______",
        "options": [
                "المال",
                "العقارات",
                "الإنسان",
                "الذهب"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 111,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "العدالة الاجتماعية تتطلب ______ الفرص بين الجميع",
        "options": [
                "تفاوت",
                "تكافؤ",
                "تباين",
                "اختلاف"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 112,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الديمقراطية الحقيقية تقوم على مبدأ ______ السلطات",
        "options": [
                "توحيد",
                "تركيز",
                "فصل",
                "دمج"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 113,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الإبداع ينمو في بيئة تشجع على ______ والتجريب",
        "options": [
                "التقليد",
                "المحاكاة",
                "المخاطرة",
                "التكرار"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 114,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الثقافة الحقيقية تتجلى في ______ لا في الشهادات",
        "options": [
                "السلوك",
                "المظهر",
                "الكلام",
                "المنصب"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 115,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "السلطة المطلقة ______ مطلقاً",
        "options": [
                "تصلح",
                "تفسد",
                "تنجح",
                "تستمر"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 116,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الحضارة تُقاس بمدى احترامها لـ ______",
        "options": [
                "الأقوياء",
                "الضعفاء",
                "الأغنياء",
                "الحكام"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 117,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الحق دون قوة تحميه ______",
        "options": [
                "ينتصر",
                "يضيع",
                "يبقى",
                "يتحقق"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 118,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "التفكير النقدي يتطلب ______ المسلمات والتحقق منها",
        "options": [
                "قبول",
                "مساءلة",
                "تبني",
                "اعتماد"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 119,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "العقول الكبيرة تناقش الأفكار والعقول الصغيرة تناقش ______",
        "options": [
                "الأحداث",
                "الأشخاص",
                "التفاصيل",
                "الماضي"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 120,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "القوة الناعمة أشد تأثيراً من ______ الصلبة",
        "options": [
                "القوة",
                "السيطرة",
                "الهيمنة",
                "السلطة"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 121,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "أحب لأخيك ما تحب ______",
        "options": [
                "له",
                "لنفسك",
                "للناس",
                "للجميع"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 122,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من طلب العلا سهر ______",
        "options": [
                "النهار",
                "الليالي",
                "الأيام",
                "الساعات"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 123,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "ليس كل ما يلمع ______",
        "options": [
                "ذهباً",
                "فضة",
                "نوراً",
                "جميلاً"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 124,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من صبر ______",
        "options": [
                "نجح",
                "ظفر",
                "فاز",
                "ربح"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 125,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "الوقت من ______",
        "options": [
                "فضة",
                "ذهب",
                "ماس",
                "نحاس"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 126,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "درهم وقاية خير من قنطار ______",
        "options": [
                "علاج",
                "دواء",
                "شفاء",
                "طب"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 127,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من سار على الدرب ______",
        "options": [
                "وصل",
                "نجح",
                "تعلم",
                "استفاد"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 128,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "اطلبوا العلم من المهد إلى ______",
        "options": [
                "الممات",
                "اللحد",
                "القبر",
                "النهاية"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 129,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "التعاون أساس ______",
        "options": [
                "النجاح",
                "القوة",
                "التقدم",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 130,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "إن الله لا يغير ما بقوم حتى يغيروا ما بـ ______",
        "options": [
                "حولهم",
                "أنفسهم",
                "بيئتهم",
                "مجتمعهم"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 131,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "القيادة ليست منصباً بل ______",
        "options": [
                "سلطة",
                "مسؤولية",
                "امتياز",
                "شرف"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 132,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الجودة ليست فعلاً بل ______",
        "options": [
                "قراراً",
                "عادة",
                "خياراً",
                "هدفاً"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 133,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "المرء بأصغريه: قلبه و______",
        "options": [
                "عقله",
                "لسانه",
                "يده",
                "عينه"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 134,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "أول الشجرة ______",
        "options": [
                "بذرة",
                "جذر",
                "ساق",
                "ورقة"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 135,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الإنسان عدو ما ______",
        "options": [
                "يحب",
                "يكره",
                "يجهل",
                "يعرف"
        ],
        "correct": 2,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 136,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "ليس المهم أن تنتصر بل أن ______",
        "options": [
                "تشارك",
                "تحاول",
                "تستمر",
                "تتعلم"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 137,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "الصمت لغة ______",
        "options": [
                "الضعفاء",
                "الحكماء",
                "العاجزين",
                "الخائفين"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 138,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "السعادة قرار ______",
        "options": [
                "خارجي",
                "داخلي",
                "مؤقت",
                "صعب"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 139,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "ليس الشديد بالصرعة إنما الشديد من يملك نفسه عند ______",
        "options": [
                "الفرح",
                "الغضب",
                "الحزن",
                "الخوف"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 140,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "اليد العليا خير من اليد ______",
        "options": [
                "السفلى",
                "الآخذة",
                "الطالبة",
                "المستقبلة"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 141,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "إنما الأعمال بـ ______",
        "options": [
                "النوايا",
                "النتائج",
                "الأقوال",
                "الظواهر"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 142,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "خير الناس أنفعهم ______",
        "options": [
                "لأنفسهم",
                "للناس",
                "لأهلهم",
                "لوطنهم"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 143,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "المؤمن للمؤمن كالبنيان يشد بعضه ______",
        "options": [
                "بعضاً",
                "الآخر",
                "بعضه",
                "غيره"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 144,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الوطنية الحقيقية ليست في الشعارات بل في ______",
        "options": [
                "العمل",
                "الولاء",
                "التضحية",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 145,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "التغيير الحقيقي يبدأ عندما تتجاوز ______",
        "options": [
                "حدودك",
                "مخاوفك",
                "راحتك",
                "كل ما سبق"
        ],
        "correct": 3,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 146,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "الحكمة ضالة المؤمن أنى وجدها فهو أحق ______",
        "options": [
                "بها",
                "بأخذها",
                "بتعلمها",
                "باتباعها"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 147,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "كفى بالمرء كذباً أن يحدث بكل ما ______",
        "options": [
                "علم",
                "سمع",
                "رأى",
                "قرأ"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 148,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "لا يلدغ المؤمن من ______ مرتين",
        "options": [
                "نفس الجحر",
                "نفس الحية",
                "نفس المكان",
                "نفس الشخص"
        ],
        "correct": 0,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 149,
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "كل إناء بما فيه ______",
        "options": [
                "يمتلئ",
                "ينضح",
                "يفيض",
                "يزخر"
        ],
        "correct": 1,
        "explanation": "إكمال الجملة بالكلمة المناسبة"
},
{
        "id": 150,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "القراءة غذاء العقل والروح، فهي تفتح آفاقاً جديدة للإنسان.",
        "text": "ما الفكرة الرئيسية؟",
        "options": [
                "أهمية القراءة",
                "أنواع الكتب",
                "كيفية القراءة",
                "تاريخ الكتابة"
        ],
        "correct": 0,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 151,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التلوث البيئي من أخطر المشكلات. الهواء الملوث يسبب أمراضاً، والماء الملوث يقضي على الكائنات البحرية.",
        "text": "ما أثر تلوث الماء؟",
        "options": [
                "أمراض",
                "القضاء على الكائنات البحرية",
                "تأثير على الزراعة",
                "تلوث الهواء"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 152,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الذكاء الاصطناعي ثورة تقنية. رغم فوائده، هناك مخاوف من تأثيره على العمل. الحل في تشريعات صارمة.",
        "text": "ما الحل المقترح؟",
        "options": [
                "إيقاف التطوير",
                "تشريعات صارمة",
                "تجاهل المخاوف",
                "زيادة الاستثمار"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 153,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "النحل حشرات مفيدة. تنتج العسل وتلقح الأزهار. تتناقص أعدادها بسبب المبيدات.",
        "text": "لماذا النحل مفيد؟",
        "options": [
                "ينتج العسل فقط",
                "يلقح الأزهار",
                "يقتل الحشرات",
                "ينظف الهواء"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 154,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الرياضة أسلوب حياة. تقوي الجسم وتنشط العقل. المشي 30 دقيقة يومياً يحقق فوائد كبيرة.",
        "text": "كم مدة المشي المقترحة؟",
        "options": [
                "10 دقائق",
                "20 دقيقة",
                "30 دقيقة",
                "ساعة"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 155,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "العولمة لها إيجابيات وسلبيات. تسهل التجارة لكنها تهدد الهويات المحلية.",
        "text": "كيف نتعامل مع العولمة؟",
        "options": [
                "رفضها",
                "قبولها كلياً",
                "بحكمة وتوازن",
                "تجاهلها"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 156,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الماء ضروري للحياة. يشكل 70% من الجسم. نحتاج لترين يومياً.",
        "text": "كم نسبة الماء في الجسم؟",
        "options": [
                "50%",
                "60%",
                "70%",
                "90%"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 157,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "اللغة العربية من أغنى اللغات. هي لغة القرآن الكريم.",
        "text": "لماذا للعربية مكانة خاصة؟",
        "options": [
                "لجمال حروفها",
                "لأنها لغة القرآن",
                "لتنوع أساليبها",
                "لكثرة كلماتها"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 158,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التسوق الإلكتروني يوفر الوقت لكن له مخاطر. ينصح بالشراء من مواقع موثوقة.",
        "text": "ما النصيحة؟",
        "options": [
                "تجنب التسوق الإلكتروني",
                "الشراء من أي موقع",
                "استخدام مواقع موثوقة",
                "عدم المقارنة"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 159,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الفن مرآة المجتمع. في الأزمات يصبح وسيلة للتعبير والمقاومة.",
        "text": "ما دور الفن في الأزمات؟",
        "options": [
                "الاحتفاء بالجمال",
                "التعبير والمقاومة",
                "الترفيه فقط",
                "التجاهل"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 160,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "النوم الكافي ضروري. يحتاج البالغ 7-9 ساعات يومياً.",
        "text": "كم ساعة نوم يحتاجها البالغ؟",
        "options": [
                "5-6",
                "7-9",
                "10-12",
                "4-5"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 161,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التفكير النقدي مهارة أساسية. يتضمن تحليل المعلومات قبل قبولها.",
        "text": "ما أول خطوة في التفكير النقدي؟",
        "options": [
                "القبول الفوري",
                "الرفض المطلق",
                "تحليل المعلومات",
                "النشر السريع"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 162,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الأسرة اللبنة الأولى في المجتمع. فيها يتعلم الطفل القيم.",
        "text": "ما دور الأسرة؟",
        "options": [
                "توفير المال",
                "تعليم القيم",
                "الترفيه",
                "العمل"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 163,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التقنية سلاح ذو حدين. سهلت حياتنا لكنها خلقت تحديات.",
        "text": "ما معنى سلاح ذو حدين؟",
        "options": [
                "شيء خطير",
                "له إيجابيات وسلبيات",
                "أداة حادة",
                "سلاح حقيقي"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 164,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الصحراء العربية من أكبر الصحاري. مناخها حار صيفاً وبارد شتاءً.",
        "text": "كيف مناخ الصحراء صيفاً؟",
        "options": [
                "بارد",
                "حار",
                "معتدل",
                "رطب"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 165,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الاستدامة منهج شامل يتضمن الأبعاد البيئية والاقتصادية والاجتماعية.",
        "text": "ما أبعاد الاستدامة؟",
        "options": [
                "بيئية فقط",
                "بيئية واقتصادية واجتماعية",
                "اقتصادية فقط",
                "سياسية"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 166,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "التطوع عمل إنساني. يكتسب المتطوع مهارات ويشعر بالرضا.",
        "text": "ماذا يستفيد المتطوع؟",
        "options": [
                "المال",
                "مهارات ورضا",
                "الشهرة",
                "السلطة"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 167,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "الخط العربي فن إسلامي. له أنواع كثيرة منها النسخ والرقعة والثلث.",
        "text": "كم نوع خط ذُكر؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 168,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "القهوة العربية رمز للكرم والضيافة.",
        "text": "ماذا تمثل القهوة؟",
        "options": [
                "مشروب عادي",
                "رمز للكرم",
                "رمز للغنى",
                "تقليد حديث"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 169,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "رؤية 2030 تهدف لتنويع الاقتصاد وتطوير السياحة.",
        "text": "ما الهدف الاقتصادي للرؤية؟",
        "options": [
                "الاعتماد على النفط",
                "تنويع الاقتصاد",
                "تقليل الإنتاج",
                "العزلة"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 170,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "البحر الأحمر يتميز بشعابه المرجانية. الحفاظ عليه مسؤولية الجميع.",
        "text": "من المسؤول عن الحفاظ عليه؟",
        "options": [
                "الحكومة",
                "الغواصون",
                "الجميع",
                "لا أحد"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 171,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "العمارة الإسلامية تتميز بالأقواس والقباب. هذه العناصر تحمل رموزاً روحية.",
        "text": "ما الغرض من عناصر العمارة؟",
        "options": [
                "الزينة فقط",
                "الزينة والرموز الروحية",
                "التكلفة",
                "التقليد"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 172,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "ريادة الأعمال تتطلب جرأة وصبراً وقدرة على تحمل المخاطر.",
        "text": "ما متطلبات ريادة الأعمال؟",
        "options": [
                "المال فقط",
                "الجرأة والصبر",
                "الشهادات",
                "العلاقات"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 173,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الضحك يقلل التوتر ويحسن المزاج ويقوي المناعة.",
        "text": "ما فوائد الضحك؟",
        "options": [
                "التوتر",
                "تقليل التوتر وتحسين المزاج",
                "الحزن",
                "المرض"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 174,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "السفر يوسع المدارك ويعلم التسامح وتقبل الاختلاف.",
        "text": "ماذا نتعلم من السفر؟",
        "options": [
                "الانغلاق",
                "التسامح",
                "رفض الآخر",
                "البقاء"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 175,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الذاكرة الجماعية تشكل الهوية الثقافية وتربط الأجيال.",
        "text": "ما أهمية الذاكرة الجماعية؟",
        "options": [
                "لا أهمية",
                "تشكيل الهوية",
                "نسيان الماضي",
                "التفرقة"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 176,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الغذاء الصحي يتضمن الخضروات والفواكه. يجب تجنب الأطعمة المصنعة.",
        "text": "ما الذي يجب تجنبه؟",
        "options": [
                "الخضروات",
                "الفواكه",
                "الأطعمة المصنعة",
                "البروتينات"
        ],
        "correct": 2,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 177,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "الإنترنت غير طريقة التعلم والعمل. يتطلب مهارات تصفية وتحليل.",
        "text": "ما المهارات المطلوبة؟",
        "options": [
                "الحفظ",
                "التصفية والتحليل",
                "السرعة",
                "لا شيء"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 178,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الفلسفة ضرورة حياتية. تساعد على طرح الأسئلة الكبرى.",
        "text": "ما رأي النص في الفلسفة؟",
        "options": [
                "ترف",
                "ضرورة حياتية",
                "مضيعة للوقت",
                "للمتخصصين"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 179,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "الموسيقى لغة عالمية تتجاوز الحدود والثقافات.",
        "text": "لماذا الموسيقى عالمية؟",
        "options": [
                "لأنها صعبة",
                "تتجاوز الحدود",
                "قديمة",
                "نادرة"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 180,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الزراعة أقدم الأنشطة. غيرت حياة البشر من التنقل للاستقرار.",
        "text": "كيف غيرت الزراعة الحياة؟",
        "options": [
                "زادت التنقل",
                "للاستقرار",
                "لم تغير",
                "زادت الفقر"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 181,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التعليم سلاح الأمم. من أراد أمة قوية فليبن عقول أبنائها.",
        "text": "ما أهمية التعليم؟",
        "options": [
                "ترفيه",
                "أداة للتقدم",
                "مضيعة للوقت",
                "للأغنياء"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 182,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "الإبداع قدرة يمكن تنميتها. كل إنسان يملك بذور الإبداع.",
        "text": "ما رأي الكاتب في الإبداع؟",
        "options": [
                "موهبة نادرة",
                "قابل للتطوير",
                "للعباقرة",
                "لا يمكن تعلمه"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 183,
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "hard",
        "context": "الاقتصاد الرقمي يغير العالم. الشركات التي لا تتبنى التحول الرقمي ستخرج من المنافسة.",
        "text": "ما نصيحة النص للشركات؟",
        "options": [
                "البقاء كما هي",
                "التحول الرقمي",
                "تجاهل التقنية",
                "التركيز على الماضي"
        ],
        "correct": 1,
        "explanation": "الإجابة واضحة من النص"
},
{
        "id": 184,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الشمس تشرق من الغرب كل صباح",
        "options": [
                "تشرق",
                "الغرب",
                "كل",
                "صباح"
        ],
        "correct": 1,
        "explanation": "الشمس تشرق من الشرق"
},
{
        "id": 185,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الماء يتجمد عند مئة درجة",
        "options": [
                "الماء",
                "يتجمد",
                "مئة",
                "درجة"
        ],
        "correct": 2,
        "explanation": "الماء يتجمد عند صفر"
},
{
        "id": 186,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "القمر هو أقرب نجم للأرض",
        "options": [
                "القمر",
                "أقرب",
                "نجم",
                "الأرض"
        ],
        "correct": 2,
        "explanation": "القمر تابع وليس نجماً"
},
{
        "id": 187,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الحوت من الأسماك الكبيرة",
        "options": [
                "الحوت",
                "الأسماك",
                "الكبيرة",
                "المحيطات"
        ],
        "correct": 1,
        "explanation": "الحوت ثديي وليس سمكة"
},
{
        "id": 188,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "العام الهجري يتكون من 13 شهراً",
        "options": [
                "الهجري",
                "يتكون",
                "ثلاثة عشر",
                "شهراً"
        ],
        "correct": 2,
        "explanation": "العام 12 شهراً"
},
{
        "id": 189,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الفيلة من أذكى الزواحف",
        "options": [
                "الفيلة",
                "أذكى",
                "الزواحف",
                "العالم"
        ],
        "correct": 2,
        "explanation": "الفيل ثديي"
},
{
        "id": 190,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الرياض تقع في جنوب المملكة",
        "options": [
                "الرياض",
                "تقع",
                "جنوب",
                "المملكة"
        ],
        "correct": 2,
        "explanation": "الرياض في الوسط"
},
{
        "id": 191,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "يُصنع الزجاج من المعادن الثمينة",
        "options": [
                "يُصنع",
                "الزجاج",
                "المعادن",
                "الثمينة"
        ],
        "correct": 2,
        "explanation": "الزجاج من الرمال"
},
{
        "id": 192,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "البترول مصدر طاقة متجدد",
        "options": [
                "البترول",
                "متجدد",
                "ينفد",
                "بسرعة"
        ],
        "correct": 1,
        "explanation": "البترول غير متجدد"
},
{
        "id": 193,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الديناصورات انقرضت منذ ألف سنة",
        "options": [
                "الديناصورات",
                "انقرضت",
                "ألف",
                "تقريباً"
        ],
        "correct": 2,
        "explanation": "انقرضت منذ ملايين السنين"
},
{
        "id": 194,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الذهب معدن خفيف",
        "options": [
                "الذهب",
                "خفيف",
                "يُستخدم",
                "المجوهرات"
        ],
        "correct": 1,
        "explanation": "الذهب معدن ثقيل"
},
{
        "id": 195,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الأرض تدور حول نفسها مرة كل شهر",
        "options": [
                "الأرض",
                "تدور",
                "مرة",
                "شهر"
        ],
        "correct": 3,
        "explanation": "تدور كل يوم"
},
{
        "id": 196,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الصوت ينتقل في الفراغ",
        "options": [
                "الصوت",
                "ينتقل",
                "الفراغ",
                "بسرعة"
        ],
        "correct": 2,
        "explanation": "الصوت لا ينتقل في الفراغ"
},
{
        "id": 197,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "عدد ألوان قوس قزح خمسة",
        "options": [
                "عدد",
                "قوس قزح",
                "خمسة",
                "ألوان"
        ],
        "correct": 2,
        "explanation": "سبعة ألوان"
},
{
        "id": 198,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الأسبوع يتكون من ستة أيام",
        "options": [
                "الأسبوع",
                "يتكون",
                "ستة",
                "أيام"
        ],
        "correct": 2,
        "explanation": "سبعة أيام"
},
{
        "id": 199,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "البطريق طائر يجيد الطيران",
        "options": [
                "البطريق",
                "طائر",
                "الطيران",
                "السماء"
        ],
        "correct": 2,
        "explanation": "البطريق لا يطير"
},
{
        "id": 200,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "نهر النيل أقصر أنهار العالم",
        "options": [
                "نهر",
                "النيل",
                "أقصر",
                "العالم"
        ],
        "correct": 2,
        "explanation": "النيل أطول نهر"
},
{
        "id": 201,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الضوء أبطأ من الصوت",
        "options": [
                "الضوء",
                "يسير",
                "أبطأ",
                "الصوت"
        ],
        "correct": 2,
        "explanation": "الضوء أسرع"
},
{
        "id": 202,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الإنسان يتنفس ثاني أكسيد الكربون",
        "options": [
                "الإنسان",
                "يتنفس",
                "ثاني أكسيد الكربون",
                "غاز"
        ],
        "correct": 2,
        "explanation": "يتنفس الأكسجين"
},
{
        "id": 203,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الكعبة تقع في المدينة المنورة",
        "options": [
                "الكعبة",
                "المشرفة",
                "تقع",
                "المدينة المنورة"
        ],
        "correct": 3,
        "explanation": "في مكة المكرمة"
},
{
        "id": 204,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "المريخ الكوكب الأقرب للشمس",
        "options": [
                "المريخ",
                "الكوكب",
                "الأقرب",
                "الشمس"
        ],
        "correct": 0,
        "explanation": "عطارد الأقرب"
},
{
        "id": 205,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "العسل يُنتجه النحل من الصخور",
        "options": [
                "العسل",
                "يُنتجه",
                "النحل",
                "الصخور"
        ],
        "correct": 3,
        "explanation": "من رحيق الأزهار"
},
{
        "id": 206,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الجمل يختزن الماء في سنامه",
        "options": [
                "الجمل",
                "يختزن",
                "الماء",
                "سنامه"
        ],
        "correct": 2,
        "explanation": "يختزن الدهون"
},
{
        "id": 207,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الهواء عنصر كيميائي واحد",
        "options": [
                "الهواء",
                "عنصر",
                "كيميائي",
                "واحد"
        ],
        "correct": 1,
        "explanation": "الهواء مزيج"
},
{
        "id": 208,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الجليد أكثف من الماء السائل",
        "options": [
                "الجليد",
                "أكثف",
                "الماء",
                "السائل"
        ],
        "correct": 1,
        "explanation": "الجليد أقل كثافة"
},
{
        "id": 209,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الثعبان له أربعة أطراف",
        "options": [
                "الثعبان",
                "الفقاريات",
                "أربعة",
                "أطراف"
        ],
        "correct": 2,
        "explanation": "الثعبان بلا أطراف"
},
{
        "id": 210,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الأهرامات بُنيت في العصر الحديث",
        "options": [
                "الأهرامات",
                "بُنيت",
                "العصر",
                "الحديث"
        ],
        "correct": 3,
        "explanation": "في العصر القديم"
},
{
        "id": 211,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الزرافة من أقصر الحيوانات",
        "options": [
                "الزرافة",
                "أقصر",
                "الحيوانات",
                "العالم"
        ],
        "correct": 1,
        "explanation": "أطول الحيوانات"
},
{
        "id": 212,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "المطر يتساقط من باطن الأرض",
        "options": [
                "المطر",
                "يتساقط",
                "باطن",
                "الأرض"
        ],
        "correct": 2,
        "explanation": "من السماء"
},
{
        "id": 213,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الدماغ يوجد في القفص الصدري",
        "options": [
                "الدماغ",
                "يوجد",
                "القفص",
                "الصدري"
        ],
        "correct": 3,
        "explanation": "في الجمجمة"
},
{
        "id": 214,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "البحر الميت أعلى بقعة على الأرض",
        "options": [
                "البحر الميت",
                "أعلى",
                "بقعة",
                "الأرض"
        ],
        "correct": 1,
        "explanation": "أخفض بقعة"
},
{
        "id": 215,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الساعة فيها 60 دقيقة و60 ساعة",
        "options": [
                "الساعة",
                "ستون",
                "دقيقة",
                "ساعة"
        ],
        "correct": 3,
        "explanation": "60 ثانية في الدقيقة"
},
{
        "id": 216,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "السكر مادة مرة المذاق",
        "options": [
                "السكر",
                "مادة",
                "مرة",
                "المذاق"
        ],
        "correct": 2,
        "explanation": "حلوة المذاق"
},
{
        "id": 217,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الكلب حيوان يصيح كالديك",
        "options": [
                "الكلب",
                "أليف",
                "يصيح",
                "الديك"
        ],
        "correct": 2,
        "explanation": "الكلب ينبح"
},
{
        "id": 218,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الخليج العربي غرب شبه الجزيرة",
        "options": [
                "الخليج",
                "العربي",
                "غرب",
                "الجزيرة"
        ],
        "correct": 2,
        "explanation": "شرق شبه الجزيرة"
},
{
        "id": 219,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "النحلة حشرة لها ثماني أرجل",
        "options": [
                "النحلة",
                "حشرة",
                "ثماني",
                "أرجل"
        ],
        "correct": 2,
        "explanation": "ست أرجل"
},
{
        "id": 220,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الشتاء يأتي بعد الربيع",
        "options": [
                "الشتاء",
                "يأتي",
                "بعد",
                "الربيع"
        ],
        "correct": 3,
        "explanation": "بعد الخريف"
},
{
        "id": 221,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الزئبق معدن صلب",
        "options": [
                "الزئبق",
                "معدن",
                "صلب",
                "الغرفة"
        ],
        "correct": 2,
        "explanation": "الزئبق سائل"
},
{
        "id": 222,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الورد زهرة ذات رائحة كريهة",
        "options": [
                "الورد",
                "زهرة",
                "رائحة",
                "كريهة"
        ],
        "correct": 3,
        "explanation": "رائحة عطرة"
},
{
        "id": 223,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "مصر دولة آسيوية",
        "options": [
                "مصر",
                "آسيوية",
                "تقع",
                "النيل"
        ],
        "correct": 1,
        "explanation": "مصر أفريقية"
},
{
        "id": 224,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "السمك يتنفس بالرئتين",
        "options": [
                "السمك",
                "يتنفس",
                "بواسطة",
                "الرئتين"
        ],
        "correct": 3,
        "explanation": "بالخياشيم"
},
{
        "id": 225,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الشمس أصغر من الأرض",
        "options": [
                "الشمس",
                "أصغر",
                "من",
                "الأرض"
        ],
        "correct": 1,
        "explanation": "الشمس أكبر"
},
{
        "id": 226,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الحديد معدن ناعم سهل الكسر",
        "options": [
                "الحديد",
                "معدن",
                "ناعم",
                "الكسر"
        ],
        "correct": 2,
        "explanation": "الحديد صلب"
},
{
        "id": 227,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الأرنب حيوان بطيء",
        "options": [
                "الأرنب",
                "حيوان",
                "بطيء",
                "الجري"
        ],
        "correct": 2,
        "explanation": "الأرنب سريع"
},
{
        "id": 228,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الفيل أثقل حيوان بري يعيش في البحار",
        "options": [
                "الفيل",
                "أثقل",
                "بري",
                "البحار"
        ],
        "correct": 3,
        "explanation": "يعيش على اليابسة"
},
{
        "id": 229,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "النملة حشرة كسولة لا تعمل",
        "options": [
                "النملة",
                "حشرة",
                "كسولة",
                "تعمل"
        ],
        "correct": 2,
        "explanation": "النملة نشيطة"
},
{
        "id": 230,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الماء يغلي عند صفر درجة",
        "options": [
                "الماء",
                "يغلي",
                "درجة",
                "صفر"
        ],
        "correct": 3,
        "explanation": "يغلي عند 100"
},
{
        "id": 231,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الأكسجين غاز قابل للاشتعال",
        "options": [
                "الأكسجين",
                "غاز",
                "قابل",
                "للاشتعال"
        ],
        "correct": 3,
        "explanation": "يساعد على الاشتعال"
},
{
        "id": 232,
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "hard",
        "text": "الحديد يصدأ في الهواء الجاف",
        "options": [
                "الحديد",
                "معدن",
                "يصدأ",
                "الجاف"
        ],
        "correct": 3,
        "explanation": "في الهواء الرطب"
},
{
        "id": 233,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "نسبة أولاد:بنات = 3:2، الأولاد 15، كم البنات؟",
        "options": [
                "8",
                "10",
                "12",
                "15"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 234,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "ثمن 5 كتب = 75 ريال، كم ثمن 8؟",
        "options": [
                "100",
                "110",
                "120",
                "130"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 235,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "نسبة 25 إلى 100 =",
        "options": [
                "1/2",
                "1/4",
                "1/5",
                "1/3"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 236,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "40% من 250 =",
        "options": [
                "80",
                "90",
                "100",
                "110"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 237,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "قطع 60 كم في ساعتين، كم في 5 ساعات؟",
        "options": [
                "100",
                "120",
                "150",
                "180"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 238,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "نسبة عمر الأب:الابن = 5:2، مجموعهما 35، عمر الأب؟",
        "options": [
                "20",
                "25",
                "15",
                "30"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 239,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "خلط 3 لتر تفاح مع 2 لتر برتقال، نسبة التفاح للخليط؟",
        "options": [
                "3/5",
                "2/5",
                "3/2",
                "2/3"
        ],
        "correct": 0,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 240,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "زاد راتب 20% وأصبح 6000، الأصلي؟",
        "options": [
                "4800",
                "5000",
                "5200",
                "4500"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 241,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "تخفيض 25%، السعر 150، الأصلي؟",
        "options": [
                "175",
                "200",
                "225",
                "180"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 242,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "نجح 80% = 120 طالب، العدد الكلي؟",
        "options": [
                "140",
                "150",
                "160",
                "180"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 243,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "أ:ب = 2:3، ب:ج = 4:5، أ:ج؟",
        "options": [
                "8:15",
                "6:10",
                "2:5",
                "4:5"
        ],
        "correct": 0,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 244,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "تخفيض 10% ثم زيادة 10%، النتيجة؟",
        "options": [
                "نفس السعر",
                "أقل",
                "أكبر",
                "لا يمكن تحديده"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 245,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "قسم مبلغ بنسبة 2:3:5، الفرق بين الأكبر والأصغر 600، المبلغ؟",
        "options": [
                "1500",
                "2000",
                "2500",
                "3000"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 246,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "ما النسبة المئوية لـ 15 من 60؟",
        "options": [
                "20%",
                "25%",
                "30%",
                "35%"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 247,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "طلاب 240، ذكور 60%، عدد الإناث؟",
        "options": [
                "96",
                "144",
                "120",
                "80"
        ],
        "correct": 0,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 248,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "ما العدد الذي 30% منه = 45؟",
        "options": [
                "135",
                "150",
                "120",
                "100"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 249,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "زاد سعر 25% ثم 20%، الزيادة الكلية؟",
        "options": [
                "45%",
                "50%",
                "55%",
                "60%"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 250,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "نسبة عددين 3:4، مجموعهما 35، الأصغر؟",
        "options": [
                "12",
                "15",
                "20",
                "18"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 251,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "5 عمال ينجزون عملاً في 12 يوم، كم يحتاج 10 عمال؟",
        "options": [
                "6",
                "8",
                "10",
                "24"
        ],
        "correct": 0,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 252,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "3/5 تساوي بالنسبة المئوية؟",
        "options": [
                "30%",
                "50%",
                "60%",
                "75%"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 253,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "وفر 30% من 5000 ريال، كم وفر؟",
        "options": [
                "1000",
                "1200",
                "1500",
                "1800"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 254,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "سار 2/5 الطريق، كم تبقى؟",
        "options": [
                "1/5",
                "2/5",
                "3/5",
                "4/5"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 255,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "كم سنتيمتر في 2 متر؟",
        "options": [
                "20",
                "200",
                "2000",
                "20000"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 256,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "كم جرام في 2.5 كيلوجرام؟",
        "options": [
                "250",
                "2500",
                "25000",
                "250000"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 257,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "كم دقيقة في 3 ساعات؟",
        "options": [
                "120",
                "150",
                "180",
                "200"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 258,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "كم ثانية في 5 دقائق؟",
        "options": [
                "50",
                "100",
                "200",
                "300"
        ],
        "correct": 3,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 259,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "سيارة تستهلك 8 لتر لـ 100 كم، كم لـ 250 كم؟",
        "options": [
                "15",
                "18",
                "20",
                "25"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 260,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "أ:ب:ج = 1:2:3، مجموعهم 60، قيمة ب؟",
        "options": [
                "10",
                "15",
                "20",
                "30"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 261,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "5 أقلام بـ 15 ريال، سعر 12 قلم؟",
        "options": [
                "30",
                "36",
                "42",
                "48"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 262,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "نسبة 3 إلى 12 =",
        "options": [
                "1:2",
                "1:3",
                "1:4",
                "1:6"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 263,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "قسم 600 بين شخصين بنسبة 1:3، نصيب الأول؟",
        "options": [
                "100",
                "150",
                "200",
                "450"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 264,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "40% من عدد = 24، العدد؟",
        "options": [
                "40",
                "50",
                "60",
                "80"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 265,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "1000 ريال بفائدة 5% لـ 3 سنوات، المبلغ النهائي؟",
        "options": [
                "1050",
                "1100",
                "1150",
                "1157"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 266,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "نسبة زيادة من 80 إلى 100؟",
        "options": [
                "20%",
                "25%",
                "30%",
                "80%"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 267,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "خُلط 30% و50% بنسبة 2:3، تركيز المزيج؟",
        "options": [
                "38%",
                "40%",
                "42%",
                "44%"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 268,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "1/4 + 1/4 =",
        "options": [
                "1/8",
                "1/4",
                "1/2",
                "2/4"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 269,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "2/3 من 15 =",
        "options": [
                "8",
                "10",
                "12",
                "14"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 270,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "3/4 × 8 =",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 2,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 271,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "50% من 120 =",
        "options": [
                "50",
                "60",
                "70",
                "80"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 272,
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "6 عمال ينجزون عملاً في 8 أيام، كم عامل لـ 4 أيام؟",
        "options": [
                "3",
                "12",
                "16",
                "24"
        ],
        "correct": 1,
        "explanation": "حل رياضي مباشر"
},
{
        "id": 273,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "س + 7 = 15، س = ؟",
        "options": [
                "6",
                "7",
                "8",
                "22"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 274,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "2س = 18، س = ؟",
        "options": [
                "7",
                "8",
                "9",
                "10"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 275,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "س - 5 = 12، س = ؟",
        "options": [
                "7",
                "17",
                "15",
                "20"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 276,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "3س + 6 = 21، س = ؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 277,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "2س + 3 عندما س=4؟",
        "options": [
                "8",
                "10",
                "11",
                "14"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 278,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "2س - 4 = 10، س = ؟",
        "options": [
                "5",
                "6",
                "7",
                "8"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 279,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "5س + 3 = 2س + 12، س = ؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 280,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² = 49، س الموجبة = ؟",
        "options": [
                "5",
                "6",
                "7",
                "8"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 281,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "(س+3)(س-2) = 0، قيم س؟",
        "options": [
                "-3، 2",
                "3، -2",
                "-3، -2",
                "3، 2"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 282,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² + 2س عندما س=3؟",
        "options": [
                "12",
                "15",
                "18",
                "21"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 283,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "(س+2)² = 25، س الموجبة = ؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 284,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "س+ص=10، س-ص=4، س = ؟",
        "options": [
                "5",
                "6",
                "7",
                "8"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 285,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "س³ عندما س=-2؟",
        "options": [
                "-8",
                "8",
                "-6",
                "6"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 286,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "4س = 24، س+2 = ؟",
        "options": [
                "6",
                "8",
                "10",
                "12"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 287,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "3س + 2س - س =",
        "options": [
                "4س",
                "5س",
                "6س",
                "3س"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 288,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س/3 = 5، س = ؟",
        "options": [
                "12",
                "15",
                "18",
                "8"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 289,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "2(س+3) = 14، س = ؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 290,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "2^س = 32، س = ؟",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 291,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "(-3) × (-4) =",
        "options": [
                "-12",
                "12",
                "-7",
                "7"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 292,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "|−7| =",
        "options": [
                "-7",
                "7",
                "0",
                "14"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 293,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "3س - 2ص = 12، ص=3، س = ؟",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 294,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² - 9 =",
        "options": [
                "(س-3)(س+3)",
                "(س-9)(س+1)",
                "(س-3)²",
                "(س+3)²"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 295,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "س² - 5س + 6 = 0، قيم س؟",
        "options": [
                "2، 3",
                "-2، -3",
                "1، 6",
                "-1، -6"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 296,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "5² =",
        "options": [
                "10",
                "25",
                "125",
                "20"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 297,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "√81 =",
        "options": [
                "7",
                "8",
                "9",
                "10"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 298,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "(2س)³ =",
        "options": [
                "6س³",
                "8س³",
                "2س³",
                "6س"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 299,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "log₂(8) =",
        "options": [
                "2",
                "3",
                "4",
                "8"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 300,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "6س = 42، 2س = ؟",
        "options": [
                "7",
                "14",
                "21",
                "28"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 301,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "2س + 3 > 11، س؟",
        "options": [
                "س > 4",
                "س > 5",
                "س < 4",
                "س < 5"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 302,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "2³ + 3² =",
        "options": [
                "13",
                "15",
                "17",
                "19"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 303,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "√(16 + 9) =",
        "options": [
                "3",
                "4",
                "5",
                "7"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 304,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "3 × 4 + 2 × 5 =",
        "options": [
                "22",
                "70",
                "35",
                "17"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 305,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "15 - 8 + 3 =",
        "options": [
                "4",
                "10",
                "20",
                "26"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 306,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "24 ÷ 6 × 2 =",
        "options": [
                "2",
                "4",
                "8",
                "16"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 307,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "10 - 3 × 2 =",
        "options": [
                "4",
                "7",
                "14",
                "20"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 308,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "5 × (3 + 2) =",
        "options": [
                "17",
                "20",
                "25",
                "30"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 309,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "0 × 1000 =",
        "options": [
                "0",
                "100",
                "1000",
                "10000"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 310,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² - 4 = 0، قيم س؟",
        "options": [
                "2 فقط",
                "-2 فقط",
                "2 و -2",
                "4"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 311,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "2^(س+1) = 16، س = ؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 312,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "3(2س - 1) = 21، س = ؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 1,
        "explanation": "حل جبري مباشر"
},
{
        "id": 313,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² = 64، |س| = ؟",
        "options": [
                "6",
                "7",
                "8",
                "9"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 314,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "2س + 5 = 3س - 2، س = ؟",
        "options": [
                "3",
                "5",
                "7",
                "9"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 315,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "س² - 6س + 9 = 0، س = ؟",
        "options": [
                "3",
                "-3",
                "6",
                "9"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 316,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "س³ = 125، س = ؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 317,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "2^س × 2³ = 2⁷، س = ؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 318,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "log س = 2، س = ؟",
        "options": [
                "10",
                "20",
                "100",
                "1000"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 319,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "7 + س = 12، س = ؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 320,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "10 - س = 3، س = ؟",
        "options": [
                "3",
                "5",
                "7",
                "13"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 321,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "5س - 2س + 3س =",
        "options": [
                "6س",
                "7س",
                "8س",
                "10س"
        ],
        "correct": 0,
        "explanation": "حل جبري مباشر"
},
{
        "id": 322,
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "س² - 1 = 0، قيم س؟",
        "options": [
                "1 فقط",
                "-1 فقط",
                "1 و -1",
                "0"
        ],
        "correct": 2,
        "explanation": "حل جبري مباشر"
},
{
        "id": 323,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "متوسط: 10، 20، 30",
        "options": [
                "15",
                "20",
                "25",
                "30"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 324,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "وسيط: 3، 7، 2، 9، 5",
        "options": [
                "3",
                "5",
                "7",
                "9"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 325,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "منوال: 2، 3، 3، 5، 7، 3",
        "options": [
                "2",
                "3",
                "5",
                "7"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 326,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "المدى لـ: 4، 8، 12، 15، 20",
        "options": [
                "12",
                "14",
                "16",
                "18"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 327,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "مجموع 5 أعداد = 45، متوسطها؟",
        "options": [
                "7",
                "8",
                "9",
                "10"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 328,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "متوسط 4 أعداد = 15، مجموعها؟",
        "options": [
                "45",
                "50",
                "55",
                "60"
        ],
        "correct": 3,
        "explanation": "حساب إحصائي"
},
{
        "id": 329,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "وسيط: 2، 4، 6، 8",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 330,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "متوسط 3 أعداد = 12، أضفنا 20، المتوسط الجديد؟",
        "options": [
                "13",
                "14",
                "15",
                "16"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 331,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "متوسط 20 طالب = 75، متوسط 30 = 85، المتوسط الكلي؟",
        "options": [
                "79",
                "80",
                "81",
                "82"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 332,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "40% أحمر، 35% أزرق، نسبة الأخضر؟",
        "options": [
                "15%",
                "20%",
                "25%",
                "30%"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 333,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "متوسط: 5، 5، 5، 5، 5",
        "options": [
                "1",
                "5",
                "25",
                "0"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 334,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "1، 2، 3، 4، س ومتوسطها 4، س = ؟",
        "options": [
                "8",
                "10",
                "12",
                "14"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 335,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "احتمال ظهور زوجي في نرد؟",
        "options": [
                "1/6",
                "1/3",
                "1/2",
                "2/3"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 336,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "احتمال سحب ملك من 52 ورقة؟",
        "options": [
                "1/52",
                "1/13",
                "1/4",
                "4/13"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 337,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "مجموع: 2 + 4 + 6 + 8 + 10",
        "options": [
                "25",
                "30",
                "35",
                "40"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 338,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "رمي قطعة نقدية مرتين، احتمال وجهين؟",
        "options": [
                "1/2",
                "1/4",
                "1/3",
                "3/4"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 339,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "منوال: 5، 5، 7، 8، 5",
        "options": [
                "5",
                "6",
                "7",
                "8"
        ],
        "correct": 0,
        "explanation": "حساب إحصائي"
},
{
        "id": 340,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "وسيط: 2، 4، 6، 8، 10، 12",
        "options": [
                "6",
                "7",
                "8",
                "9"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 341,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "30 طالب نجح 32، نسبة النجاح في 40 طالب؟",
        "options": [
                "70%",
                "75%",
                "80%",
                "85%"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 342,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "رمي نردين، عدد النتائج الممكنة؟",
        "options": [
                "12",
                "24",
                "36",
                "48"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 343,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "عدد طرق ترتيب 3 أشخاص؟",
        "options": [
                "3",
                "6",
                "9",
                "27"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 344,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "احتمال ظهور صورة في قطعة نقدية؟",
        "options": [
                "0",
                "1/4",
                "1/2",
                "1"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 345,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "احتمال ظهور 4 في نرد؟",
        "options": [
                "1/2",
                "1/3",
                "1/4",
                "1/6"
        ],
        "correct": 3,
        "explanation": "حساب إحصائي"
},
{
        "id": 346,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "5 كرات حمراء و3 زرقاء، احتمال حمراء؟",
        "options": [
                "3/8",
                "5/8",
                "1/2",
                "5/3"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 347,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "متوسط 5 أعداد = 8، حذفنا 3، المتوسط الجديد؟",
        "options": [
                "8.5",
                "9",
                "9.25",
                "10"
        ],
        "correct": 2,
        "explanation": "حساب إحصائي"
},
{
        "id": 348,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "التباين = 16، الانحراف المعياري؟",
        "options": [
                "2",
                "4",
                "8",
                "256"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 349,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "المتوسط = الوسيط = المنوال، التوزيع؟",
        "options": [
                "طبيعي",
                "ملتوي يمين",
                "ملتوي يسار",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "حساب إحصائي"
},
{
        "id": 350,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "رمي نرد 60 مرة، التكرار المتوقع لـ 3؟",
        "options": [
                "6",
                "10",
                "12",
                "15"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 351,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "3 حمراء و2 زرقاء و5 خضراء، احتمال حمراء أو زرقاء؟",
        "options": [
                "1/2",
                "3/10",
                "1/5",
                "2/5"
        ],
        "correct": 0,
        "explanation": "حساب إحصائي"
},
{
        "id": 352,
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "صف 30 طالب، 18 ذكور، نسبة الإناث؟",
        "options": [
                "30%",
                "40%",
                "50%",
                "60%"
        ],
        "correct": 1,
        "explanation": "حساب إحصائي"
},
{
        "id": 353,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مربع ضلعه 5؟",
        "options": [
                "10",
                "20",
                "25",
                "30"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 354,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "محيط مربع ضلعه 6؟",
        "options": [
                "12",
                "18",
                "24",
                "36"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 355,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مستطيل 8×5؟",
        "options": [
                "13",
                "26",
                "40",
                "80"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 356,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "محيط مستطيل 10×4؟",
        "options": [
                "14",
                "28",
                "40",
                "56"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 357,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مثلث قاعدته 8 وارتفاعه 6؟",
        "options": [
                "14",
                "24",
                "48",
                "28"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 358,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مثلث قائم ضلعاه 3 و4، الوتر؟",
        "options": [
                "5",
                "6",
                "7",
                "8"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 359,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مساحة دائرة نصف قطرها 7 (π=22/7)؟",
        "options": [
                "44",
                "154",
                "308",
                "88"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 360,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "محيط دائرة قطرها 14 (π=22/7)؟",
        "options": [
                "22",
                "44",
                "88",
                "154"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 361,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "حجم مكعب ضلعه 3؟",
        "options": [
                "9",
                "18",
                "27",
                "81"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 362,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "حجم متوازي مستطيلات 4×3×2؟",
        "options": [
                "9",
                "18",
                "24",
                "36"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 363,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة شبه منحرف قاعدتاه 6 و10 وارتفاعه 4؟",
        "options": [
                "24",
                "32",
                "40",
                "64"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 364,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة معين قطراه 6 و8؟",
        "options": [
                "14",
                "24",
                "48",
                "28"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 365,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مجموع زوايا المثلث؟",
        "options": [
                "90°",
                "180°",
                "270°",
                "360°"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 366,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مجموع زوايا المربع؟",
        "options": [
                "180°",
                "270°",
                "360°",
                "540°"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 367,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مثلث زاويتان 50° و70°، الثالثة؟",
        "options": [
                "50°",
                "60°",
                "70°",
                "80°"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 368,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "قطر مربع مساحته 50؟",
        "options": [
                "5",
                "10",
                "7.07",
                "14.14"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 369,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "محيط مثلث متساوي الأضلاع ضلعه 7؟",
        "options": [
                "14",
                "21",
                "28",
                "35"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 370,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مستطيل محيطه 30 وطوله 9، عرضه؟",
        "options": [
                "3",
                "6",
                "12",
                "21"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 371,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مجموع زوايا المضلع السداسي؟",
        "options": [
                "540°",
                "720°",
                "900°",
                "1080°"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 372,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مجموع زوايا المضلع الخماسي؟",
        "options": [
                "360°",
                "450°",
                "540°",
                "720°"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 373,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "عدد أضلاع المسدس؟",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 374,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "عدد زوايا المثلث؟",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 375,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "عدد أوجه المكعب؟",
        "options": [
                "4",
                "5",
                "6",
                "8"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 376,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "عدد رؤوس المكعب؟",
        "options": [
                "4",
                "6",
                "8",
                "12"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 377,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "عدد أحرف المكعب؟",
        "options": [
                "6",
                "8",
                "10",
                "12"
        ],
        "correct": 3,
        "explanation": "حساب هندسي"
},
{
        "id": 378,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "نوع الزاوية 90°؟",
        "options": [
                "حادة",
                "قائمة",
                "منفرجة",
                "مستقيمة"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 379,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "نوع الزاوية 45°؟",
        "options": [
                "حادة",
                "قائمة",
                "منفرجة",
                "مستقيمة"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 380,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "نوع الزاوية 120°؟",
        "options": [
                "حادة",
                "قائمة",
                "منفرجة",
                "مستقيمة"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 381,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مستطيل مساحته 48 وطوله 8، عرضه؟",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 382,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "نصف قطر دائرة قطرها 10؟",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 383,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "قطر دائرة نصف قطرها 8؟",
        "options": [
                "4",
                "8",
                "16",
                "32"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 384,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مثلث متساوي الساقين ساقه 5 وقاعدته 6، محيطه؟",
        "options": [
                "14",
                "15",
                "16",
                "17"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 385,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مثلث قائم أضلاعه 6 والوتر 10، الضلع الآخر؟",
        "options": [
                "4",
                "6",
                "8",
                "10"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 386,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة مثلث متساوي الأضلاع ضلعه 6؟",
        "options": [
                "9√3",
                "18",
                "36",
                "12√3"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 387,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مساحة متوازي أضلاع قاعدته 10 وارتفاعه 6؟",
        "options": [
                "16",
                "32",
                "60",
                "120"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 388,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "قطر مستطيل 6×8؟",
        "options": [
                "8",
                "10",
                "12",
                "14"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 389,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مساحة مربع محيطه 20؟",
        "options": [
                "16",
                "20",
                "25",
                "100"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 390,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "زاوية المثلث المتساوي الأضلاع؟",
        "options": [
                "30°",
                "45°",
                "60°",
                "90°"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 391,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "نوع المثلث الذي جميع زواياه حادة؟",
        "options": [
                "قائم",
                "منفرج",
                "حاد الزوايا",
                "متساوي"
        ],
        "correct": 2,
        "explanation": "حساب هندسي"
},
{
        "id": 392,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة دائرة محيطها 44 (π=22/7)؟",
        "options": [
                "154",
                "144",
                "132",
                "121"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 393,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "طول قوس دائرة نصف قطرها 14 وزاويته 45°؟",
        "options": [
                "5.5",
                "11",
                "22",
                "44"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 394,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "حجم أسطوانة نصف قطرها 3 وارتفاعها 5؟",
        "options": [
                "45π",
                "30π",
                "15π",
                "90π"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 395,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة سطح كرة نصف قطرها 2؟",
        "options": [
                "8π",
                "16π",
                "32π",
                "4π"
        ],
        "correct": 1,
        "explanation": "حساب هندسي"
},
{
        "id": 396,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "قطاع دائري زاويته 90° ونصف قطره 4، مساحته؟",
        "options": [
                "4π",
                "8π",
                "16π",
                "2π"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 397,
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "المساحة الجانبية لأسطوانة نصف قطرها 5 وارتفاعها 10؟",
        "options": [
                "100π",
                "50π",
                "150π",
                "200π"
        ],
        "correct": 0,
        "explanation": "حساب هندسي"
},
{
        "id": 398,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 3/4 و 0.8",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 399,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 5² و 2⁵",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 400,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: √16 و 4",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 401,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 0.5 و 1/3",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 402,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 15% من 80 و 12",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 403,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: √16+√9 و √25",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 404,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: (-3)² و -3²",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 405,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 2/5 و 3/7",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 406,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: محيط مربع ضلعه 5 و محيط مستطيل 6×4",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 407,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 0.125 و 1/8",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 408,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: مساحة مربع ضلعه 4 و مساحة دائرة قطرها 4",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 409,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: |−5| و |−3|",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 410,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 2³ و 3²",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 411,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 50% و 0.5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 412,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 5/6 و 7/8",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 413,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: √50 و 7",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 414,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 4×5 و 10+10",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 415,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 3! و 2³",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 416,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 0.33 و 1/3",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 417,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 1/5 و 0.2",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 418,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 2/3 و 3/5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "id": 419,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 10² و 2¹⁰",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 420,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 1000÷10 و 10×10",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 421,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 4! و 3³",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 422,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: ⁵√32 و ³√8",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "explanation": "مقارنة رياضية"
},
{
        "id": 423,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: حجم مكعب ضلعه 3 و حجم كرة نصف قطرها 2",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "explanation": "مقارنة رياضية"
},
{
        "id": 424,
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: مساحة مربع ضلعه 10 و مساحة دائرة نصف قطرها 6",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 0,
        "explanation": "مقارنة رياضية"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "قلب : حب",
        "options": [
                "عين : دمعة",
                "عقل : فكر",
                "يد : عمل",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 425,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "بحر : موج",
        "options": [
                "صحراء : رمال",
                "جبل : صخور",
                "غابة : أشجار",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 426,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "ظلم : عدل",
        "options": [
                "كذب : صدق",
                "خيانة : أمانة",
                "جبن : شجاعة",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 427,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "لكل مجتهد ______",
        "options": [
                "نصيب",
                "جائزة",
                "مكافأة",
                "أجر"
        ],
        "correct": 0,
        "id": 428,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "العمل عبادة و______ جهاد",
        "options": [
                "الصدق",
                "الصبر",
                "الجهل",
                "الكسل"
        ],
        "correct": 1,
        "id": 429,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "إذا أردت أن تُطاع فأمر بما ______",
        "options": [
                "تحب",
                "يُستطاع",
                "تريد",
                "تشاء"
        ],
        "correct": 1,
        "id": 430,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "easy",
        "context": "الصدق أساس كل فضيلة. من صدق نجا ومن كذب هلك.",
        "text": "ما الفكرة الرئيسية؟",
        "options": [
                "أهمية الصدق",
                "أنواع الكذب",
                "معنى النجاة",
                "تعريف الفضيلة"
        ],
        "correct": 0,
        "id": 431,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "reading",
        "difficulty": "medium",
        "context": "التعليم استثمار في المستقبل. الأمم المتقدمة تنفق على التعليم أكثر من غيره.",
        "text": "ما موقف الأمم المتقدمة من التعليم؟",
        "options": [
                "تهمله",
                "تنفق عليه كثيراً",
                "لا تهتم به",
                "تعارضه"
        ],
        "correct": 1,
        "id": 432,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "الأسد ملك الغابة وهو حيوان أليف",
        "options": [
                "الأسد",
                "ملك",
                "الغابة",
                "أليف"
        ],
        "correct": 3,
        "id": 433,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الشتاء فصل دافئ يكثر فيه المطر",
        "options": [
                "الشتاء",
                "فصل",
                "دافئ",
                "المطر"
        ],
        "correct": 2,
        "id": 434,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "75% من 200 =",
        "options": [
                "100",
                "125",
                "150",
                "175"
        ],
        "correct": 2,
        "id": 435,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "إذا كان 25% من عدد = 50، العدد؟",
        "options": [
                "100",
                "150",
                "200",
                "250"
        ],
        "correct": 2,
        "id": 436,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "زاد سعر 40% ثم انخفض 40%، النتيجة؟",
        "options": [
                "نفسه",
                "أقل 16%",
                "أكثر 16%",
                "أقل 8%"
        ],
        "correct": 1,
        "id": 437,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "12 ÷ 4 + 3 =",
        "options": [
                "1",
                "3",
                "5",
                "6"
        ],
        "correct": 3,
        "id": 438,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "(5-2)² + (4-1)² =",
        "options": [
                "12",
                "15",
                "18",
                "21"
        ],
        "correct": 2,
        "id": 439,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "إذا س+1/س = 4، س²+1/س² = ؟",
        "options": [
                "12",
                "14",
                "16",
                "18"
        ],
        "correct": 1,
        "id": 440,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "وسيط: 1، 2، 3، 4، 5",
        "options": [
                "2",
                "3",
                "4",
                "5"
        ],
        "correct": 1,
        "id": 441,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "إذا ضاعفنا كل قيمة، المتوسط؟",
        "options": [
                "نفسه",
                "يتضاعف",
                "يزيد 2",
                "ينقص"
        ],
        "correct": 1,
        "id": 442,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "إذا أضفنا ثابت لكل قيمة، الانحراف المعياري؟",
        "options": [
                "يزيد",
                "ينقص",
                "لا يتغير",
                "يتضاعف"
        ],
        "correct": 2,
        "id": 443,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مربع ضلعه 10؟",
        "options": [
                "40",
                "100",
                "400",
                "1000"
        ],
        "correct": 1,
        "id": 444,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "محيط دائرة نصف قطرها 7 (π=22/7)؟",
        "options": [
                "22",
                "44",
                "88",
                "154"
        ],
        "correct": 1,
        "id": 445,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "حجم كرة نصف قطرها 3 (π=3.14)؟",
        "options": [
                "37.68",
                "56.52",
                "113.04",
                "28.26"
        ],
        "correct": 2,
        "id": 446,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 1/2 و 0.5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "id": 447,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: √2 و 1.5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "id": 448,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: π و 22/7",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "id": 449,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "ليل : نهار",
        "options": [
                "صيف : شتاء",
                "حر : برد",
                "نوم : صحوة",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 450,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "أب : أم",
        "options": [
                "أخ : أخت",
                "جد : جدة",
                "عم : عمة",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 451,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "قلم : ورقة",
        "options": [
                "فرشاة : لوحة",
                "سكين : طعام",
                "مفتاح : باب",
                "كل ما سبق"
        ],
        "correct": 0,
        "id": 452,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "طالب : معلم",
        "options": [
                "مريض : طبيب",
                "موكل : محامي",
                "مواطن : حاكم",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 453,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "hard",
        "text": "فكر : عمل",
        "options": [
                "نظرية : تطبيق",
                "خطة : تنفيذ",
                "علم : ممارسة",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 454,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "بالتأني تُدرك ______",
        "options": [
                "السعادة",
                "الفرص",
                "الفرج",
                "العجلة"
        ],
        "correct": 1,
        "id": 455,
        "explanation": "التأني يمنح الإنسان وقتاً كافياً للتفكير واغتنام الفرص دون تسرّع"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من تأنى ______ ومن تعجل أخطأ",
        "options": [
                "نال",
                "فاز",
                "نجح",
                "ربح"
        ],
        "correct": 0,
        "id": 456,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "خير الأمور ______",
        "options": [
                "أولها",
                "أوسطها",
                "آخرها",
                "أسهلها"
        ],
        "correct": 1,
        "id": 457,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "البداية نصف ______",
        "options": [
                "النهاية",
                "الطريق",
                "العمل",
                "الإنجاز"
        ],
        "correct": 2,
        "id": 458,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "hard",
        "text": "من لم يكن له ______ فليس له حاضر",
        "options": [
                "مستقبل",
                "ماضي",
                "حلم",
                "هدف"
        ],
        "correct": 1,
        "id": 459,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "10% من 500 =",
        "options": [
                "25",
                "50",
                "75",
                "100"
        ],
        "correct": 1,
        "id": 460,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "1/5 = كم %؟",
        "options": [
                "10%",
                "15%",
                "20%",
                "25%"
        ],
        "correct": 2,
        "id": 461,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "زاد عدد من 80 إلى 100، نسبة الزيادة؟",
        "options": [
                "20%",
                "25%",
                "30%",
                "80%"
        ],
        "correct": 1,
        "id": 462,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "نقص عدد من 200 إلى 150، نسبة النقص؟",
        "options": [
                "20%",
                "25%",
                "30%",
                "50%"
        ],
        "correct": 1,
        "id": 463,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "hard",
        "text": "إذا كان ثمن 8 كتب 120 ريال، ثمن 5 كتب؟",
        "options": [
                "60",
                "75",
                "90",
                "100"
        ],
        "correct": 1,
        "id": 464,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "(−2) × 5 =",
        "options": [
                "-10",
                "10",
                "-7",
                "7"
        ],
        "correct": 0,
        "id": 465,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "(−3) + (−5) =",
        "options": [
                "-8",
                "8",
                "-2",
                "2"
        ],
        "correct": 0,
        "id": 466,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "√144 =",
        "options": [
                "10",
                "11",
                "12",
                "14"
        ],
        "correct": 2,
        "id": 467,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "3⁴ =",
        "options": [
                "12",
                "27",
                "81",
                "243"
        ],
        "correct": 2,
        "id": 468,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "hard",
        "text": "log₁₀(1000) =",
        "options": [
                "2",
                "3",
                "4",
                "10"
        ],
        "correct": 1,
        "id": 469,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "متوسط: 1، 2، 3",
        "options": [
                "1",
                "2",
                "3",
                "6"
        ],
        "correct": 1,
        "id": 470,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "وسيط: 7، 3، 5",
        "options": [
                "3",
                "5",
                "7",
                "15"
        ],
        "correct": 1,
        "id": 471,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "منوال: 1، 2، 2، 3، 3، 3",
        "options": [
                "1",
                "2",
                "3",
                "لا يوجد"
        ],
        "correct": 2,
        "id": 472,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "مدى: 10، 20، 30، 40، 50",
        "options": [
                "10",
                "20",
                "30",
                "40"
        ],
        "correct": 3,
        "id": 473,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "hard",
        "text": "5! =",
        "options": [
                "20",
                "60",
                "120",
                "720"
        ],
        "correct": 2,
        "id": 474,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مستطيل 5×10؟",
        "options": [
                "15",
                "30",
                "50",
                "100"
        ],
        "correct": 2,
        "id": 475,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "محيط مربع ضلعه 8؟",
        "options": [
                "16",
                "24",
                "32",
                "64"
        ],
        "correct": 2,
        "id": 476,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "حجم مكعب ضلعه 4؟",
        "options": [
                "16",
                "32",
                "64",
                "256"
        ],
        "correct": 2,
        "id": 477,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "مجموع زوايا المثلث القائم غير القائمتين؟",
        "options": [
                "45°",
                "90°",
                "180°",
                "270°"
        ],
        "correct": 1,
        "id": 478,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "hard",
        "text": "مساحة دائرة قطرها 10 (π=3.14)؟",
        "options": [
                "31.4",
                "78.5",
                "314",
                "785"
        ],
        "correct": 1,
        "id": 479,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 3/4 و 4/5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "id": 480,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 0.6 و 3/5",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "id": 481,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: √36 و 6",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "id": 482,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 2⁴ و 4²",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "id": 483,
        "explanation": "الإجابة واضحة"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "hard",
        "text": "قارن: 0.999 و 1",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "id": 484,
        "explanation": "الإجابة واضحة"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "easy",
        "text": "نهار : ضوء",
        "options": [
                "ليل : ظلام",
                "صباح : شروق",
                "مساء : غروب",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 485,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "verbal",
        "subcategory": "analogy",
        "difficulty": "medium",
        "text": "سؤال : جواب",
        "options": [
                "مشكلة : حل",
                "سبب : نتيجة",
                "مقدمة : نتيجة",
                "كل ما سبق"
        ],
        "correct": 3,
        "id": 486,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "easy",
        "text": "من جاور السعيد ______",
        "options": [
                "يسعد",
                "يحزن",
                "يتعب",
                "يمل"
        ],
        "correct": 0,
        "id": 487,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "verbal",
        "subcategory": "completion",
        "difficulty": "medium",
        "text": "اتق شر من ______ إليه",
        "options": [
                "أسأت",
                "أحسنت",
                "ظلمت",
                "كذبت"
        ],
        "correct": 1,
        "id": 488,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "easy",
        "text": "5% من 400 =",
        "options": [
                "10",
                "15",
                "20",
                "25"
        ],
        "correct": 2,
        "id": 489,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "ratio",
        "difficulty": "medium",
        "text": "إذا كان 15% من عدد = 30، العدد؟",
        "options": [
                "150",
                "200",
                "250",
                "300"
        ],
        "correct": 1,
        "id": 490,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "easy",
        "text": "8 ÷ 2 + 4 =",
        "options": [
                "1",
                "6",
                "8",
                "12"
        ],
        "correct": 2,
        "id": 491,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "algebra",
        "difficulty": "medium",
        "text": "√196 =",
        "options": [
                "12",
                "13",
                "14",
                "15"
        ],
        "correct": 2,
        "id": 492,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "easy",
        "text": "متوسط: 4، 6، 8",
        "options": [
                "4",
                "5",
                "6",
                "7"
        ],
        "correct": 2,
        "id": 493,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "statistics",
        "difficulty": "medium",
        "text": "وسيط: 1، 3، 5، 7، 9",
        "options": [
                "3",
                "4",
                "5",
                "6"
        ],
        "correct": 2,
        "id": 494,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "easy",
        "text": "مساحة مربع ضلعه 7؟",
        "options": [
                "28",
                "49",
                "56",
                "98"
        ],
        "correct": 1,
        "id": 495,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "geometry",
        "difficulty": "medium",
        "text": "محيط مستطيل 6×8؟",
        "options": [
                "14",
                "28",
                "48",
                "96"
        ],
        "correct": 1,
        "id": 496,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "easy",
        "text": "قارن: 7/10 و 0.7",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 2,
        "id": 497,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "quant",
        "subcategory": "comparison",
        "difficulty": "medium",
        "text": "قارن: 5³ و 3⁵",
        "options": [
                "الأولى أكبر",
                "الثانية أكبر",
                "متساويتان",
                "لا يمكن"
        ],
        "correct": 1,
        "id": 498,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "easy",
        "text": "القط حيوان أليف يعيش في البحر",
        "options": [
                "القط",
                "حيوان",
                "أليف",
                "البحر"
        ],
        "correct": 3,
        "id": 499,
        "explanation": "الإجابة واضحة من السياق"
},
{
        "section": "verbal",
        "subcategory": "context",
        "difficulty": "medium",
        "text": "الطائرة وسيلة نقل بطيئة جداً",
        "options": [
                "الطائرة",
                "وسيلة",
                "نقل",
                "بطيئة"
        ],
        "correct": 3,
        "id": 500,
        "explanation": "الإجابة واضحة من السياق"
}
];
}

function getSampleTests() {
    return [
        {
            id: 1001,
            name: 'اختبار تجريبي قصير',
            description: 'مناسب للتعرف على نمط الأسئلة',
            verbalCount: 10,
            quantCount: 10,
            timeLimit: 15
        },
        {
            id: 1002,
            name: 'اختبار متوسط',
            description: 'تدريب على الأقسام اللفظية والكمية',
            verbalCount: 25,
            quantCount: 25,
            timeLimit: 35
        },
        {
            id: 1003,
            name: 'اختبار شامل',
            description: 'تدريب مكثف لجميع الأقسام',
            verbalCount: 35,
            quantCount: 35,
            timeLimit: 60
        },
        {
            id: 1004,
            name: 'محاكاة قياس الكاملة',
            description: 'محاكاة مطابقة لاختبار قياس الفعلي',
            verbalCount: 65,
            quantCount: 55,
            timeLimit: 125
        }
    ];
}
