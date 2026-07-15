# AI Workflow Comparison

## Feature

The feature selected for this exercise was a responsive settings form with client-side validation.

## Round One – Vague Prompt

In the first attempt, I provided the AI with a simple prompt asking it to create a settings form with validation. The generated solution worked, but it lacked several important details. Validation was basic, accessibility considerations were minimal, and there was little attention to edge cases. The overall structure was acceptable, but it required more manual review to ensure correctness.

## Round Two – Precise Prompt

For the second attempt, I used a detailed prompt that included file references, validation requirements, accessibility requirements, UI expectations, constraints, and a verification step asking the AI to review its own implementation. The generated solution was significantly more complete. It included stronger validation, clearer error messages, improved responsiveness, semantic HTML, and better overall organization.

## Comparison

The precise prompt produced noticeably higher-quality code. The validation logic handled more edge cases, including invalid email addresses, password length, and password confirmation. Accessibility also improved through proper labels and semantic HTML elements. The user interface was cleaner and more responsive compared to the first version.

The amount of manual review required was much lower in the second version because the AI followed clear instructions and performed a self-review before presenting the final solution.

## AI Mistake Found

One issue I noticed was that the initial AI-generated version did not fully consider accessibility and some validation edge cases. These issues became apparent during testing and comparison. The detailed prompt reduced these problems significantly.

## Lessons Learned

This exercise demonstrated that AI-generated code is highly dependent on prompt quality. A vague prompt can generate functional code, but a structured prompt with clear requirements, constraints, and verification steps produces code that is more reliable, maintainable, and requires less manual correction.