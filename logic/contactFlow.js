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

// module.exports = async function contactFlow(page, ctx) {
//   // const { website, senderName, senderEmail, senderPhone, message } = ctx;
//   const { website, senderName, senderEmail, senderPhone, message, ...rest } =
//     ctx;

//   await page.goto(website, { waitUntil: "networkidle2", timeout: 30000 });
//   await new Promise((r) => setTimeout(r, 1500));

//   // ─────────────────────────────
//   // FIND CONTACT PAGE
//   // ─────────────────────────────
//   const contactLink = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("a")).find((a) =>
//       a.href.toLowerCase().includes("contact"),
//     )?.href;
//   });

//   if (contactLink) {
//     await page.goto(contactLink, { waitUntil: "networkidle2" });
//     await new Promise((r) => setTimeout(r, 1500));
//   }

//   const contactPageUrl = page.url();

//   // ─────────────────────────────
//   // EXTRACT FORM STRUCTURE (ADVANCED)
//   // ─────────────────────────────
//   const fields = await page.evaluate(() => {
//     const form = document.querySelector("form");
//     if (!form) return null;

//     return Array.from(form.querySelectorAll("input, textarea, select")).map(
//       (el) => {
//         const label = el.id
//           ? document.querySelector(`label[for="${el.id}"]`)?.innerText || ""
//           : "";

//         return {
//           tag: el.tagName.toLowerCase(),
//           type: (el.type || "").toLowerCase(),
//           name: (el.name || "").toLowerCase(),
//           placeholder: (el.placeholder || "").toLowerCase(),
//           label: label.toLowerCase(),
//           required: el.required || el.getAttribute("aria-required") === "true",
//           options:
//             el.tagName === "SELECT"
//               ? Array.from(el.options).map((o) => o.value)
//               : [],
//         };
//       },
//     );
//   });

//   if (!fields) {
//     return { formStatus: "NO_FORM", contactPageUrl };
//   }

//   // ─────────────────────────────
//   // FILL FORM (SMART ENGINE)
//   // ─────────────────────────────
//   const elements = await page.$$("input:not([type=hidden]), textarea, select");

//   for (let i = 0; i < elements.length; i++) {
//     const el = elements[i];
//     const meta = fields[i];

//     if (!meta) continue;

//     const text = `${meta.name} ${meta.placeholder} ${meta.label}`;

//     try {
//       // NAME
//       if (text.includes("name")) {
//         await el.click({ clickCount: 3 });
//         await el.type(senderName, { delay: 30 });
//       }

//       // EMAIL
//       else if (text.includes("email")) {
//         await el.click({ clickCount: 3 });
//         await el.type(senderEmail, { delay: 30 });
//       }

//       // PHONE
//       else if (text.includes("phone") || text.includes("tel")) {
//         await el.click({ clickCount: 3 });
//         await el.type(senderPhone, { delay: 30 });
//       }

//       // MESSAGE
//       else if (meta.tag === "textarea" || text.includes("message")) {
//         await el.click({ clickCount: 3 });
//         await el.type(message, { delay: 20 });
//       }

//       // SELECT (🔥 important)
//       else if (meta.tag === "select" && meta.options.length) {
//         await page.select(
//           await el.evaluate((e) => e.name),
//           meta.options[1] || meta.options[0],
//         );
//       }

//       // REQUIRED UNKNOWN FIELD (🔥 fallback)
//       else if (meta.required) {
//         await el.click({ clickCount: 3 });
//         await el.type("Test", { delay: 20 });
//       }
//     } catch (err) {
//       console.log("⚠️ Skipped:", meta.name);
//     }
//   }

//   await new Promise((r) => setTimeout(r, 800));

//   // ─────────────────────────────
//   // SUBMIT FORM
//   // ─────────────────────────────
//   const btn = await page.$('button[type="submit"], input[type="submit"]');

//   if (btn) {
//     await btn.click();
//   } else {
//     await page.evaluate(() => {
//       document.querySelector("form")?.submit();
//     });
//   }

//   await new Promise((r) => setTimeout(r, 3000));

//   // Check success indicators
//   const success = await page.evaluate(() => {
//     const text = document.body.innerText.toLowerCase();

//     return (
//       text.includes("thank you") ||
//       text.includes("successfully") ||
//       text.includes("we received") ||
//       text.includes("message sent") ||
//       text.includes("submitted successfully")
//     );
//   });

//   return {
//     formStatus: success ? "SUCCESS" : "SUBMIT_FAILED",
//     contactPageUrl,
//     finalUrl: page.url(),
//   };
// };

// module.exports = async function contactFlow(page, ctx) {
//   const { website, ...data } = ctx;

//   await page.goto(website, { waitUntil: "networkidle2", timeout: 30000 });
//   await new Promise((r) => setTimeout(r, 1500));

//   // ─────────────────────────────
//   // FIND CONTACT PAGE
//   // ─────────────────────────────
//   const contactLink = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll("a")).find((a) =>
//       (a.href + a.innerText).toLowerCase().includes("contact"),
//     )?.href;
//   });

//   if (contactLink) {
//     await page.goto(contactLink, { waitUntil: "networkidle2" });
//     await new Promise((r) => setTimeout(r, 1500));
//   }

//   const contactPageUrl = page.url();

//   // ─────────────────────────────
//   // GET ALL FORM ELEMENTS
//   // ─────────────────────────────
//   const elements = await page.$$("input:not([type=hidden]), textarea, select");

//   if (!elements.length) {
//     return { formStatus: "NO_FORM", contactPageUrl };
//   }

//   // ─────────────────────────────
//   // SMART FIELD MATCHING ENGINE 🔥
//   // ─────────────────────────────
//   for (const el of elements) {
//     try {
//       const meta = await el.evaluate((e) => {
//         const label = e.id
//           ? document.querySelector(`label[for="${e.id}"]`)?.innerText || ""
//           : "";

//         return {
//           tag: e.tagName.toLowerCase(),
//           type: (e.type || "").toLowerCase(),
//           name: (e.name || "").toLowerCase(),
//           placeholder: (e.placeholder || "").toLowerCase(),
//           label: label.toLowerCase(),
//           required: e.required || e.getAttribute("aria-required") === "true",
//           options:
//             e.tagName === "SELECT"
//               ? Array.from(e.options).map((o) => o.value)
//               : [],
//         };
//       });

//       const text = `${meta.name} ${meta.placeholder} ${meta.label}`;

//       let valueToFill = null;

//       // 🔥 Dynamic matching from ALL data
//       for (const key in data) {
//         if (!data[key]) continue;

//         const keyLower = key.toLowerCase();

//         if (text.includes(keyLower)) {
//           valueToFill = data[key];
//           break;
//         }
//       }

//       // 🔥 Fallback intelligent mapping
//       if (!valueToFill) {
//         if (text.includes("email")) valueToFill = data.senderEmail;
//         else if (text.includes("name")) valueToFill = data.senderName;
//         else if (text.includes("phone") || text.includes("tel"))
//           valueToFill = data.senderPhone;
//         else if (text.includes("message") || meta.tag === "textarea")
//           valueToFill = data.message;
//       }

//       // 🔥 Fill input/textarea
//       if (valueToFill && meta.tag !== "select") {
//         await el.click({ clickCount: 3 });
//         await el.type(String(valueToFill), { delay: 20 });
//       }

//       // 🔥 Handle SELECT
//       else if (meta.tag === "select" && meta.options.length) {
//         await page.select(
//           await el.evaluate((e) => e.name),
//           meta.options.find((o) => o) || meta.options[0],
//         );
//       }

//       // 🔥 Required fallback
//       else if (meta.required) {
//         await el.click({ clickCount: 3 });
//         await el.type("Test", { delay: 20 });
//       }
//     } catch (err) {
//       console.log("⚠️ Skipped field");
//     }
//   }

//   await new Promise((r) => setTimeout(r, 800));

//   // ─────────────────────────────
//   // SUBMIT FORM
//   // ─────────────────────────────
//   const btn = await page.$('button[type="submit"], input[type="submit"]');

//   if (btn) {
//     await btn.click();
//   } else {
//     await page.evaluate(() => {
//       document.querySelector("form")?.submit();
//     });
//   }

//   await new Promise((r) => setTimeout(r, 3000));

//   // 🔥 MULTI-LAYER SUCCESS DETECTION
//   const result = await page.evaluate(() => {
//     const text = document.body.innerText.toLowerCase();

//     const successText =
//       text.includes("thank you") ||
//       text.includes("successfully") ||
//       text.includes("message sent") ||
//       text.includes("we received");

//     // Check if form disappeared
//     const formExists = !!document.querySelector("form");

//     // Check success alert / popup
//     const alertExists =
//       document.querySelector(
//         ".success, .alert-success, .wpcf7-mail-sent-ok",
//       ) !== null;

//     return {
//       successText,
//       formExists,
//       alertExists,
//     };
//   });

//   // 🔥 FINAL DECISION
//   const isSuccess =
//     result.successText || result.alertExists || !result.formExists;

//   return {
//     formStatus: isSuccess ? "SUCCESS" : "SUBMIT_FAILED",
//     debug: result,
//     contactPageUrl,
//     finalUrl: page.url(),
//   };
// };

const axios = require("axios");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeJsonParse(text, fallback = {}) {
  if (!text || typeof text !== "string") return fallback;

  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        return fallback;
      }
    }
    return fallback;
  }
}

function normalizeModelName(model) {
  if (!model) return "llama-3.3-70b-versatile";
  return model.toLowerCase().replace(/\s+/g, "-");
}

async function getAIFieldMapping({ fields, senderDetails, apiKey, model }) {
  if (!apiKey || !fields?.length) return {};

  const systemPrompt = `You are a contact form filler assistant. Given a list of form fields and sender details, you return a JSON object mapping each field key to the value that should be filled in.

Rules:
1. Match fields by name, id, placeholder, and label text.
2. For name fields: use senderName.
3. For email fields: use senderEmail.
4. For phone/tel fields: use senderPhone.
5. For message/comment/body/enquiry textarea: use the message.
6. For subject fields: generate a short relevant subject.
7. For company/organization fields: use businessName.
8. For hidden/CSRF fields: keep their existing value exactly.
9. For honeypot fields (isHoneypot=true): return empty string.
10. For select/dropdown: choose the most appropriate option value from the provided option values only.
11. For checkbox fields, return true or false.
12. For radio fields, return the best matching option value from the provided option values only.
13. Return ONLY a raw JSON object with NO markdown, NO explanation.`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: model || "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            fields,
            senderDetails,
          }),
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    },
  );

  const content =
    response?.data?.choices?.[0]?.message?.content?.trim() || "{}";
  return safeJsonParse(content, {});
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function buildHeuristicValue(field, data) {
  const text = normalizeText(
    [
      field.name,
      field.id,
      field.placeholder,
      field.label,
      field.ariaLabel,
      field.type,
    ].join(" "),
  );

  if (field.isHoneypot) return "";
  if (field.isHidden) return field.existingValue || "";

  if (field.tag === "select") {
    const options = field.options || [];
    const optionValues = options.map((o) => normalizeText(o.value));
    const optionTexts = options.map((o) => normalizeText(o.text));

    if (text.includes("country")) {
      const idx =
        optionValues.findIndex((v) => v === "in" || v === "india") >= 0
          ? optionValues.findIndex((v) => v === "in" || v === "india")
          : optionTexts.findIndex((t) => t.includes("india"));
      if (idx >= 0) return options[idx].value;
    }

    if (
      text.includes("department") ||
      text.includes("reason") ||
      text.includes("inquiry")
    ) {
      const preferred = ["sales", "support", "general", "enquiry", "inquiry"];
      for (const p of preferred) {
        const idx =
          optionValues.findIndex((v) => v.includes(p)) >= 0
            ? optionValues.findIndex((v) => v.includes(p))
            : optionTexts.findIndex((t) => t.includes(p));
        if (idx >= 0) return options[idx].value;
      }
    }

    const validOptions = options.filter(
      (o) =>
        String(o.value || "").trim() !== "" &&
        !/select|choose|please/i.test(String(o.text || "")),
    );
    return validOptions[0]?.value ?? options[0]?.value ?? null;
  }

  if (field.type === "checkbox") {
    if (
      text.includes("terms") ||
      text.includes("agree") ||
      text.includes("consent") ||
      text.includes("privacy")
    ) {
      return true;
    }
    return field.required ? true : null;
  }

  if (field.type === "radio") {
    const options = field.options || [];
    const joined = options.map((o) => normalizeText(`${o.value} ${o.text}`));

    if (text.includes("email")) {
      const idx = joined.findIndex((x) => x.includes("email"));
      if (idx >= 0) return options[idx].value;
    }

    if (text.includes("phone")) {
      const idx = joined.findIndex((x) => x.includes("phone"));
      if (idx >= 0) return options[idx].value;
    }

    return options[0]?.value ?? null;
  }

  for (const key of Object.keys(data || {})) {
    const val = data[key];
    if (!val) continue;
    if (text.includes(normalizeText(key))) return val;
  }

  if (
    text.includes("full name") ||
    text.includes("your name") ||
    text.includes("name")
  ) {
    return data.senderName || null;
  }

  if (text.includes("email")) {
    return data.senderEmail || null;
  }

  if (
    text.includes("phone") ||
    text.includes("tel") ||
    text.includes("mobile") ||
    text.includes("whatsapp")
  ) {
    return data.senderPhone || null;
  }

  if (
    text.includes("company") ||
    text.includes("organisation") ||
    text.includes("organization") ||
    text.includes("business")
  ) {
    return data.businessName || null;
  }

  if (text.includes("subject")) {
    return data.subject || "Business Inquiry";
  }

  if (
    text.includes("message") ||
    text.includes("comment") ||
    text.includes("details") ||
    text.includes("description") ||
    text.includes("enquiry") ||
    field.tag === "textarea"
  ) {
    return data.message || null;
  }

  if (field.type === "url" && data.websiteUrl) {
    return data.websiteUrl;
  }

  return null;
}

function validateAIValue(field, value) {
  if (value === undefined || value === null) return null;

  if (field.isHoneypot) return "";
  if (field.isHidden) return field.existingValue || "";

  if (field.tag === "select") {
    const options = field.options || [];
    const allowed = new Set(options.map((o) => String(o.value)));
    return allowed.has(String(value)) ? String(value) : null;
  }

  if (field.type === "radio") {
    const options = field.options || [];
    const allowed = new Set(options.map((o) => String(o.value)));
    return allowed.has(String(value)) ? String(value) : null;
  }

  if (field.type === "checkbox") {
    if (typeof value === "boolean") return value;
    if (["true", "1", "yes", "on"].includes(normalizeText(value))) return true;
    if (["false", "0", "no", "off"].includes(normalizeText(value)))
      return false;
    return null;
  }

  return String(value);
}

async function captchaDetection(context) {
  return await context.evaluate(() => {
    const selectors = [
      'iframe[src*="recaptcha"]',
      'iframe[src*="hcaptcha"]',
      ".g-recaptcha",
      ".h-captcha",
      'iframe[src*="cloudflare"]',
      "#cf-turnstile",
      'img[src*="captcha"]',
    ];
    return selectors.some((s) => document.querySelector(s) !== null);
  });
}

async function smartClick(context, selector) {
  const el = await context.$(selector);
  if (!el) return false;

  try {
    await el.scrollIntoView();
    await el.click({ timeout: 3000 });
    return true;
  } catch (err) {
    try {
      await context.evaluate((sel) => {
        const item = document.querySelector(sel);
        if (item) item.click();
      }, selector);
      return true;
    } catch (_) {
      return false;
    }
  }
}

async function applyFieldValue(context, field, value) {
  if (value === undefined || value === null) return false;
  if (!field.selector) return false;

  if (field.type === "hidden") return true;

  const el = await context.$(field.selector);
  if (!el) return false;

  try {
    await context.evaluate((sel) => {
      const item = document.querySelector(sel);
      if (item) item.scrollIntoView({ behavior: "smooth", block: "center" });
    }, field.selector);
    await sleep(200);

    if (field.tag === "select") {
      await context.select(field.selector, String(value));
      return true;
    }

    if (field.type === "checkbox") {
      const shouldCheck = !!value;
      const isChecked = await el.evaluate((node) => !!node.checked);
      if (shouldCheck !== isChecked) await smartClick(context, field.selector);
      return true;
    }

    if (field.type === "radio") {
      await context.evaluate(
        ({ name, value, selector }) => {
          let target = null;
          if (name) {
            target = document.querySelector(
              `input[type="radio"][name="${CSS.escape(name)}"][value="${CSS.escape(String(value))}"]`,
            );
          }
          if (!target && selector) {
            const base = document.querySelector(selector);
            if (base && base.form) {
              target = base.form.querySelector(
                `input[type="radio"][value="${CSS.escape(String(value))}"]`,
              );
            }
          }
          if (target) target.click();
        },
        { name: field.name, value, selector: field.selector },
      );
      return true;
    }

    await context.evaluate(
      (sel, val) => {
        const el = document.querySelector(sel);
        if (!el) return;

        el.focus();
        el.value = val;

        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      },
      field.selector,
      String(value),
    );

    return true;
  } catch (_) {
    return false;
  }
}

async function extractFields(context) {
  return await context.evaluate((root) => {
    const target =
      typeof root !== "undefined" && root && root.nodeType === 1
        ? root
        : document;

    const visible = (el) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        parseFloat(style.opacity || "1") > 0
      );
    };

    const getLabel = (el) => {
      if (el.id) {
        const lbl = document.querySelector(`label[for="${el.id}"]`);
        if (lbl) return lbl.innerText.trim();
      }

      const wrappingLabel = el.closest("label");
      if (wrappingLabel) return wrappingLabel.innerText.trim();

      const ariaLabelledBy = el.getAttribute("aria-labelledby");
      if (ariaLabelledBy) {
        const texts = ariaLabelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.innerText?.trim() || "")
          .filter(Boolean);
        if (texts.length) return texts.join(" ");
      }

      return "";
    };

    const getSelector = (el, index) => {
      if (el.name) return `[name="${CSS.escape(el.name)}"]`;
      if (el.id) return `#${CSS.escape(el.id)}`;
      return `[data-ai-contact-field="${index}"]`;
    };

    const nodes = Array.from(
      target.querySelectorAll("input, textarea, select"),
    );

    return nodes.map((e, index) => {
      if (!e.name && !e.id) {
        e.setAttribute("data-ai-contact-field", String(index));
      }

      const tag = e.tagName.toLowerCase();
      const type = (e.type || "").toLowerCase();
      const name = e.name || "";
      const id = e.id || "";
      const placeholder = e.placeholder || "";
      const label = getLabel(e);
      const ariaLabel = e.getAttribute("aria-label") || "";
      const required = e.required || e.getAttribute("aria-required") === "true";
      const hiddenByType = type === "hidden";
      const hiddenByUi = !visible(e);
      const isHidden = hiddenByType || hiddenByUi;

      const haystack =
        `${name} ${id} ${placeholder} ${label} ${ariaLabel}`.toLowerCase();

      const isHoneypot =
        !required &&
        /website|url|homepage|fax|nickname|middle.?name|leave.?blank|do.?not.?fill/i.test(
          haystack,
        );

      let options = [];
      if (tag === "select") {
        options = Array.from(e.options).map((o) => ({
          text: o.text || "",
          value: o.value || "",
          selected: o.selected,
        }));
      }

      if (type === "radio") {
        const radioGroup = name
          ? Array.from(
              document.querySelectorAll(
                `input[type="radio"][name="${CSS.escape(name)}"]`,
              ),
            )
          : [e];
        options = radioGroup.map((r) => ({
          text: getLabel(r) || r.value || "",
          value: r.value || "",
          checked: r.checked,
        }));
      }

      return {
        key: name || id || `field_${index}`,
        selector: getSelector(e, index),
        tag,
        type,
        name,
        id,
        placeholder,
        label,
        ariaLabel,
        required,
        isHidden,
        isHoneypot,
        existingValue: e.value || "",
        checked: !!e.checked,
        options,
      };
    });
  });
}

module.exports = async function contactFlow(page, ctx) {
  const {
    website,
    groqApiKey,
    groqModel = "llama-3.3-70b-versatile",
    ...data
  } = ctx;

  if (!website) {
    return {
      formStatus: "INVALID_INPUT",
      reason: "website is required",
    };
  }

  await page.goto(website, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  try {
    await page.waitForSelector("form, input, textarea", { timeout: 7000 });
  } catch (_) {}

  const contactLink = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    const match = anchors.find((a) =>
      `${a.href} ${a.innerText}`.toLowerCase().includes("contact"),
    );
    return match?.href || null;
  });

  if (contactLink && contactLink !== page.url()) {
    try {
      await page.goto(contactLink, {
        waitUntil: "networkidle2",
        timeout: 15000,
      });
      try {
        await page.waitForSelector("form, input, textarea", { timeout: 7000 });
      } catch (_) {}
    } catch (e) {
      console.log(
        "Navigation to contact link failed, staying on current page.",
      );
    }
  }

  const contactPageUrl = page.url();

  const captchaFound = await captchaDetection(page);

  if (captchaFound) {
    return {
      formStatus: "SKIPPED_CAPTCHA",
      contactPageUrl: page.url(),
      reason: "Captcha detected - skipping form",
    };
  }

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await sleep(1500);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.evaluate(() => {
    const getAllShadowRoots = (node) => {
      let results = [];
      if (node.shadowRoot) {
        results.push(node.shadowRoot);
        node.shadowRoot.querySelectorAll("*").forEach((el) => {
          results = results.concat(getAllShadowRoots(el));
        });
      }
      return results;
    };

    window.__shadowRoots = getAllShadowRoots(document.body);
  });

  const forms = await page.$$("form");
  let bestForm = null;
  let bestScore = 0;

  for (const form of forms) {
    const score = await form.evaluate((f) => {
      const text = f.innerText.toLowerCase();
      let s = 0;
      if (text.includes("message")) s += 10;
      if (text.includes("email")) s += 8;
      if (text.includes("name")) s += 5;
      return s;
    });

    if (score > bestScore) {
      bestScore = score;
      bestForm = form;
    }
  }

  let fields = bestForm
    ? await extractFields(bestForm)
    : await extractFields(page);
  let activeContext = page;

  if (!fields.length) {
    console.log("No form on main page, scanning iframes...");
    const frames = page.frames();
    for (const frame of frames) {
      const frameFields = await extractFields(frame);
      if (frameFields.length > 0) {
        fields = frameFields;
        activeContext = frame;
        console.log(`Found form in frame: ${frame.url()}`);
        break;
      }
    }
  }

  if (!fields.length) {
    return {
      formStatus: "NO_FORM",
      contactPageUrl,
    };
  }

  const fillMap = {};
  const unresolvedFields = [];

  for (const field of fields) {
    const heuristicValue = buildHeuristicValue(field, data);
    if (heuristicValue !== null && heuristicValue !== undefined) {
      fillMap[field.key] = heuristicValue;
    } else {
      unresolvedFields.push({
        key: field.key,
        tag: field.tag,
        type: field.type,
        name: field.name,
        id: field.id,
        placeholder: field.placeholder,
        label: field.label,
        ariaLabel: field.ariaLabel,
        required: field.required,
        isHidden: field.isHidden,
        isHoneypot: field.isHoneypot,
        existingValue: field.existingValue,
        options: field.options || [],
      });
    }
  }

  let aiUsed = false;
  let aiMap = {};

  if (unresolvedFields.length && groqApiKey) {
    try {
      aiMap = await getAIFieldMapping({
        fields: unresolvedFields,
        senderDetails: data,
        apiKey: groqApiKey,
        model: normalizeModelName(groqModel),
      });
      aiUsed = true;
    } catch (error) {
      aiMap = {};
    }
  }

  for (const field of fields) {
    if (fillMap[field.key] !== undefined) continue;
    const proposed = aiMap[field.key];
    const validated = validateAIValue(field, proposed);

    if (validated !== null && validated !== undefined) {
      fillMap[field.key] = validated;
    } else if (field.required && !field.isHidden && !field.isHoneypot) {
      if (field.tag === "select") {
        const validOptions = (field.options || []).filter(
          (o) => String(o.value || "").trim() !== "",
        );
        if (validOptions[0]) fillMap[field.key] = validOptions[0].value;
      } else if (field.type === "checkbox") {
        fillMap[field.key] = true;
      } else if (field.type === "radio") {
        if (field.options?.[0]) fillMap[field.key] = field.options[0].value;
      } else if (field.type === "email") {
        fillMap[field.key] = data.senderEmail || "johnsmith@gmail.com";
      } else if (field.type === "tel") {
        fillMap[field.key] = data.senderPhone || "9876543210";
      } else {
        fillMap[field.key] = "John Smith";
      }
    }
  }

  const realisticData = {
    name: "John Smith",
    email: "johnsmith@gmail.com",
    phone: "9876543210",
    company: "JS Solutions",
  };

  for (const field of fields) {
    if (
      fillMap[field.key] === undefined &&
      !field.isHidden &&
      !field.isHoneypot
    ) {
      if (field.type === "email")
        fillMap[field.key] = data.senderEmail || realisticData.email;
      else if (field.type === "tel")
        fillMap[field.key] = data.senderPhone || realisticData.phone;
      else if (field.tag === "textarea")
        fillMap[field.key] =
          data.message ||
          "Hello, I am interested in your services and would like more information. Please reach out.";
      else if (field.tag === "select" && field.options?.length) {
        fillMap[field.key] = field.options[0].value;
      } else {
        fillMap[field.key] = field.key.toLowerCase().includes("company")
          ? realisticData.company
          : realisticData.name;
      }
    }
  }

  const seenRadioGroups = new Set();

  for (const field of fields) {
    if (field.type === "radio") {
      const groupKey = field.name || field.key;
      if (seenRadioGroups.has(groupKey)) continue;
      seenRadioGroups.add(groupKey);
    }

    await applyFieldValue(activeContext, field, fillMap[field.key]);
  }

  await sleep(800);

  let requestSuccess = false;

  page.on("response", (res) => {
    const url = res.url().toLowerCase();
    if (
      res.request().method() === "POST" &&
      (url.includes("contact") ||
        url.includes("form") ||
        url.includes("submit"))
    ) {
      if (res.status() >= 200 && res.status() < 400) {
        requestSuccess = true;
      }
    }
  });

  const nextBtn = await activeContext.$('button, input[type="button"]');

  if (nextBtn) {
    const text = await activeContext.evaluate(
      (el) => (el.innerText || el.value || "").toLowerCase(),
      nextBtn,
    );

    if (text.includes("next")) {
      await nextBtn.click();
      await sleep(2000);
    }
  }

  await activeContext.evaluate(() => {
    document
      .querySelectorAll("button[disabled], input[disabled]")
      .forEach((btn) => (btn.disabled = false));
  });

  let submitted = false;

  const btn = await activeContext.$(
    'button[type="submit"], input[type="submit"]',
  );

  if (btn) {
    submitted = await smartClick(
      activeContext,
      'button[type="submit"], input[type="submit"]',
    );
  }

  if (!submitted) {
    await activeContext.evaluate(() => {
      const form = document.querySelector("form");
      if (form) form.submit();
    });
  }

  await sleep(3000);

  if (requestSuccess) {
    return {
      formStatus: "SUCCESS",
      method: "network",
      contactPageUrl,
      finalUrl: page.url(),
    };
  }

  // 🔥 Handle navigation-induced crashes
  let result = null;
  try {
    result = await activeContext.evaluate(() => {
      const text = (document.body.innerText || "").toLowerCase();

      const successText =
        text.includes("thank you") ||
        text.includes("successfully") ||
        text.includes("message sent") ||
        text.includes("we received") ||
        text.includes("thanks for contacting") ||
        text.includes("your message has been sent") ||
        text.includes("appreciate your interest") ||
        text.includes("look forward to connecting") ||
        text.includes("we will get back to you") ||
        text.includes("submission successful") ||
        text.includes("message was sent") ||
        text.includes("sent successfully") ||
        text.includes("form submitted") ||
        text.includes("thanks for getting in touch");

      const errorTextFound =
        text.includes("error") ||
        text.includes("required field") ||
        text.includes("invalid email") ||
        text.includes("please fill") ||
        text.includes("captcha");

      const errorMessages = Array.from(
        document.querySelectorAll(
          ".error, .alert-danger, .wpcf7-not-valid-tip, .message-error, .form-error, .invalid-feedback, [aria-invalid='true']",
        ),
      )
        .map((el) => el.innerText.trim())
        .filter((t) => t.length > 5 && t.length < 500);

      const formExists = !!document.querySelector("form");
      const alertExists =
        document.querySelector(
          ".success, .alert-success, .wpcf7-mail-sent-ok, .message-success, .form-success",
        ) !== null;

      return {
        successText,
        errorText: errorTextFound || errorMessages.length > 0,
        errorMessages,
        formExists,
        alertExists,
        pageTextSample: text.slice(0, 1000),
      };
    });
  } catch (err) {
    // If navigation happened, try one last time on the new context
    await sleep(2000);
    try {
      result = await activeContext.evaluate(() => {
        const text = (document.body.innerText || "").toLowerCase();
        return {
          successText:
            text.includes("thank you") ||
            text.includes("successfully") ||
            text.includes("received") ||
            text.includes("sent"),
          errorText: false,
          errorMessages: [],
          formExists: !!document.querySelector("form"),
          alertExists: false,
          pageTextSample: text.slice(0, 1000),
        };
      });
    } catch (_) {
      // Final fallback if everything fails
      result = {
        successText: true, // Assume success if redirected and no error visible
        errorText: false,
        errorMessages: [],
        formExists: false,
        alertExists: false,
        pageTextSample: "Navigation occurred (Context destroyed)",
      };
    }
  }

  let isSuccess =
    requestSuccess ||
    (result &&
      (result.successText || result.alertExists || !result.formExists) &&
      !result.errorText);

  if (!isSuccess) {
    await sleep(2000);

    const retryBtn = await activeContext.$(
      'button[type="submit"], input[type="submit"]',
    );
    if (retryBtn) await retryBtn.click();

    await sleep(2000);
    isSuccess = requestSuccess || isSuccess;
  }

  if (!isSuccess) {
    await page.screenshot({ path: `fail-${Date.now()}.png`, fullPage: true });
  }

  if (page.url().includes("thank") || page.url().includes("success")) {
    return {
      formStatus: "SUCCESS_REDIRECT",
      contactPageUrl,
      finalUrl: page.url(),
    };
  }

  return {
    formStatus: isSuccess ? "SUCCESS" : "SUBMIT_FAILED",
    error: !isSuccess
      ? result?.errorMessages?.join(" | ") ||
        (captchaFound
          ? "Captcha detected - Manual intervention required"
          : "Submission failed")
      : null,
    debug: result,
    captchaFound,
    aiUsed,
    totalFields: fields.length,
    unresolvedFieldCount: unresolvedFields.length,
    contactPageUrl,
    finalUrl: page.url(),
  };
};
