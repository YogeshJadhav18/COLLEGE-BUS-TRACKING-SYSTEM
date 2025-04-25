import { Telegraf } from "telegraf";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBZEdKIXhLCxbmkTnS_xfNR490-jKlf9yw",
  authDomain: "my-collage-bus-tracker-964e8.firebaseapp.com",
  projectId: "my-collage-bus-tracker-964e8",
  storageBucket: "my-collage-bus-tracker-964e8.appspot.com",
  messagingSenderId: "127234319162",
  appId: "1:127234319162:web:b1965e4abaa5ec0fe26603",
  databaseURL: "https://my-collage-bus-tracker-964e8-default-rtdb.firebaseio.com",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Telegram Bot Tokens
const bot101 = new Telegraf("7575195079:AAGqQ0Bh_T1n8CLiDwt7xbCRaDN--pTFWJA");
const bot102 = new Telegraf("7910437475:AAHFxBWru92beLN5Lx9XZAGpk9IghkLHHrc");

// 📌 Handle Regular Live Location
const handleLocationUpdate = (ctx, busNumber) => {
  if (!ctx.message || !ctx.message.location) {
    ctx.reply("❌ Please send a valid live location.");
    return;
  }

  const { latitude, longitude } = ctx.message.location;

  set(ref(database, `busLocations/${busNumber}`), {
    lat: latitude,
    lng: longitude,
  });
  console.log(`Bus ${busNumber} Location Updated:`, latitude, longitude);



  ctx.reply(`📍 Location updated for Bus ${busNumber}!`);
};

// 📌 Handle Edited Live Location (for moving updates)
const handleEditedLocationUpdate = (ctx, busNumber) => {
  const loc = ctx.update.edited_message?.location;
  if (!loc) return;

  set(ref(database, `busLocations/${busNumber}`), {
    lat: loc.latitude,
    lng: loc.longitude,
  });
};

// 📌 Setup Bot 101
bot101.start((ctx) => ctx.reply("Welcome Driver of Bus 101! 🚍 Send your live location."));
bot101.on("location", (ctx) => handleLocationUpdate(ctx, "101"));
bot101.on("edited_message", (ctx) => handleEditedLocationUpdate(ctx, "101"));
bot101.launch();

// 📌 Setup Bot 102
bot102.start((ctx) => ctx.reply("Welcome Driver of Bus 102! 🚍 Send your live location."));
bot102.on("location", (ctx) => handleLocationUpdate(ctx, "102"));
bot102.on("edited_message", (ctx) => handleEditedLocationUpdate(ctx, "102"));
bot102.launch();

console.log("🚀 Telegram Bots for Bus 101 & 102 are running...");
