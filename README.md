# SAKAN Backend - Student Housing Platform

SAKAN (سكن) is a non-profit student housing platform connecting students seeking accommodation with owners of student housing and apartments.

The platform has strictly two user roles:
1. **STUDENT**: Browse, search, filter properties, view room availability, add favorites, submit booking requests, track and cancel requests, receive notifications.
2. **OWNER**: Create and manage student housing properties and rooms, upload photos, manage room capacity and occupied beds, review/approve/reject booking requests, view dashboard statistics.

There is no platform administrator role or property approval workflow; owners manage their accommodations directly.

---

## 🚀 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (Modular Monolith)
- **Language**: TypeScript (Strict Mode enabled, 0% `any`)
- **Database**: MongoDB (Local or MongoDB Atlas)
- **ORM**: Prisma ORM (`provider = "mongodb"`)
- **Authentication**: JWT Access Tokens (15m) & Rotating Refresh Tokens (30d)
- **Password Security**: bcrypt (10 rounds)
- **Validation**: Zod (Centralized Request Middleware)
- **Documentation**: Swagger / OpenAPI 3.0 (`swagger-ui-express`)
- **Storage**: Cloudinary with automatic local disk storage fallback (`uploads/`)
- **Security**: Helmet, Configured CORS, Centralized Error Handling
- **Localization**: Native Arabic (`ar`) and English (`en`) support with stable error codes

---

## 🏛️ Project Architecture

Request lifecycle:
```text
Client
  ↓
Language Middleware (ar / en)
  ↓
Route Layer
  ↓
Validation Middleware (Zod)
  ↓
Authentication Middleware (JWT Bearer)
  ↓
Role Authorization Middleware (STUDENT / OWNER)
  ↓
Controller Layer (Thin, HTTP handling)
  ↓
Service Layer (Business Logic & Transactions)
  ↓
Prisma Client
  ↓
MongoDB
```

### Directory Structure
```text
src/
├── config/
│   ├── env.ts              # Zod-validated environment config
│   ├── prisma.ts           # Prisma client singleton
│   └── swagger.ts          # OpenAPI specification
├── common/
│   ├── constants/          # Error codes, roles, booking status
│   ├── errors/             # Centralized AppError
│   ├── i18n/               # Arabic & English translation dictionaries
│   ├── middleware/         # Auth, role, language, validation, errors
│   ├── types/              # Express Request augmentation
│   └── utils/              # JWT, bcrypt, response formatter, pagination
├── modules/
│   ├── auth/               # Register, login, refresh tokens, logout, me
│   ├── users/              # Profile & password management
│   ├── properties/         # Property CRUD, search, filter, images
│   ├── rooms/              # Room CRUD, capacity protection, images
│   ├── bookings/           # Booking request flow & atomic approvals
│   ├── favorites/          # Property favorites
│   ├── notifications/      # User notifications & read status
│   ├── amenities/          # Amenities listing
│   ├── uploads/            # StorageService abstraction
│   └── owner/              # Owner statistics & management
├── routes/
│   └── index.ts            # Central /api/v1 router
├── app.ts                  # Express application setup
└── server.ts               # Server entrypoint
```

---

## 🌐 Localization (i18n)

The backend natively supports Arabic (`ar`) and English (`en`). Clients specify their preferred language using the `Accept-Language` header:

```http
Accept-Language: ar
# or
Accept-Language: en
```

If the header is missing or unsupported, the backend automatically defaults to **Arabic (`ar`)**.

All API responses maintain stable, programmatic `code` identifiers while localizing the `message`:

```json
{
  "success": true,
  "code": "PROPERTIES_RETRIEVED",
  "message": "تم جلب أماكن السكن بنجاح",
  "data": { ... }
}
```

---

## ⚙️ Installation & Setup (No Docker Required)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your MongoDB connection string in `.env`. You can use a local MongoDB instance or a free MongoDB Atlas connection string:
```env
DATABASE_URL="mongodb://localhost:27017/sakan"
# or MongoDB Atlas:
# DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/sakan?retryWrites=true&w=majority"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Schema to MongoDB
Synchronize the Prisma models and indexes to MongoDB:
```bash
npm run prisma:push
```

### 5. Seed Predefined Amenities
Seed initial amenities (WiFi, AC, Kitchen, etc.):
```bash
npm run prisma:seed
```

### 6. Run the Application
Start the development server with live reload:
```bash
npm run dev
```

Or build and run in production mode:
```bash
npm run build
npm start
```

---

## 📖 API Documentation (Swagger)

Interactive Swagger / OpenAPI 3.0 documentation is accessible at:
```text
http://localhost:5000/api/docs
```

The health check endpoint is available at:
```text
http://localhost:5000/health
```

---

## 🔒 Key Business & Security Rules

1. **Capacity Protection**: Room capacity can never be reduced below `occupiedBeds`.
2. **Atomic Booking Approval**: Approving a booking request executes inside a database transaction verifying `occupiedBeds < capacity` before incrementing occupied beds and marking the booking approved.
3. **Strict Ownership Validation**: Owners can only modify and view analytics for properties they own. Client-provided owner IDs are never trusted.
4. **Soft Delete**: Deleting properties and rooms deactivates them (`isActive = false`) to maintain historical integrity.
5. **Safe Data Exposure**: Password hashes and refresh tokens are strictly omitted from all controller responses.
