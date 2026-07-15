const form = document.getElementById("settingsForm");
const successMessage = document.getElementById("successMessage");
const themeFieldset = document.getElementById("themeFieldset");

const fields = {
  fullName: {
    input: form.elements.fullName,
    error: document.getElementById("fullNameError"),
    validate(value) {
      if (!value.trim()) return "Full name is required.";
      return "";
    },
  },
  email: {
    input: form.elements.email,
    error: document.getElementById("emailError"),
    validate(value) {
      const trimmed = value.trim();
      if (!trimmed) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Please enter a valid email address.";
      }
      return "";
    },
  },
  password: {
    input: form.elements.password,
    error: document.getElementById("passwordError"),
    validate(value) {
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      return "";
    },
  },
  confirmPassword: {
    input: form.elements.confirmPassword,
    error: document.getElementById("confirmPasswordError"),
    validate(value, formData) {
      if (!value) return "Please confirm your password.";
      if (value !== formData.get("password")) return "Passwords do not match.";
      return "";
    },
  },
  theme: {
    input: form.elements.theme,
    error: document.getElementById("themeError"),
    validate(value) {
      if (!value) return "Please select a theme.";
      return "";
    },
  },
};

function getFormData() {
  return new FormData(form);
}

function getFieldValue(field) {
  if (field.input instanceof RadioNodeList) {
    return field.input.value;
  }
  return field.input.value;
}

function setFieldState(field, message) {
  const isInvalid = Boolean(message);

  if (field.input instanceof RadioNodeList) {
    themeFieldset.classList.toggle("invalid", isInvalid);
    field.input.forEach((radio) => {
      radio.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    });
  } else {
    field.input.classList.toggle("invalid", isInvalid);
    field.input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  }

  field.error.textContent = message;
}

function validateField(fieldName) {
  const field = fields[fieldName];
  const message = field.validate(getFieldValue(field), getFormData());
  setFieldState(field, message);
  return !message;
}

function validateForm() {
  let isValid = true;

  Object.keys(fields).forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  return isValid;
}

function hideSuccessMessage() {
  successMessage.hidden = true;
}

function showSuccessMessage() {
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function applyThemePreview(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
}

function focusFirstInvalidField() {
  for (const field of Object.values(fields)) {
    if (field.input instanceof RadioNodeList) {
      if (themeFieldset.classList.contains("invalid")) {
        field.input[0].focus();
        return;
      }
      continue;
    }

    if (field.input.classList.contains("invalid")) {
      field.input.focus();
      return;
    }
  }
}

Object.keys(fields).forEach((fieldName) => {
  const field = fields[fieldName];
  const inputs =
    field.input instanceof RadioNodeList ? Array.from(field.input) : [field.input];

  inputs.forEach((input) => {
    const eventName = input.type === "radio" ? "change" : "input";

    input.addEventListener("blur", () => validateField(fieldName));
    input.addEventListener(eventName, () => {
      hideSuccessMessage();

      if (fieldName === "password") {
        validateField("confirmPassword");
      }

      if (field.error.textContent) {
        validateField(fieldName);
      }

      if (fieldName === "theme") {
        applyThemePreview(input.value);
      }
    });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideSuccessMessage();

  const isValid = validateForm();

  if (!isValid) {
    focusFirstInvalidField();
    return;
  }

  applyThemePreview(getFormData().get("theme"));
  showSuccessMessage();
});
