# Plan: Divine Aesthetics Media Agency Website

## Goal
Build a complete premium website for Divine Aesthetics Media Agency that works as a creative studio presence, portfolio, service catalogue, and guided booking experience.

## Pages and Journey
- **Home**: cinematic introduction, brand statement, brief studio story, a Selected Work gallery of 6–9 replaceable placeholders, six service categories, selected testimonials, and a final creation prompt.
- **The Work**: real portfolio structure with gallery sections for portraits, personal branding, product photography, creative concepts, events captured cinematically, and videography.
- **Sessions**: clear package catalogue with exact provided pricing, duration, deliverables, and “Book this session” actions.
- **Session Details**: package summary before booking, including price, duration, deliverables, what is included, and preparation guidance.
- **Booking**: multi-step booking flow for date/time, client details, location, inspiration uploads, and creative vision.
- **Booking Review**: complete editable summary before the client proceeds.
- **Contact Method**: WhatsApp and email options that generate the full booking message automatically.
- **Request Received**: confirmation screen that clearly says the request was sent/received, not confirmed.
- **About**: brand philosophy, audience, values, creative process, cultural narrative, and community engagement.
- **Contact**: WhatsApp, email, Instagram, and conversation-starting CTA.

## Portfolio Editing
- Use a portfolio data structure that separates each section and item, so images and videos can be replaced without changing the page layout.
- Use development placeholders that are clearly labeled as placeholders, not presented as Divine Aesthetics’ actual work.
- Prepare the structure for owner-managed uploads/replacements through Cloud storage.

## Booking Logic
- Package buttons carry the selected service and package into the booking flow.
- Calendar UI shows selectable available slots and excludes known blocked slots.
- The booking system remains ready for Google Calendar connection later, so real availability can replace fallback slots without changing the client journey.
- Inspiration upload will support actual file selection and, where Cloud storage is available, file storage. The interface will clearly distinguish locally selected files from successfully stored files.
- WhatsApp and email buttons generate complete messages from the client’s actual booking details.
- The final status distinguishes “Booking Request Sent” from “Booking Confirmed.”

## Design Direction
- Warm ivory and soft cream backgrounds, charcoal typography, earthy brown accents.
- Editorial serif headlines paired with a clean modern sans-serif for body, navigation, and buttons.
- Large cinematic visual areas, asymmetrical editorial layouts, clean grids, generous whitespace, subtle borders, and restrained animation.
- Avoid bright colors, neon, heavy black, loud gradients, wedding-template styling, and generic corporate layouts.

## Technical Details
- Use the existing TanStack Start routing system.
- Add separate routes for the requested site sections and booking steps.
- Define visual tokens in `src/styles.css` using semantic colors.
- Add route-specific metadata for every content route.
- Use Cloud storage for inspiration uploads and make portfolio media storage-ready.
- Keep user-facing upload messaging honest: selected locally is not the same as received/stored.
