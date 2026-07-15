# Keyboard and screen-reader review

Reviewed July 15, 2026 against the English and Chinese home, contact, visit/Sundays, sermons, and privacy flows.

## Review method

- Keyboard-only traversal at mobile and desktop breakpoints, including forward and reverse tab order, Enter, Space, and Escape.
- Semantic review of landmarks, headings, accessible names, expanded states, live regions, form descriptions, and native media controls as exposed to browser accessibility APIs.
- Reduced-motion and focus-visible behavior checked alongside the existing automated axe suite.

The Playwright coverage in `e2e/accessibility.spec.ts` preserves the repeatable keyboard and semantic checks. A final human VoiceOver speech-output pass in Safari is still recommended on the launch device because automated browser accessibility APIs cannot verify pronunciation, verbosity, or rotor usability.

## Findings addressed

1. The closed mobile navigation remained in the tab and accessibility order while translated off-screen. It is now `inert` and `aria-hidden` until opened.
2. Mobile About and Grow labels were focusable buttons even though their sublinks are always expanded on mobile. They are now removed from the mobile tab/accessibility order while their links remain available.
3. Menu button, primary navigation, footer navigation, and skip-link names were English-only. They now use ministry-appropriate English or Chinese labels.
4. Desktop disclosure buttons did not expose their visible expanded state. `aria-expanded` now follows focus and pointer interaction.
5. The skip link changed the URL but did not consistently move programmatic focus. It now focuses the main landmark.
6. Contact and ride-request forms did not explain data handling before submission. Each form now references a concise privacy note and the bilingual privacy page.
7. Form validation retains focus on the first invalid field and announces field or system errors through live regions. Background video controls expose localized play/pause actions and honor reduced motion.

## Human VoiceOver launch check

- In Safari, use VoiceOver rotor headings and landmarks to confirm one main landmark and a logical heading hierarchy.
- Open and close the mobile menu; confirm off-screen links are silent while closed and focus returns to the menu button after Escape.
- Read each form from its first field through the privacy note, Turnstile, error messages, and success message.
- Activate the home-page background video control and native sermon audio controls with VoiceOver + Space.
- Confirm Chinese navigation and control names are understandable with the selected Chinese voice.
