# Karan Homeo Pharmacy API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
- JWT Token-based authentication
- Include token in headers: `Authorization: Bearer <token>`
- Token expires in 2 days

## Response Format
All responses follow this format:
```json
{
  "success": true|false,
  "data": {}, // Only if success: true
  "error": "message" // Only if success: false
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "customer", // Optional: "customer" or "vendor"
  "studentType": "hostler"  // Optional: "hostler" or "day_scholar"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "userType": "customer",
    "studentType": "hostler",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

### 2. Login User
**POST** `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "userType": "customer",
    "studentType": "hostler",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 3. Get User Profile
**GET** `/api/auth/profile`

Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "userType": "customer",
    "studentType": "hostler",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "No token provided, authorization denied"
}
```

---

### 4. Update User Profile
**PUT** `/api/auth/profile`

Update current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "userType": "vendor", // Optional
  "studentType": "day_scholar", // Optional
  "password": "newpassword123" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "userType": "vendor",
    "studentType": "day_scholar",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/api/products`

Get all available products.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Homeopathic Medicine A",
      "description": "Description of medicine",
      "price": 299,
      "category": "medicine",
      "image": "image_url",
      "stock": 50,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Product by ID
**GET** `/api/products/:id`

Get a specific product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Homeopathic Medicine A",
    "description": "Description of medicine",
    "price": 299,
    "category": "medicine",
    "image": "image_url",
    "stock": 50,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Order Endpoints

### 1. Create Order
**POST** `/api/orders`

Create a new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "64f1a2b3c4d5e6f7g8h9i0j2",
      "quantity": 2,
      "price": 299
    }
  ],
  "totalAmount": 598,
  "deliveryAddress": "Hostel Room 101",
  "paymentMethod": "cash"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "items": [...],
    "totalAmount": 598,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Get User Orders
**GET** `/api/orders/myorders`

Get current user's orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "user": "64f1a2b3c4d5e6f7g8h9i0j1",
      "items": [...],
      "totalAmount": 598,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## Upload Endpoint

### 1. Upload Image
**POST** `/api/upload`

Upload an image file.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: [file]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image.jpg",
    "public_id": "image_public_id"
  }
}
```

---

## Admin Endpoints

### 1. Get All Users
**GET** `/api/admin/users`

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

### 2. Get All Orders
**GET** `/api/admin/orders`

Get all orders (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Flutter Integration Example

### API Service Setup
```dart
class ApiService {
  static const String baseUrl = 'http://localhost:5000';
  
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    return jsonDecode(response.body);
  }
  
  static Future<Map<String, dynamic>> getProfile(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/profile'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    return jsonDecode(response.body);
  }
}
```

---

## Testing

Use Postman or curl to test endpoints:

```bash
# Test Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'

# Test Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Test Profile (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## Notes

- Server runs on port 5000 by default
- MongoDB connection is required
- JWT tokens expire after 2 days
- All passwords are hashed using bcrypt
- Image uploads use Cloudinary (if configured)
- Socket.io is available for real-time features
