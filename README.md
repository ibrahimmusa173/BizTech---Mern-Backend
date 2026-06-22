# BizTech - Mern-Backend

## 🛠 Tech Stack

*   **Runtime Environment:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Search Engine:** MongoDB Atlas Search (Lucene-based full-text search)
*   **Authentication:** JSON Web Tokens (JWT), OAuth 2.0 (Google/GitHub) & Bcrypt.js
*   **Communication:** Nodemailer (Email Service)
*   **Security:** Helmet (HTTP Headers) & Express-Mongo-Sanitize

---

## ✨ Key Features

### 👤 User Management & Auth
*   **Role-Based Access Control (RBAC):** Distinct workflows for Admin, Client, and Vendor.
*   **Hybrid Authentication:** Secure JWT-based login/register alongside **OAuth 2.0 Social Integration** for seamless, one-click onboarding.
*   **Secure Password Management:** Encrypted storage with Bcrypt and a full "Forgot Password" flow with secure token-based email resets.
*   **Profile Control:** Users can view and update their company and personal profiles.

### 📝 Tender Management
*   **Advanced Discovery:** Powered by **MongoDB Atlas Search**, allowing vendors to perform high-performance full-text searches with fuzzy matching and relevance scoring.
*   **Drafting & Submission:** Clients can create detailed tenders with budget ranges and deadlines.
*   **Admin Moderation:** Tenders enter a pending state until approved by an Admin to go active.
*   **Public Marketplace:** Dynamic filtering and searching for active, open opportunities.

### 🤝 Bidding & Proposal System
*   **Vendor Submissions:** Proposals include cover letters, proposed solutions, and pricing.
*   **Proposal Lifecycle:** Status tracking (Pending, Accepted, Rejected, Withdrawn).
*   **Notifications:** Automated internal notifications trigger when proposals are submitted.

### 🛡 Admin Dashboard
*   **Governance:** Ability to block/unblock users to maintain platform integrity.
*   **Analytics:** Global statistics for total users, active tenders, and submitted proposals.
*   **System Oversight:** Comprehensive view of all platform activity and tender approvals.
