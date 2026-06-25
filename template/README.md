# Restaurant Template Kit

Use this folder as the starting kit for a new restaurant build. These files are not intended for staff navigation. Copy a template file, move it into the correct live folder, then replace the placeholder text.

## How To Use

1. Copy the full project folder for the new restaurant.
2. Complete `restaurant-profile.md`.
3. Complete `content-intake.md` with the client.
4. Duplicate the needed template files.
5. Move copies into the live folders:
   - SOPs go in `sops/`, `back-of-house/sops/`, or `front-of-house/sops/`
   - Checklists go in `checklists/`, `back-of-house/checklists/`, or `front-of-house/checklists/`
   - Role guides go in `roles/` or `front-of-house/roles/`
   - Onboarding pages go in `onboarding/`
   - Crisis content usually updates `crisis/index.html`
6. Update page links in the homepage, section index pages, and role pages.
7. Rebuild search:

```bash
node tools/build-search-index.js
```

## Placeholder Format

Replace bracketed placeholders like:

```txt
[RESTAURANT_NAME]
[SOP_TITLE]
[OWNER_ROLE]
[KEY_ACTION_1]
```

## Path Note

These template files assume they are one folder below the site root, so assets use `../assets/...`. If you copy a file into a deeper folder such as `front-of-house/roles/`, update paths to `../../assets/...`.
