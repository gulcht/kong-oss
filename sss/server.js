require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// ดึงค่า Algorithm, Key, และ Secret จาก Environment Variables
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'; // Default เป็น HS256
const JWT_KEY = process.env.JWT_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// ตรวจสอบว่าค่า Environment Variables ถูกต้อง
if (!JWT_KEY || !JWT_SECRET) {
  throw new Error('Missing JWT_KEY or JWT_SECRET environment variables');
}

// ตัวแปรสำหรับเก็บ Token และเวลาหมดอายุ
let BEARER_TOKEN = null;
let TOKEN_EXPIRATION = null;

// ฟังก์ชันสำหรับสร้าง JWT Token
function generateToken() {
  const payload = {
    iss: JWT_KEY, // ตัวออก token
  };

  const options = {
    algorithm: JWT_ALGORITHM,
    expiresIn: '15m', // กำหนดเวลาหมดอายุ
  };

  const token = jwt.sign(payload, JWT_SECRET, options);
  
  // Decode token เพื่อหาวันหมดอายุ
  const decoded = jwt.decode(token);
  TOKEN_EXPIRATION = decoded.exp * 1000; // Convert to milliseconds

  return token;
}

// ฟังก์ชันสำหรับตรวจสอบและจัดการ Token
function getValidToken() {
  const now = Date.now();
  
  // หาก Token ไม่มีหรือหมดอายุแล้ว ให้สร้างใหม่
  if (!BEARER_TOKEN || !TOKEN_EXPIRATION || now >= TOKEN_EXPIRATION) {
    BEARER_TOKEN = generateToken();
  }
  
  return BEARER_TOKEN;
}

app.get('/checkInventory', async (req, res) => {
  try {
    // ตรวจสอบ Token และรับ Token ที่ใช้งานได้
    const token = getValidToken();

    // เรียก API พร้อมส่ง Token ใน Header
    const response = await fetch('http://api.got.co.th/inventory/getItems', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching inventory: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response
    res.json({
      message: 'Data fetched from Inventory Service',
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Order service listening at http://localhost:${port}`);
});
