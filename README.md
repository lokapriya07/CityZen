
# CityZen Clean - Smart Waste Reporting System

## 📌 Project Overview
CityZen Clean is a smart waste management platform where users can **report waste or garbage spots**, track the progress of their report in real-time, and contribute towards a cleaner community. The system provides a seamless experience for **users, workers, and admins** to manage and resolve cleanliness issues efficiently.

## 🚀 Key Features

### ✅ User Features
- **Report Waste Spots** with location, description, and image.
- **Image Verification System** to detect fake or internet-downloaded images and only accept real garbage images.
- **Report Status Tracking** (like Amazon order tracking):
  - *Submitted → Under Review → Worker Assigned → On The Way → Completed*
- **Contact Support/Worker** once a worker is assigned.
- **Rate and Review Service** after task completion.
- **Earn Rewards & Coupons** for every valid report, redeemable in the rewards section.

### 🛠 Admin Features
- **View & Manage All Reports** in a dashboard.
- **Automatic or One-Click Worker Assignment** based on nearest/location-based workers.
- **Analytics & Insights:**
  - Heatmap of most reported areas.
  - Complaint trends & area-level performance.
  - Community insights & campaign creation.
- **User Rewards & Worker Badges Management**.

### 👷 Worker Features
- **Dedicated Worker Dashboard** to:
  - View assigned tasks.
  - Accept or reject work requests.
  - Navigate to location using Google Maps.
- **Performance Analytics:**
  - Average task completion time.
  - Ratings given by users.
  - Earned points and badges from admin.

## 💡 Workflow Summary
1. User submits a report with location + image.
2. Image verification checks for authenticity (rejects fake/internet images).
3. Admin/system assigns the task to the nearest worker.
4. Worker accepts task → navigates to the location.
5. User can track status in real-time.
6. Once completed, the user rates the service & receives reward points/coupons.

## 🛡 Spam/Fake Report Prevention
✔ AI-based **image validation** – accepts only real garbage images.  
✔ Blocks random internet-downloaded or unrelated images.  
✔ Reduces spam and fake complaints efficiently.

## 🎖 Rewards & Gamification
- Users get **reward points & coupons** for valid reports.  
- **Top community contributors** receive special recognition.  
- Workers can earn **badges & performance bonuses** based on ratings and completion speed.

## 📊 Technology Modules
| Module | Description |
|--------|-------------|
| User App | Report spot, track status, rate, rewards |
| Admin Dashboard | Manage reports, analytics, heatmaps |
| Worker App | View tasks, navigate, update status |
| Image Verification | AI model to detect fake/real images |


## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **Authentication**: JWT-based secure login
- **Mapping & Navigation**: Google Maps API for locating tasks and navigation for workers
- **Image Verification (Anti-Spam)**: AI-powered model to verify real waste images and block fake or internet images

## 🤖 Future Enhancements
- **AI Chat Agent**: Interactive chatbot for users, admins, and workers to assist with reporting, status updates, FAQs, task acceptance, and support queries
- **Smart Route Optimization for Workers** using AI and real-time traffic data
- **Voice-Based Reporting System** for accessibility
- **Social media** sharing of completed tasks.
- **Multilingual Support** for better user reach
