# Plan: Divine Aesthetics Media Agency Website

## Goal
Build a premium, warm editorial website for Divine Aesthetics Media Agency that works as a creative studio presence, portfolio, service catalogue, and guided booking experience.

## Pages and Journey
- **Home**: cinematic introduction, brand statement, brief studio story, six visual service categories, selected testimonials, and a final creation prompt.
- **The Work**: highly visual portfolio-style page with sections for portraits, personal branding, product photography, creative concepts, events, and videography.
- **Sessions**: clear package catalogue with exact provided pricing, duration, deliverables, and “Book this session” actions.
- **Session Details**: package summary before booking, including price, duration, deliverables, what is included, and preparation guidance.
- **Booking**: multi-step booking flow for date/time, client details, location, inspiration upload details, and creative vision.
- **Booking Review**: complete editable summary before the client proceeds.
- **Contact Method**: WhatsApp and email options that generate the full booking message automatically.
- **Request Received**: confirmation screen that clearly says the request was received, not confirmed.
- **About**: brand philosophy, audience, values, creative process, cultural narrative, and community engagement.
- **Contact**: WhatsApp, email, Instagram, and conversation-starting CTA.

## Design Direction
- Warm ivory and soft cream backgrounds, charcoal typography, earthy brown accents.
- Editorial serif headlines paired with a clean modern sans-serif for body, navigation, and buttons.
- Large cinematic imagery, asymmetrical editorial layouts, clean grids, generous whitespace, subtle borders, and restrained animation.
- Photography remains the dominant visual element; the site avoids bright colors, neon, heavy black, loud gradients, wedding-template styling, and generic corporate layouts.

## Booking Logic
- Package buttons carry the selected session and package into the booking flow.
- Calendar UI will show selectable available slots and exclude blocked slots.
- Because a live Google Calendar connection requires linking the agency calendar, the first build will include the complete booking experience with a calendar-ready availability layer and clear fallback availability.
- If the Google Calendar connector is linked, server-side availability fetching can replace the fallback slots without changing the client journey.
- The flow will distinguish “booking request received” from “booking confirmed.”

## Technical Details
- Use the existing TanStack Start routing system.
- Add separate routes for Home, The Work, Sessions, Session Details, Booking, Review, Contact Method, Request Received, About, and Contact.
- Define the visual system in `src/styles.css` using semantic tokens.
- Add route-specific metadata for every content route.
- Generate/import cinematic image assets for the brand visuals.
- Use accessible forms, buttons, labels, review states, and mobile-friendly layouts.

## Not Included Yet
- Live Google Calendar availability cannot be completed until the agency calendar is connected for this project.
- Actual file upload storage is not included unless Lovable Cloud storage is enabled; the booking flow will capture inspiration/reference notes and file names where supported by the browser.
