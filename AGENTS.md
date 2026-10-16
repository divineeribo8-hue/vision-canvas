<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Studio architecture
- Keep stable `portraits` and `videography` keys and source all visible service labels and active packages from divine-data; this preserves existing URLs and draft compatibility.
- Read the portfolio from Cloud rows, including imported asset pointers; do not inject fallback featured items, so replacing or deleting work persists.
- Keep owner media maintenance as an inline dialog on The Work, protected by server-validated user_roles and storage RLS; visitors never need accounts.
- Grant the verified studio contact Google account its owner role through the auth lifecycle trigger; no client-controlled role metadata is trusted.
- Preserve natural image dimensions in column galleries and use a dialog for full viewing; this avoids cropping faces across screen sizes.
- Editing inquiries omit shoot date/time/location requirements, while portraits retain them; inspiration is optional for both.
- Copying or opening an external app never records delivery or confirmation; actual sending remains in WhatsApp/email and confirmation stays manual.
