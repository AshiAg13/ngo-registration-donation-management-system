# UnityFund – NGO Registration & Donation Management System

UnityFund is a MERN stack based web application designed to simplify and secure the process of donating to NGOs. It provides transparency, secure transactions, and an easy-to-use interface for donors and administrators.

---

## Features
- User authentication using JWT  
- Secure online donation system  
- PayHere payment gateway integration  
- Admin dashboard for managing users and donations  
- MongoDB database for secure data storage  
- Responsive UI using React  

---

## Tech Stack
Frontend: React.js, Vite, Tailwind CSS  
Backend: Node.js, Express.js  
Database: MongoDB Atlas  
Payment Gateway: PayHere (Sandbox)  
Tools: ngrok, JWT  

---

## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- ngrok
- Git
## Admin Access
1. Register a user normally  
2. Open MongoDB Atlas  
3. Go to `users` collection  
4. Change:
"role": "user"
to
"role": "admin"
5. Login again to access Admin Dashboard  

---

## Future Enhancements
- Email notification after successful donation  
- NGO verification system  
- Donation analytics and reports  
- Razorpay / Stripe integration  
- Mobile application version  
- Multi-language support  

---

## Conclusion
UnityFund is a complete NGO donation management system built using modern web technologies. It ensures transparency, security, and ease of use while providing NGOs with a reliable digital donation platform.

---
