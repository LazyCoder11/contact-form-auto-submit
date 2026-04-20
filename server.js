const express = require("express");
const puppeteer = require("puppeteer");

const isProduction = process.env.NODE_ENV === "production";
const app = express();
app.use(express.json({ limit: "2mb" }));

// const findContactForm = require("./logic/contactForm");
const contactFlow = require("./logic/contactFlow");

let browser;

// 🔥 Reuse browser instance
async function getBrowser() {
  if (!browser) {
    const fs = require("fs");
    const snapPath = "/snap/bin/chromium";
    const executablePath =
      process.platform === "linux" && fs.existsSync(snapPath)
        ? snapPath
        : undefined;

    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    });
  }
  return browser;
}

// 🎯 ACTION HANDLERS
// const handlers = {
//   goto: async (page, action, ctx) => {
//     await page.goto(ctx.url, { waitUntil: "networkidle2", timeout: 30000 });
//   },

//   wait: async (page, action) => {
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//   },

//   waitForSelector: async (page, action) => {
//     await page.waitForSelector(action.selector, { timeout: 10000 });
//   },

//   click: async (page, action) => {
//     await page.click(action.selector);
//   },

//   type: async (page, action) => {
//     await page.type(action.selector, action.text);
//   },

//   evaluate: async (page, action) => {
//     return await page.evaluate(new Function(`return (${action.fn})`)());
//   },

//   extractForms: async (page) => {
//     return await page.evaluate(() => {
//       return Array.from(document.querySelectorAll("form")).map((f) => ({
//         action: f.action,
//         method: f.method,
//         inputs: Array.from(f.querySelectorAll("input, textarea")).map((i) => ({
//           name: i.name,
//           type: i.type,
//           placeholder: i.placeholder,
//         })),
//       }));
//     });
//   },
// };

app.post("/run", async (req, res) => {
  const { website, task } = req.body;

  let page;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    let result;

    if (task === "contactFlow") {
      result = await contactFlow(page, req.body.data);
    }

    await page.close();

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (page) await page.close();

    res.json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Puppeteer Engine running on port 3000");
});

// 🚀 MAIN API
// app.post("/run", async (req, res) => {
//   const { url, actions } = req.body;

//   if (!url || !actions) {
//     return res.status(400).json({ error: "Missing url or actions" });
//   }

//   let page;
//   const results = {};

//   try {
//     const browser = await getBrowser();
//     page = await browser.newPage();

//     for (const action of actions) {
//       const handler = handlers[action.type];
//       if (!handler) continue;

//       const result = await handler(page, action, { url });

//       if (action.saveAs) {
//         results[action.saveAs] = result;
//       }
//     }

//     await page.close();

//     res.json({
//       success: true,
//       data: results,
//     });
//   } catch (err) {
//     if (page) await page.close();

//     res.json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
