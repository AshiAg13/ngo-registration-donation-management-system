# UnityFund – NGO Registration & Donation Management System
https://drive.google.com/file/d/1iJeDBrNyFtJXldhYY_2yJjk0-bHM7cDP/view?usp=sharing

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
  
### Prerequisites Ensure the following software is installed on the target machine:
Node.js: Version 16 or higher.
Git: For version control.
ngrok: Required to expose the local server to the payment gateway.
Terminal: Ability to open 3 separate terminal windows simultaneously.

### Installation Steps

Step 1: Transfer or Clone the Code Copy the project folder to your local machine or clone the repository using Git.

Open your terminal and run: ```bash git clone https://github.com/AshiAg13/ngo-registration-donation-management-system.git cd ngo-registration-donation-management-system

Step 2: Install Dependencies The project relies on external libraries that must be installed fresh. Open a terminal and run the following commands for both the backend and frontend:

For Backend: cd backend npm install

For Frontend: cd ../frontend npm install

### System Configuration (Critical)

The application requires environment variables to connect to the database and payment gateway.

Step 1: Create Environment File Navigate to the backend folder and create a new file named .env.

Step 2: Add Credentials Copy and paste the following configuration into the .env file.

 (Note: You must obtain the actual connection strings and API keys from the project owner).
 
PORT=5000 MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/UnityFund JWT_SECRET=your_secure_jwt_secret PAYHERE_MERCHANT_ID=your_merchant_id PAYHERE_SECRET=your_payhere_secret NODE_ENV=development

### Execution Workflow (How to Run)
To run the full system, you must use three separate terminal windows.

- Terminal 1: Start the Backend This starts the API server on port 5000.
Command: cd backend npm run dev

- Terminal 2: Start Payment Tunneling This exposes the local backend to the public internet so PayHere can send payment receipts.
Command: ngrok http 5000

Action: Look for the "Forwarding" line on the screen and copy the HTTPS URL (e.g., https://random-id.ngrok-free.app).

- Terminal 3: Start the Frontend Before running the frontend, you must link it to the tunnel created in Terminal 2.

Open the file: frontend/src/pages/DonationPage.jsx

Find the variable notify_url and paste the new ngrok URL you just copied.

Start the client application with the command: cd frontend npm run dev

The application will now be accessible in your browser at: http://localhost:5173

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
