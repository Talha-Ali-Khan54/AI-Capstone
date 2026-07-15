const form = document.getElementById("settingsForm");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");
const saveStatus = document.getElementById("saveStatus");
const bio = document.getElementById("bio");
const bioCounter = document.getElementById("bioCounter");
const passwordRules = document.getElementById("passwordRules");

const validators = {
  displayName(value) {
    if (!value.trim()) return "Display name is required.";
    if (value.trim().length < 2) return "Display name must be at least 2 characters.";
    if (value.trim().length > 50) return "Display name must be 50 characters or fewer.";
    return "";
  },

  username(value) {
    if (!value.trim()) return "Username is required.";
    if (value.length < 3) return "Username must be at least 3 characters.";
    if (value.length > 20) return "Username must be 20 characters or fewer.";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores.";
    }
    return "";
  },

  email(value) {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return "";
  },

  phone(value) {
    if (!value.trim()) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return "Enter a valid phone number.";
    }
    return "";
  },

  website(value) {
    if (!value.trim()) return "";
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol)) {
        return "Website must start with http:// or https://.";
      }
    } catch {
      return "Enter a valid website URL.";
    }
    return "";
  },

  bio(value) {
    if (value.length > 200) return "Bio must be 200 characters or fewer.";
    return "";
  },

  currentPassword(value, formData) {
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");
    if ((newPassword || confirmPassword) && !value) {
      return "Current password is required to set a new password.";
    }
    return "";
  },

  newPassword(value, formData) {
    const confirmPassword = formData.get("confirmPassword");
    if (!value && !confirmPassword) return "";

    if (!value) return "New password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
    if (!/\d/.test(value)) return "Password must include a number.";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must include a special character.";
    return "";
  },

  confirmPassword(value, formData) {
    const newPassword = formData.get("newPassword");
    if (!newPassword && !value) return "";
    if (!value) return "Please confirm your new password.";
    if (value !== newPassword) return "Passwords do not match.";
    return "";
  },

  language(value) {
    if (!value) return "Please select a language.";
    return "";
  },

  timezone(value) {
    if (!value) return "Please select a timezone.";
    return "";
  },
};

const validatedFields = Object.keys(validators);

function getFormData() {
  return new FormData(form);
}

function setFieldError(fieldName, message) {
  const input = form.elements[fieldName];
  const errorEl = document.getElementById(`${fieldName}Error`);

  if (!input || !errorEl) return;

  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message;
}

function validateField(fieldName) {
  const input = form.elements[fieldName];
  if (!input) return true;

  const value = input.type === "checkbox" ? input.checked : input.value;
  const message = validators[fieldName](value, getFormData());
  setFieldError(fieldName, message);
  return !message;
}

function validateForm() {
  let isValid = true;

  validatedFields.forEach((fieldName) => {
    const fieldValid = validateField(fieldName);
    if (!fieldValid) isValid = false;
  });

  return isValid;
}

function updatePasswordRules(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  passwordRules.querySelectorAll("li").forEach((item) => {
    const rule = item.dataset.rule;
    item.classList.toggle("valid", Boolean(checks[rule]));
  });
}

function updateBioCounter() {
  const length = bio.value.length;
  bioCounter.textContent = `${length} / 200`;
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast show${type === "error" ? " error" : ""}`;
  toast.hidden = false;

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.hidden = true;
  }, 3200);
}

function switchSection(sectionId) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === sectionId);
  });
}

function getInitialValues() {
  const values = {};

  Array.from(form.elements).forEach((element) => {
    if (!element.name || element.type === "submit" || element.type === "button") return;

    if (element.type === "checkbox") {
      values[element.name] = element.checked;
      return;
    }

    if (element.type === "radio") {
      if (element.checked) values[element.name] = element.value;
      return;
    }

    values[element.name] = element.value;
  });

  return values;
}

let savedValues = getInitialValues();

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => switchSection(button.dataset.section));
});

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
    button.setAttribute("aria-label", `${isPassword ? "Hide" : "Show"} ${input.name}`);
  });
});

validatedFields.forEach((fieldName) => {
  const input = form.elements[fieldName];
  if (!input) return;

  const eventName = input.tagName === "SELECT" ? "change" : "input";
  input.addEventListener("blur", () => validateField(fieldName));
  input.addEventListener(eventName, () => {
    if (fieldName === "newPassword") {
      updatePasswordRules(input.value);
    }

    if (document.getElementById(`${fieldName}Error`).textContent) {
      validateField(fieldName);
    }

    saveStatus.hidden = true;
  });
});

bio.addEventListener("input", updateBioCounter);
updateBioCounter();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    showToast("Please fix the highlighted fields before saving.", "error");

    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) {
      const panel = firstInvalid.closest(".panel");
      if (panel) switchSection(panel.id);
      firstInvalid.focus();
    }
    return;
  }

  saveBtn.disabled = true;
  savedValues = getInitialValues();

  window.setTimeout(() => {
    saveBtn.disabled = false;
    saveStatus.hidden = false;
    showToast("Settings saved successfully.");
  }, 500);
});

resetBtn.addEventListener("click", () => {
  Object.entries(savedValues).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;

    if (field instanceof RadioNodeList) {
      Array.from(field).forEach((radio) => {
        radio.checked = radio.value === value;
      });
      return;
    }

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }

    field.value = value;
  });

  validatedFields.forEach((fieldName) => setFieldError(fieldName, ""));
  updatePasswordRules(form.elements.newPassword.value);
  updateBioCounter();
  saveStatus.hidden = true;
  showToast("Changes reset to last saved state.");
});
