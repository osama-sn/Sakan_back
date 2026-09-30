import { TranslationDictionary } from "./messages";

export const ar: TranslationDictionary = {
  // Authentication
  AUTH_LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح",
  AUTH_ACCOUNT_CREATED: "تم إنشاء الحساب بنجاح",
  AUTH_INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  AUTH_UNAUTHORIZED: "يرجى تسجيل الدخول أولاً للمتابعة",
  AUTH_TOKEN_EXPIRED: "انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول",
  AUTH_INVALID_REFRESH_TOKEN: "رمز التحديث غير صالح أو منتهي الصلاحية",
  AUTH_ACCOUNT_INACTIVE: "هذا الحساب معطل حالياً، يرجى التواصل مع الدعم",
  AUTH_LOGOUT_SUCCESS: "تم تسجيل الخروج بنجاح",
  AUTH_CURRENT_USER_RETRIEVED: "تم جلب بيانات المستخدم بنجاح",
  AUTH_REGISTRATION_OPTIONS_RETRIEVED: "تم جلب خيارات التسجيل بنجاح",

  // Users
  USER_NOT_FOUND: "لم يتم العثور على المستخدم",
  USER_EMAIL_ALREADY_EXISTS: "البريد الإلكتروني مسجل بالفعل",
  USER_PHONE_ALREADY_EXISTS: "رقم الهاتف مسجل بالفعل",
  USER_PROFILE_RETRIEVED: "تم جلب البيانات الشخصية بنجاح",
  USER_PROFILE_UPDATED: "تم تحديث البيانات الشخصية بنجاح",
  USER_PASSWORD_UPDATED: "تم تغيير كلمة المرور بنجاح",
  USER_CURRENT_PASSWORD_INVALID: "كلمة المرور الحالية غير صحيحة",
  ROOMMATES_RETRIEVED: "تم جلب قائمة زملاء السكن بنجاح",

  // Properties
  PROPERTY_NOT_FOUND: "لم يتم العثور على مكان السكن",
  PROPERTY_ACCESS_DENIED: "غير مصرح لك بتعديل هذا العقار",
  PROPERTY_CREATED: "تم إضافة مكان السكن بنجاح",
  PROPERTY_UPDATED: "تم تحديث بيانات مكان السكن بنجاح",
  PROPERTY_DEACTIVATED: "تم إلغاء تفعيل مكان السكن بنجاح",
  PROPERTY_DELETED: "تم حذف مكان السكن بنجاح",
  PROPERTIES_RETRIEVED: "تم جلب أماكن السكن بنجاح",
  PROPERTY_RETRIEVED: "تم جلب تفاصيل مكان السكن بنجاح",
  PROPERTY_IMAGE_UPLOADED: "تم رفع صور السكن بنجاح",
  PROPERTY_IMAGE_DELETED: "تم حذف الصورة بنجاح",
  PROPERTY_IMAGES_REORDERED: "تم تحديث ترتيب الصور بنجاح",
  PROPERTY_IMAGE_NOT_FOUND: "لم يتم العثور على الصورة المطلوبة",
  PROPERTY_VIEW_RECORDED: "تم تسجيل مشاهدة مكان السكن بنجاح",

  // Rooms
  ROOM_NOT_FOUND: "لم يتم العثور على الغرفة",
  ROOM_ACCESS_DENIED: "غير مصرح لك بالوصول إلى هذه الغرفة",
  ROOM_FULL: "هذه الغرفة ممتلئة حاليًا",
  ROOM_INVALID_CAPACITY: "لا يمكن تقليل سعة الغرفة عن عدد الأسِرّة المشغولة حالياً",
  ROOM_CREATED: "تم إضافة الغرفة بنجاح",
  ROOM_UPDATED: "تم تحديث بيانات الغرفة بنجاح",
  ROOM_DEACTIVATED: "تم إلغاء تفعيل الغرفة بنجاح",
  ROOM_RETRIEVED: "تم جلب تفاصيل الغرفة بنجاح",
  ROOMS_RETRIEVED: "تم جلب الغرف بنجاح",
  ROOM_IMAGE_UPLOADED: "تم رفع صور الغرفة بنجاح",
  ROOM_IMAGE_DELETED: "تم حذف صورة الغرفة بنجاح",
  ROOM_IMAGE_NOT_FOUND: "لم يتم العثور على صورة الغرفة",

  // Bookings
  BOOKING_NOT_FOUND: "لم يتم العثور على طلب السكن",
  BOOKING_ACCESS_DENIED: "غير مصرح لك بالوصول إلى هذا الطلب",
  BOOKING_ALREADY_EXISTS: "لديك طلب سكن معلق أو مؤكد بالفعل لهذه الغرفة",
  BOOKING_INVALID_STATUS: "لا يمكن تعديل هذا الطلب في حالته الحالية",
  BOOKING_CREATED: "تم إرسال طلب السكن بنجاح",
  BOOKING_APPROVED: "تم قبول طلب السكن بنجاح",
  BOOKING_REJECTED: "تم رفض طلب السكن",
  BOOKING_CANCELLED: "تم إلغاء طلب السكن بنجاح",
  BOOKINGS_RETRIEVED: "تم جلب طلبات السكن بنجاح",
  BOOKING_CANNOT_REQUEST_OWN_PROPERTY: "لا يمكنك إرسال طلب سكن لعقار تملكه",
  BOOKING_ROOM_NOT_IN_PROPERTY: "الغرفة المحددة لا تتبع هذا العقار",

  // Favorites
  FAVORITE_ADDED: "تمت إضافة مكان السكن إلى المفضلة",
  FAVORITE_REMOVED: "تمت إزالة مكان السكن من المفضلة",
  FAVORITES_RETRIEVED: "تم جلب قائمة المفضلة بنجاح",

  // Notifications
  NOTIFICATIONS_RETRIEVED: "تم جلب الإشعارات بنجاح",
  NOTIFICATION_NOT_FOUND: "لم يتم العثور على الإشعار",
  NOTIFICATION_MARKED_READ: "تم تحديد الإشعار كمقروء",
  NOTIFICATIONS_ALL_MARKED_READ: "تم تحديد جميع الإشعارات كمقروءة",
  NOTIFICATIONS_UNREAD_COUNT_RETRIEVED: "تم جلب عدد الإشعارات غير المقروءة",

  // Amenities
  AMENITIES_RETRIEVED: "تم جلب قائمة الخدمات والمرافق بنجاح",
  AMENITY_NOT_FOUND: "بعض الخدمات والمرافق المحددة غير موجودة",

  // Locations
  LOCATIONS_RETRIEVED: "تم جلب قائمة المدن والمناطق بنجاح",

  // Conversations & Messages
  CONVERSATION_CREATED: "تم بدء المحادثة بنجاح",
  CONVERSATIONS_RETRIEVED: "تم جلب قائمة المحادثات بنجاح",
  CONVERSATION_RETRIEVED: "تم جلب تفاصيل المحادثة بنجاح",
  CONVERSATION_NOT_FOUND: "لم يتم العثور على المحادثة المطلوبة",
  CONVERSATION_ACCESS_DENIED: "غير مصرح لك بالوصول إلى هذه المحادثة",
  CANNOT_CHAT_WITH_SELF: "لا يمكنك بدء محادثة مع نفسك",
  GENDER_MISMATCH_NOT_ALLOWED: "غير مسموح بالمراسلة بين الطلاب إلا من نفس الجنس لضمان الخصوصية",
  INVALID_CHAT_PARTICIPANTS: "أطراف المحادثة المحددة غير صالحة",
  MESSAGE_SENT: "تم إرسال الرسالة بنجاح",
  MESSAGE_DELETED: "تم حذف الرسالة بنجاح",
  MESSAGE_NOT_FOUND: "لم يتم العثور على الرسالة المطلوبة",
  MESSAGE_DELETE_FORBIDDEN: "لا يمكنك حذف رسالة لم تقم بإرسالها",
  MESSAGES_RETRIEVED: "تم جلب الرسائل بنجاح",
  MESSAGES_MARKED_READ: "تم تحديد الرسائل كمقروءة",
  UNREAD_MESSAGES_COUNT_RETRIEVED: "تم جلب عدد الرسائل غير المقروءة",

  // Owner
  OWNER_DASHBOARD_RETRIEVED: "تم جلب إحصائيات لوحة التحكم بنجاح",
  OWNER_PROPERTIES_RETRIEVED: "تم جلب عقارات المالك بنجاح",
  OWNER_BOOKINGS_RETRIEVED: "تم جلب طلبات الحجز الخاصة بك بنجاح",

  // General
  HEALTH_CHECK_SUCCESS: "الخادم يعمل بنجاح",
  VALIDATION_ERROR: "يرجى مراجعة البيانات المدخلة",
  FORBIDDEN: "ليس لديك الصلاحية لتنفيذ هذا الإجراء",
  NOT_FOUND: "المورد المطلوب غير موجود",
  INTERNAL_SERVER_ERROR: "حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً",
  UPLOAD_FAILED: "فشل رفع الملف، يرجى التأكد من الصيغة والحجم"
};
