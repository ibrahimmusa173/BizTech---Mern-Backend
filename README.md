# BizTech - Mern-Backend

### 🛠 Tech Stack
*   **Runtime Environment:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Search Engine:** MongoDB Atlas Search (Lucene-based full-text search)
*   **Authentication:** JSON Web Tokens (JWT), OAuth 2.0 (Google/GitHub) & Bcrypt.js
*   **Payment Processing:** Stripe API & Webhooks 
*   **Communication:** Nodemailer (Email Service)
*   **Security:** Helmet (HTTP Headers) & Express-Mongo-Sanitize

---

### ✨ Key Features

#### 👤 User Management & Auth
*   **Role-Based Access Control (RBAC):** Distinct workflows for Admin, Client, and Vendor.
*   **Hybrid Authentication:** Secure JWT-based login/register alongside OAuth 2.0 Social Integration.
*   **Secure Password Management:** Encrypted storage with Bcrypt and a full "Forgot Password" flow.
*   **Profile Control:** Users can view and update their company and personal profiles.

#### 💎 Premium Vendor System (Monetization)
*   **Stripe Integration:** Secure checkout flow for vendors to purchase "Featured Status."
*   **Featured Vendor Badge:** Payment grants a "Featured" badge, increasing visibility across the marketplace.
*   **Exclusive Data Access:** Only Featured Vendors can unlock and view sensitive client contact details (Email/Phone) for active tenders.
*   **Automated Expiry:** System automatically manages subscription duration and reverts users to standard status upon expiration.

#### 📝 Tender Management
*   **Advanced Discovery:** Powered by MongoDB Atlas Search, allowing vendors to perform high-performance full-text searches with fuzzy matching.
*   **Drafting & Submission:** Clients can create detailed tenders with budget ranges and deadlines.
*   **Admin Moderation:** Tenders enter a pending state until approved by an Admin to go active.
*   **Public Marketplace:** Dynamic filtering and searching for active, open opportunities.

#### 🤝 Bidding & Proposal System
*   **Vendor Submissions:** Proposals include cover letters, proposed solutions, and pricing.
*   **Proposal Lifecycle:** Status tracking (Pending, Accepted, Rejected, Withdrawn).
*   **Notifications:** Automated internal notifications trigger when proposals are submitted.

#### 🛡 Admin Dashboard
*   **Governance:** Ability to block/unblock users to maintain platform integrity.
*   **Analytics:** Global statistics for total users, revenue, active tenders, and submitted proposals.
*   **System Oversight:** Comprehensive view of all platform activity and tender approvals.
Proposal Lifecycle: Status tracking (Pending, Accepted, Rejected, Withdrawn).
Notifications: Automated internal notifications trigger when proposals are submitted or statuses change.
🛡 Admin Dashboard
Governance: Ability to block/unblock users to maintain platform integrity.
Analytics: Global statistics for total users, revenue from featured memberships, active tenders, and submitted proposals.
System Oversight: Comprehensive view of all platform activity and tender approvals.

### 🛡 Admin Dashboard
*   **Governance:** Ability to block/unblock users to maintain platform integrity.
*   **Analytics:** Global statistics for total users, active tenders, and submitted proposals.
*   **System Oversight:** Comprehensive view of all platform activity and tender approvals.
