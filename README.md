## Company Management System

GitHub Repository: https://github.com/CHchandu2005/Comapnies_Api_Development

A full-stack MERN app to manage companies with filtering, search, pagination, image uploads, and robust validation.

### Features
- Company CRUD
- Filter by industry, location, size, founded year, status
- Checkbox filters (industry, location)
- Search by name and description (single search bar) (debouncing)
- Pagination with page and limit
- Image upload via Multer to Cloudinary
- Validation with Joi middleware
- Centralized error handling
- Automatic HTTP caching (ETag/304)

### Tech Stack
- Client: React + Vite
- Server: Node.js, Express
- DB: MongoDB (Mongoose)
- Uploads: Multer + Cloudinary
- Validation: Joi

### API Endpoints (Base: `/api/companies`)
- GET `/` — List companies
  - Query params:
    - `name`: string (search by name)
    - `description`: string (search by description)
    - `industry`: CSV (e.g., `Technology,Finance`)
    - `location`: CSV (e.g., `New York,Remote`)
    - `sizeMin`, `sizeMax`: number
    - `foundedStart`, `foundedEnd`: number
    - `isActive`: `"true" | "false" | ""`
    - `page`: number (default 1)
    - `limit`: number (default 10)

- GET `/:id` — Get company by id
- POST `/` — Create company (multipart/form-data)
  - Fields: `name` (required), `industry` (required), `location` (required), `size`, `foundedYear`, `isActive`, `description`
  - File: `image` (optional)
- PUT `/:id` — Update company (multipart/form-data)
- DELETE `/:id` — Delete company

All routes validated using Joi via `server/middleware/validate.js` and schemas in `server/validation/index.js`.

### Server Setup
```
cd server
npm install
# .env example
# MONGODB_URI=...
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...
# NODE_ENV=development
npm start
```

### Client Setup
```
cd client
npm install
# .env example
# VITE_API_BASE_URL=http://localhost:5000
npm run dev
```




