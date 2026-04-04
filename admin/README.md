# NovaCart - E-Commerce Platform

A modern, full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). NovaCart provides a seamless online shopping experience with secure payments, real-time order tracking, and responsive design.

## Features

### Customer Frontend
- 🛍️ Product browsing with search and filtering
- 🛒 Shopping cart functionality
- 🔐 User authentication and profile management
- 💳 Secure payment integration (Razorpay)
- 📦 Order tracking and history
- 📱 Fully responsive design
- ⚡ Real-time notifications

### Admin Panel
- 📊 Dashboard with analytics
- 📦 Product management (CRUD operations)
- 📋 Order management and status updates
- 👥 User management
- 🔄 Real-time order notifications

### Backend API
- 🚀 RESTful API architecture
- 🗄️ MongoDB database integration
- 🔐 JWT-based authentication
- 📧 Email notifications
- ☁️ Cloudinary image storage
- 🔄 Real-time WebSocket support

## Tech Stack

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Cloudinary

**Payment:**
- Razorpay

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd novacart
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Admin Panel
cd ../admin
npm install
```

3. **Environment Variables**

Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. **Run the application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev

# Admin Panel (Terminal 3)
cd admin
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id` - Update order status (Admin)

## Deployment

### Frontend (Vercel)
1. Connect your frontend repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main branch

### Backend (Render/Heroku)
1. Connect backend repository to deployment platform
2. Configure environment variables
3. Deploy and ensure MongoDB connection

### Admin Panel (Vercel)
1. Deploy admin panel similar to frontend
2. Configure API base URL to point to deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Link: [NovaCart](https://novacart.vercel.app/)
- Support: support@novacart.com

## Acknowledgements

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Razorpay for payment gateway integration
