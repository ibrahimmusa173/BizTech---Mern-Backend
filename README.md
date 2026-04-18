# BizTech - Mern-Backend

## 🛠 Tech Stack
* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
* **Communication:** Nodemailer (Email Service)
* **Security:** Helmet (HTTP Headers) & Express-Mongo-Sanitize

## ✨ Key Features

### 👤 User Management & Auth
* **Role-Based Access Control (RBAC):** Distinct workflows for Admin, Client, and Vendor.
* **Secure Authentication:** JWT-based login/register with encrypted password storage.
* **Password Recovery:** Full "Forgot Password" flow with secure token-based email resets.
* **Profile Control:** Users can view and update their company and personal profiles.

### 📝 Tender Management
* **Drafting & Submission:** Clients can create detailed tenders with budget ranges and deadlines.
* **Admin Moderation:** Tenders enter a pending state until approved by an Admin to go active.
* **Public Marketplace:** Vendors can browse and search for active, open opportunities.

### 🤝 Bidding & Proposal System
* **Vendor Submissions:** Proposals include cover letters, proposed solutions, and pricing.
* **Proposal Lifecycle:** Status tracking (Pending, Accepted, Rejected, Withdrawn).
* **Notifications:** Automated internal notifications trigger when proposals are submitted.

### 🛡 Admin Dashboard
* **Governance:** Ability to block/unblock users to maintain platform integrity.
* **Analytics:** Global statistics for total users, active tenders, and submitted proposals.


