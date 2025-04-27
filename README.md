# Auth Service - Marketplace Project

---

## Project Description
This is the **Authentication Service** for a microservices-based marketplace backend. It provides APIs for:
- App-level authentication (Client Token)
- User registration and login (User Token)
- Token-protected profile route
- RabbitMQ integration for publishing login events

---

## Technologies Used
- **Node.js + TypeScript**
- **Express.js**
- **MongoDB** (Mongoose)
- **RabbitMQ** (with amqplib)
- **JWT** (jsonwebtoken)
- **Docker** (for RabbitMQ container)

---

## 🔄 How to Run Locally

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
Access RabbitMQ panel: `http://localhost:15672` (guest/guest)

### 5. Start the Service
```bash
npm run dev
```

---

## 🔍 API Endpoints

### 1. Get Client Token
**POST** `/auth/client-token`
- **Body:**
```json
{
  "client_id": "demo-client",
  "client_secret": "super-secret"
}
```
- **Response:** JWT token for client authentication.

### 2. Register New User
**POST** `/auth/register`
- **Body:**
```json
{
  "username": "kimia",
  "password": "123456"
}
```
- **Response:** Success message if registration is successful.

### 3. Get User Token
**POST** `/auth/user-token`
- **Body:**
```json
{
  "username": "kimia",
  "password": "123456"
}
```
- **Response:** JWT token for user authentication.
- **Side effect:** Publishes a login event to RabbitMQ (`user.login` queue).

### 4. Access Protected Profile
**GET** `/auth/profile`
- **Headers:**
```http
Authorization: Bearer <user_token>
```
- **Response:** Protected user data.

---

## Debugging Tips
- If Postman cannot connect, ensure service is running on `localhost:3000`.
- Check MongoDB and RabbitMQ are up and reachable.
- Watch terminal for `Auth service is running on port 3000` message.

---

## Author
Kimia Abdollahi

