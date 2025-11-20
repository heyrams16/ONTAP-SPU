# ONTAP-SPU Showcase Setup Guide

## 🎉 Winner of HackSPU 2025
**Campus Marketplace for Student Services**

---

## Quick Setup for Data Science Showcase

### Prerequisites
- ✅ Laptop/Computer running the app
- ✅ WiFi network (all devices must be on same network)
- ✅ Your local IP: **192.168.0.119**

---

## Step 1: Start the Application

1. **Navigate to project directory:**
   ```bash
   cd /Users/admin/your-project
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. **Wait for both servers to start:**
   - Backend: http://localhost:5000 ✅
   - Frontend: http://localhost:3000 ✅

---

## Step 2: Access on Local Network

### Your Access URLs:
- **Local (on your laptop):** http://localhost:3000
- **Network (on phones):** http://192.168.0.119:3000

### For Showcase Attendees:
1. **Connect to WiFi:** Ensure all phones are on the same WiFi network as your laptop
2. **Scan QR Code:** Use phone camera to scan QR code from showcase page
3. **Or Type URL:** http://192.168.0.119:3000

---

## Step 3: Display Showcase Page

### Option A: In-App Showcase Page
Navigate to: **http://localhost:3000/showcase**
- Shows QR code
- Lists all demo accounts
- Instructions for attendees
- Features overview

### Option B: Printable Poster
Open in browser: **/Users/admin/your-project/SHOWCASE_POSTER.html**
- Print this for a physical poster
- Or display on a screen
- Contains QR code and login info

---

## Demo Accounts (10 Available)

All accounts have the same password: **demo123**

| User # | Email |
|--------|-------|
| 1 | demo1@saintpeters.edu |
| 2 | demo2@saintpeters.edu |
| 3 | demo3@saintpeters.edu |
| 4 | demo4@saintpeters.edu |
| 5 | demo5@saintpeters.edu |
| 6 | demo6@saintpeters.edu |
| 7 | demo7@saintpeters.edu |
| 8 | demo8@saintpeters.edu |
| 9 | demo9@saintpeters.edu |
| 10 | demo10@saintpeters.edu |

---

## What Attendees Can Explore

### 🛍️ Browse Services (15 services available)
- **Rides:** Airport shuttle, NYC carpool, late night campus rides
- **Tutoring:** Python, Math, Spanish, Business tutoring
- **Errands:** Grocery shopping, package delivery, laundry service
- **Campus Tasks:** Moving help, tech support, resume review, photography

### 🎓 College Zone (8 student profiles)
- Browse student profiles from multiple universities
- Filter by major, year, interests
- View detailed profiles with bios and interests
- Create your own student profile

### 📅 Book Services
- Select a service
- Choose date and time
- Add meeting location and notes
- Manage bookings in "My Bookings"

### ➕ Create Offerings
- Offer your own service
- Create student profile
- Set pricing and availability

---

## Troubleshooting

### If phones can't access the app:

1. **Check WiFi Connection**
   - Ensure laptop and phones are on SAME network
   - Check your laptop's IP address hasn't changed:
     ```bash
     ifconfig | grep "inet " | grep -v 127.0.0.1
     ```

2. **Check Firewall**
   - macOS: System Preferences → Security & Privacy → Firewall
   - Allow Node.js connections

3. **Restart Servers**
   - Stop the app (Ctrl+C)
   - Run `npm run dev` again

4. **Get Current IP**
   - Run: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Update QR code with new IP if changed

### If services don't show:

```bash
# Re-seed the database
node server/seedServices.js
node server/seedProfiles.js
node server/seedDemoUsers.js
```

---

## Database Contents

- **Users:** 8 real profiles + 10 demo accounts
- **Services:** 15 diverse services across 4 categories
- **Student Profiles:** 8 profiles from multiple universities

---

## During the Showcase

### Setup Checklist:
- [ ] App running (npm run dev)
- [ ] Showcase page open (localhost:3000/showcase)
- [ ] QR code displayed or printed
- [ ] Test access from your phone
- [ ] All 10 demo accounts working
- [ ] Services visible when browsing

### For Presenting:
1. Show the home page
2. Display the showcase page with QR code
3. Let attendees scan and login
4. Guide them to explore features
5. Demonstrate booking a service
6. Show College Zone profiles

---

## Presentation Talking Points

🎯 **Problem:** Students lack verified, affordable help for rides, tutoring, errands, and campus tasks

💡 **Solution:** ONTAP-SPU - A trusted peer-to-peer marketplace for campus services

🏆 **Achievement:** Winner of HackSPU 2025

🛠️ **Tech Stack:**
- Frontend: React with React Router
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Real-time: REST API

✨ **Key Features:**
- Service marketplace (15+ services)
- Student verification (@.edu emails)
- Booking system with status tracking
- Rating & reviews
- College Zone for networking
- Multi-university support

---

## After the Showcase

To stop the application:
```bash
# Press Ctrl+C in the terminal
```

To start again later:
```bash
npm run dev
```

---

## Contact

**Developer:** Heyram Srinivasan
**Email:** heyrams@saintpeters.edu
**Event:** Saint Peters University Data Science Showcase

---

**Good luck with your showcase! 🎉**
