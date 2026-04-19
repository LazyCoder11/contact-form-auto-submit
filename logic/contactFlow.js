// module.exports = async function contactFlow(page, ctx) {
//   const { website, senderName, senderEmail, senderPhone, message } = ctx;

//   // ─────────────────────────────────────────
//   // STEP 1: OPEN WEBSITE
//   // ─────────────────────────────────────────
//   await page.goto(website, { waitUntil: "networkidle2", timeout: 30000 });
//   console.log("Current URL:", await page.url());
//   await new Promise((r) => setTimeout(r, 1500));

//   // ─────────────────────────────────────────
//   // STEP 2: FIND CONTACT PAGE
//   // ─────────────────────────────────────────
//   const contactLink = await page.evaluate(() => {
//     const links = Array.from(document.querySelectorAll("a[href]"));
//     return links.find((a) => a.href.toLowerCase().includes("contact"))?.href;
//   });

//   if (contactLink) {
//     await page.goto(contactLink, { waitUntil: "networkidle2" });
//     await new Promise((r) => setTimeout(r, 1500));
//   }

//   const contactPageUrl = page.url();

//   // ─────────────────────────────────────────
//   // STEP 3: GET VALID INPUTS (FILTERED)
//   // ─────────────────────────────────────────
//   const inputs = await page.$$('input:not([type="hidden"]), textarea');

//   if (!inputs.length) {
//     return {
//       formStatus: "NO_FORM",
//       contactPageUrl,
//     };
//   }

//   // ─────────────────────────────────────────
//   // STEP 4: FILL FORM (REAL USER SIMULATION)
//   // ─────────────────────────────────────────
//   for (const input of inputs) {
//     const meta = await input.evaluate((el) => {
//       const label = el.id
//         ? document.querySelector(`label[for="${el.id}"]`)?.innerText || ""
//         : "";

//       return {
//         name: (el.name || "").toLowerCase(),
//         placeholder: (el.placeholder || "").toLowerCase(),
//         label: label.toLowerCase(),
//         tag: el.tagName.toLowerCase(),
//         type: (el.type || "").toLowerCase(),
//       };
//     });

//     const text = `${meta.name} ${meta.placeholder} ${meta.label}`;

//     try {
//       if (text.includes("name")) {
//         await input.click({ clickCount: 3 });
//         await input.type(senderName, { delay: 40 });
//       } else if (text.includes("email")) {
//         await input.click({ clickCount: 3 });
//         await input.type(senderEmail, { delay: 40 });
//       } else if (text.includes("phone") || text.includes("tel")) {
//         await input.click({ clickCount: 3 });
//         await input.type(senderPhone, { delay: 40 });
//       } else if (meta.tag === "textarea" || text.includes("message")) {
//         await input.click({ clickCount: 3 });
//         await input.type(message, { delay: 20 });
//       }
//     } catch (err) {
//       console.log("⚠️ Skipped field:", meta);
//     }
//   }

//   await new Promise((r) => setTimeout(r, 800));

//   // ─────────────────────────────────────────
//   // STEP 5: SUBMIT FORM (FIXED)
//   // ─────────────────────────────────────────
//   const submitButton = await page.$(
//     'button[type="submit"], input[type="submit"]',
//   );

//   let submitted = false;

//   if (submitButton) {
//     await submitButton.click();
//     submitted = true;
//   } else {
//     // fallback submit
//     await page.evaluate(() => {
//       const form = document.querySelector("form");
//       form?.submit();
//     });
//     submitted = true;
//   }

//   await new Promise((r) => setTimeout(r, 3000));

//   // ─────────────────────────────────────────
//   // STEP 6: RETURN RESULT
//   // ─────────────────────────────────────────
//   return {
//     formStatus: submitted ? "SUBMITTED" : "FAILED",
//     contactPageUrl,
//     finalUrl: page.url(),
//   };
// };

module.exports = async function contactFlow(page, ctx) {
  const { website, senderName, senderEmail, senderPhone, message } = ctx;

  await page.goto(website, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // ─────────────────────────────
  // FIND CONTACT PAGE
  // ─────────────────────────────
  const contactLink = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a")).find((a) =>
      a.href.toLowerCase().includes("contact"),
    )?.href;
  });

  if (contactLink) {
    await page.goto(contactLink, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));
  }

  const contactPageUrl = page.url();

  // ─────────────────────────────
  // EXTRACT FORM STRUCTURE (ADVANCED)
  // ─────────────────────────────
  const fields = await page.evaluate(() => {
    const form = document.querySelector("form");
    if (!form) return null;

    return Array.from(form.querySelectorAll("input, textarea, select")).map(
      (el) => {
        const label = el.id
          ? document.querySelector(`label[for="${el.id}"]`)?.innerText || ""
          : "";

        return {
          tag: el.tagName.toLowerCase(),
          type: (el.type || "").toLowerCase(),
          name: (el.name || "").toLowerCase(),
          placeholder: (el.placeholder || "").toLowerCase(),
          label: label.toLowerCase(),
          required: el.required || el.getAttribute("aria-required") === "true",
          options:
            el.tagName === "SELECT"
              ? Array.from(el.options).map((o) => o.value)
              : [],
        };
      },
    );
  });

  if (!fields) {
    return { formStatus: "NO_FORM", contactPageUrl };
  }

  // ─────────────────────────────
  // FILL FORM (SMART ENGINE)
  // ─────────────────────────────
  const elements = await page.$$("input:not([type=hidden]), textarea, select");

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const meta = fields[i];

    if (!meta) continue;

    const text = `${meta.name} ${meta.placeholder} ${meta.label}`;

    try {
      // NAME
      if (text.includes("name")) {
        await el.click({ clickCount: 3 });
        await el.type(senderName, { delay: 30 });
      }

      // EMAIL
      else if (text.includes("email")) {
        await el.click({ clickCount: 3 });
        await el.type(senderEmail, { delay: 30 });
      }

      // PHONE
      else if (text.includes("phone") || text.includes("tel")) {
        await el.click({ clickCount: 3 });
        await el.type(senderPhone, { delay: 30 });
      }

      // MESSAGE
      else if (meta.tag === "textarea" || text.includes("message")) {
        await el.click({ clickCount: 3 });
        await el.type(message, { delay: 20 });
      }

      // SELECT (🔥 important)
      else if (meta.tag === "select" && meta.options.length) {
        await page.select(
          await el.evaluate((e) => e.name),
          meta.options[1] || meta.options[0],
        );
      }

      // REQUIRED UNKNOWN FIELD (🔥 fallback)
      else if (meta.required) {
        await el.click({ clickCount: 3 });
        await el.type("Test", { delay: 20 });
      }
    } catch (err) {
      console.log("⚠️ Skipped:", meta.name);
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // ─────────────────────────────
  // SUBMIT FORM
  // ─────────────────────────────
  const btn = await page.$('button[type="submit"], input[type="submit"]');

  if (btn) {
    await btn.click();
  } else {
    await page.evaluate(() => {
      document.querySelector("form")?.submit();
    });
  }

  await new Promise((r) => setTimeout(r, 3000));

  // ─────────────────────────────
  // RETURN RESULT
  // ─────────────────────────────
  return {
    formStatus: "SUBMITTED",
    contactPageUrl,
    finalUrl: page.url(),
  };
};
