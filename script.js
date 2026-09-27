/* =========================================
   DOM ELEMENTS
========================================= */

const form = document.getElementById("registrationForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const termsInput = document.getElementById("terms");

const feedback = document.getElementById("form-feedback");
const passwordStrength = document.getElementById("password-strength");

const formPanel = document.querySelector(".form-panel");


/* =========================================
   REGEX PATTERNS
========================================= */

const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;

const emailRegex =
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i;

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;


/* =========================================
   ERROR ELEMENTS
========================================= */

const errorElements = {
    fullName: document.getElementById("fullName-error"),
    email: document.getElementById("email-error"),
    password: document.getElementById("password-error"),
    confirmPassword: document.getElementById("confirmPassword-error"),
    terms: document.getElementById("terms-error")
};


/* =========================================
   SHOW ERROR
========================================= */

function showError(input, message) {

    const errorElement = errorElements[input.id];

    input.setAttribute("aria-invalid", "true");

    errorElement.textContent = message;
}


/* =========================================
   CLEAR ERROR
========================================= */

function clearError(input) {

    const errorElement = errorElements[input.id];

    input.setAttribute("aria-invalid", "false");

    errorElement.textContent = "";
}


/* =========================================
   VALIDATE FULL NAME
========================================= */

function validateFullName() {

    const value = fullNameInput.value.trim();

    if (value === "") {

        showError(
            fullNameInput,
            "Full name is required."
        );

        return false;
    }

    if (value.length < 2) {

        showError(
            fullNameInput,
            "Name must contain at least 2 characters."
        );

        return false;
    }

    if (!nameRegex.test(value)) {

        showError(
            fullNameInput,
            "Please enter a valid name."
        );

        return false;
    }

    clearError(fullNameInput);

    return true;
}


/* =========================================
   VALIDATE EMAIL
========================================= */

function validateEmail() {

    const value = emailInput.value.trim();

    if (value === "") {

        showError(
            emailInput,
            "Email address is required."
        );

        return false;
    }

    if (!emailRegex.test(value)) {

        showError(
            emailInput,
            "Please enter a valid email address."
        );

        return false;
    }

    clearError(emailInput);

    return true;
}


/* =========================================
   VALIDATE PASSWORD
========================================= */

function validatePassword() {

    const value = passwordInput.value;

    if (value === "") {

        showError(
            passwordInput,
            "Password is required."
        );

        return false;
    }

    if (value.length < 8) {

        showError(
            passwordInput,
            "Password must contain at least 8 characters."
        );

        return false;
    }

    if (!passwordRegex.test(value)) {

        showError(
            passwordInput,
            "Use uppercase, lowercase, number and special character."
        );

        return false;
    }

    clearError(passwordInput);

    return true;
}


/* =========================================
   VALIDATE CONFIRM PASSWORD
========================================= */

function validateConfirmPassword() {

    const value = confirmPasswordInput.value;

    if (value === "") {

        showError(
            confirmPasswordInput,
            "Please confirm your password."
        );

        return false;
    }

    if (value !== passwordInput.value) {

        showError(
            confirmPasswordInput,
            "Passwords do not match."
        );

        return false;
    }

    clearError(confirmPasswordInput);

    return true;
}


/* =========================================
   VALIDATE TERMS
========================================= */

function validateTerms() {

    if (!termsInput.checked) {

        showError(
            termsInput,
            "You must accept the Terms & Conditions."
        );

        return false;
    }

    clearError(termsInput);

    return true;
}


/* =========================================
   PASSWORD STRENGTH
========================================= */

function updatePasswordStrength() {

    const password = passwordInput.value;

    if (password === "") {

        passwordStrength.innerHTML = "";

        passwordStrength.className = "password-strength";

        return;
    }


    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/\d/.test(password)) {
        score++;
    }

    if (/[#?!@$%^&*-]/.test(password)) {
        score++;
    }


    let strengthText = "";
    let strengthClass = "";


    if (score <= 2) {

        strengthText = "Weak password";
        strengthClass = "weak";

    } else if (score <= 4) {

        strengthText = "Medium password";
        strengthClass = "medium";

    } else {

        strengthText = "Strong password";
        strengthClass = "strong";
    }


    let bars = "";

    for (let i = 1; i <= 5; i++) {

        const activeClass =
            i <= score ? "active" : "";

        bars += `
            <span class="strength-bar ${activeClass}"></span>
        `;
    }


    passwordStrength.className =
        `password-strength ${strengthClass}`;

    passwordStrength.innerHTML = `
        <div class="strength-bars">
            ${bars}
        </div>

        <span>${strengthText}</span>
    `;
}


/* =========================================
   FORM FEEDBACK
========================================= */

function showFormError() {

    feedback.className =
        "form-feedback error";

    feedback.textContent =
        "Please fix the highlighted fields before continuing.";
}


function showSuccess() {

    feedback.className =
        "form-feedback success";

    feedback.textContent =
        "✓ Account created successfully! Your information passed validation.";

    formPanel.classList.add("success-state");
}


/* =========================================
   CLEAR FORM FEEDBACK
========================================= */

function clearFormFeedback() {

    feedback.className = "form-feedback";

    feedback.textContent = "";

    formPanel.classList.remove("success-state");
}


/* =========================================
   FORM SUBMISSION
========================================= */

form.addEventListener("submit", function (event) {

    /*
        Prevent the browser's default form submission.

        Without this:
        form → browser submission → page refresh
    */

    event.preventDefault();


    clearFormFeedback();


    /*
        Validate every field.
    */

    const isNameValid =
        validateFullName();

    const isEmailValid =
        validateEmail();

    const isPasswordValid =
        validatePassword();

    const isConfirmPasswordValid =
        validateConfirmPassword();

    const areTermsValid =
        validateTerms();


    /*
        Check whether everything passed.
    */

    const isFormValid =
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        areTermsValid;


    if (!isFormValid) {

        showFormError();

        /*
            Move focus to the first invalid field.
        */

        const firstInvalid =
            form.querySelector(
                '[aria-invalid="true"]'
            );

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }


    /*
        All validation passed.
    */

    showSuccess();


    /*
        IMPORTANT:
        We intentionally do NOT log the password.

        In a real application, the validated
        data would be sent securely to a server.
    */

    const formData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim()
    };

    console.log("Validated form data:", formData);
});


/* =========================================
   BLUR VALIDATION
========================================= */

fullNameInput.addEventListener(
    "blur",
    validateFullName
);

emailInput.addEventListener(
    "blur",
    validateEmail
);

passwordInput.addEventListener(
    "blur",
    validatePassword
);

confirmPasswordInput.addEventListener(
    "blur",
    validateConfirmPassword
);

termsInput.addEventListener(
    "change",
    validateTerms
);


/* =========================================
   LIVE PASSWORD STRENGTH
========================================= */

passwordInput.addEventListener(
    "input",
    function () {

        updatePasswordStrength();

        /*
            If the user already entered an invalid
            password, update the validation message.
        */

        if (
            passwordInput.getAttribute("aria-invalid") === "true"
        ) {
            validatePassword();
        }

        /*
            Password changing can affect
            confirm-password validation.
        */

        if (confirmPasswordInput.value !== "") {
            validateConfirmPassword();
        }
    }
);


/* =========================================
   LIVE CONFIRM PASSWORD
========================================= */

confirmPasswordInput.addEventListener(
    "input",
    function () {

        if (
            confirmPasswordInput.getAttribute("aria-invalid") === "true"
        ) {
            validateConfirmPassword();
        }
    }
);


/* =========================================
   CLEAR ERRORS WHILE USER FIXES INPUT
========================================= */

fullNameInput.addEventListener(
    "input",
    function () {

        if (fullNameInput.value.trim() !== "") {
            clearError(fullNameInput);
        }

        clearFormFeedback();
    }
);


emailInput.addEventListener(
    "input",
    function () {

        if (emailInput.value.trim() !== "") {
            clearError(emailInput);
        }

        clearFormFeedback();
    }
);


/* =========================================
   PASSWORD VISIBILITY TOGGLE
========================================= */

const passwordToggleButtons =
    document.querySelectorAll(".password-toggle");


passwordToggleButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const targetId =
            button.dataset.target;

        const targetInput =
            document.getElementById(targetId);


        if (targetInput.type === "password") {

            targetInput.type = "text";

            button.textContent = "Hide";

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            targetInput.type = "password";

            button.textContent = "Show";

            button.setAttribute(
                "aria-label",
                "Show password"
            );
        }
    });
});


/* =========================================
   TERMS LINK
========================================= */

const termsLink =
    document.getElementById("termsLink");


termsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        alert(
            "Terms & Conditions: Please review the terms before creating your account."
        );
    }
);