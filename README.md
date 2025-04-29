# Auth Service - Marketplace Project

---

## Project Description
This is the **Authentication Service** for a microservices-based marketplace backend. It provides APIs for:
- Client authentication (Client Token)
- User registration and login (User Token)
- Token-protected profile route
- Refresh Token system for session management
- Role Based Access Control (Admin / User)
- RabbitMQ integration for publishing login events

---

## Technologies Used
- **Node.js + TypeScript**
- **Express.js**
- **MongoDB** (Mongoose)
- **RabbitMQ** (amqplib)
- **JWT** (jsonwebtoken)
- **Docker** (for RabbitMQ container)

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables (.env file)
```env
PORT=3000
CLIENT_ID=demo-client
CLIENT_SECRET=super-secret
JWT_SECRET=top-secret-key
MONGODB_URI=mongodb://localhost:27017
RABBITMQ_URL=amqp://localhost
```

### 3. Start MongoDB
Ensure MongoDB is running locally on port `27017`.

### 4. Start RabbitMQ
If you have Docker, run:
```bash
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
Access RabbitMQ panel: [http://localhost:15672](http://localhost:15672)

### 5. Start the Service
```bash
npm run dev
```

---

## API Endpoints

### 1. Get Client Token
**POST** `/auth/client-token`
- **Body:**
```json
{
  "client_id": "demo-client",
  "client_secret": "super-secret"
}
```

### 2. Register New User
**POST** `/auth/register`
- **Body:**
```json
{
  "username": "kimia",
  "password": "123456",
  "role": "admin" // (optional, only for development)
}
```

### 3. User Login (Get Access Token + Refresh Token)
**POST** `/auth/user-token`
- **Body:**
```json
{
  "username": "kimia",
  "password": "123456"
}
```
- **Response:** Access token + Refresh token.
- **Side effect:** Publishes a login event to RabbitMQ (`user.login` queue).

### 4. Access Protected Profile
**GET** `/auth/profile`
- **Headers:**
```http
Authorization: Bearer <user_token>
```

### 5. Refresh Access Token
**POST** `/auth/refresh-token`
- **Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### 6. Logout User (Invalidate Refresh Token)
**POST** `/auth/logout`
- **Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### 7. Update User Profile
**PUT** `/auth/profile/update`
- **Headers:**
```http
Authorization: Bearer <user_token>
```
- **Body:**
```json
{
  "username": "newUsername",
  "password": "newPassword"
}
```

### 8. Admin-only Route (example)
**GET** `/auth/admin-only`
- **Headers:**
```http
Authorization: Bearer <admin_token>
```

### 9. Set User Role (Admin only)
**PUT** `/auth/set-role`
- **Headers:**
```http
Authorization: Bearer <admin_token>
```
- **Body:**
```json
{
  "userId": "target_user_id",
  "role": "admin"
}
```

---

## Role Based Access Control (RBAC)

| Role | Access |
|:---|:---|
| user | Limited to their own profile and login features |
| admin | Can manage other users, change roles, access admin routes |

---

## Debugging Tips
- If Postman cannot connect, ensure service is running on `localhost:3000`.
- Check MongoDB and RabbitMQ are up and reachable.
- Watch terminal for `✅ MongoDB connected` and `✅ Connected to RabbitMQ` messages.

---

## Author
Kimia Abdollahi

