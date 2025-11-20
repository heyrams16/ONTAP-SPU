# Mac WiFi Hotspot Setup for ONTAP-SPU Showcase

## Problem
Your phone can't access the app even on same WiFi because:
- Router has "Client Isolation" or "AP Isolation" enabled
- Prevents devices from talking to each other on the network

## Solution: Create WiFi Hotspot from Your Mac

This makes your Mac the WiFi router, so phones connect directly to it!

---

## Step 1: Set Up Mac as Hotspot

### Option A: Using System Settings (Recommended)

1. **Click Apple menu** (top left) → **System Settings** (or System Preferences)

2. **Go to "Sharing"** (or "General" → "Sharing" on newer macOS)

3. **Enable Internet Sharing:**
   - Click "Internet Sharing" in the left sidebar
   - **Share your connection from:** Ethernet (or WiFi if you're using Ethernet)
   - **To computers using:** Wi-Fi

4. **Configure WiFi Options:**
   - Click "Wi-Fi Options" or "Edit" button
   - **Network Name:** ONTAP-Showcase
   - **Channel:** 6 or 11
   - **Security:** WPA2 Personal
   - **Password:** demo2025
   - Click **OK**

5. **Turn on Internet Sharing:**
   - Check the box next to "Internet Sharing"
   - Click **Start** when prompted

6. **Your hotspot is now active!** 🎉

---

## Step 2: Find Your Hotspot IP Address

Run this command to get your IP:

```bash
ifconfig bridge100 | grep "inet " | awk '{print $2}'
```

**Typical hotspot IP:** `192.168.2.1`

---

## Step 3: Connect Phones to Hotspot

### On Each Phone:

1. **Go to WiFi Settings**
2. **Look for network:** ONTAP-Showcase
3. **Password:** demo2025
4. **Connect!**

---

## Step 4: Access ONTAP on Phones

Once connected to the hotspot, phones can access:

- **Main URL:** http://192.168.2.1:3000
- **Showcase Page:** http://192.168.2.1:3000/showcase

**Demo Login:**
- Email: demo1@saintpeters.edu (to demo10)
- Password: demo123

---

## Quick Setup Commands

If you prefer command line:

```bash
# 1. Check if Internet Sharing is available
sudo ifconfig bridge100

# 2. Get your hotspot IP
ifconfig bridge100 | grep "inet " | awk '{print $2}'

# 3. Test if server is accessible
curl -I http://192.168.2.1:3000
```

---

## Troubleshooting

### If hotspot won't start:
1. Disconnect from current WiFi first
2. Use Ethernet connection if available
3. Try different WiFi channel (1, 6, or 11)

### If phones can't see the hotspot:
1. Make sure "Internet Sharing" is checked/enabled
2. Restart the Mac
3. Try turning hotspot off and on again

### If phones connect but can't access app:
1. Verify app is running: `npm run dev`
2. Check hotspot IP: `ifconfig bridge100`
3. Make sure URL is: http://[hotspot-ip]:3000

---

## Alternative: Use USB Tethering

If hotspot doesn't work, use USB:

1. Connect phone to Mac via USB cable
2. On phone: Enable "Personal Hotspot" and "USB Only"
3. Mac will connect through phone's network
4. This creates a direct connection

---

## For the Showcase

### Before Showcase:
1. ✅ Create hotspot: ONTAP-Showcase
2. ✅ Password: demo2025
3. ✅ Get hotspot IP (usually 192.168.2.1)
4. ✅ Start app: `npm run dev`
5. ✅ Test on your phone first

### During Showcase:
1. Tell attendees:
   - WiFi: ONTAP-Showcase
   - Password: demo2025
   - URL: http://192.168.2.1:3000/showcase

2. Show QR code (it will auto-detect the IP)

3. Up to 10 devices can connect simultaneously

---

## Capacity

**Mac WiFi Hotspot can support:**
- Up to 5-10 devices comfortably
- Perfect for your showcase!
- No router needed

---

## To Turn Off After Showcase

1. System Settings → Sharing
2. Uncheck "Internet Sharing"
3. Done!

---

## Benefits of This Approach

✅ **No router issues** - You control everything
✅ **Fast connection** - Direct to Mac
✅ **10+ devices** - Plenty for showcase
✅ **Portable** - Works anywhere
✅ **Secure** - Password protected

---

**You're all set! Create the hotspot and you're ready to showcase! 🎉**
