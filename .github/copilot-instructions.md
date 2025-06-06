---
applyTo: "**"
---

# Coding Standards and Preferences

- Use descriptive and consistent variable names that clearly indicate their purpose (e.g., `productList` instead of `data1`).
- This project is a modern, minimalistic website for my retail supplement brand, **K8 Nutrition**.
- The site is built using **Astro** for performance and flexibility. Use **island architecture** only where interactivity is required.
- If a framework is needed for islands, prefer **Svelte** (v5) or fallback to plain **TypeScript/JavaScript**.
- Use **Svelte 5** syntax and APIs — consult the project's `llms.txt` file for up-to-date practices.

  - Prefer `signal`, `derived`, and `emit` from `svelte/runtime` over deprecated APIs like `createEventDispatcher`.
  - Follow the rune-based reactivity model described in the [`llms.txt`](./llms.txt) guidance.
  - Use `load()` or equivalent caching strategies to avoid unnecessary Supabase queries on every page visit.

- When querying Supabase, **only request the fields necessary** to display the product data on the current view to reduce bandwidth usage.
  - Example: `name`, `brand`, `flavor`, `category`, `size`, `price`, `stock`, `description`, `imageurl`, `imagealt`,
- Supabase is used as the backend database. The `products` table has the following schema:

  ```sql
  CREATE TABLE public.products (
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    flavor text,
    category text NOT NULL,
    size text NOT NULL,
    price numeric NOT NULL,
    stock smallint NOT NULL,
    fragile boolean NOT NULL,
    description text NOT NULL,
    imageurl text NOT NULL UNIQUE,
    imagealt text NOT NULL,
    active boolean NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
  );
  ```

- Cloudinary is used for image delivery via CDN. Images should be linked via the imageurl field in Supabase, which stores the Cloudinary URLs.
- Prefer **functional components** for reusability, but avoid unnecessary over-abstraction or deeply nested components.
- Use a **minimalistic visual approach**. The primary color palette must be **white, blue, and black**.
- Use a **sans-serif font** for a clean and modern look.
- Use **Tailwind CSS v4** for all styling. Use utility classes in favor of custom CSS unless strictly necessary.
- Use Lucide [Astro icons](https://lucide.dev/guide/packages/lucide-astro) for all icons.
- Design with a **mobile-first** philosophy: prioritize layout, spacing, and readability on small screens before scaling up.
- This project uses **TypeScript** for type safety and improved tooling. Always define types and interfaces where relevant.
- Follow **semantic HTML** best practices (`<header>`, `<main>`, `<section>`, etc.).
- Ensure accessibility by using `aria` labels, semantic elements, and supporting keyboard navigation where needed.
- Use **simple but descriptive comments** throughout the code, especially in:
  - Complex logic or functions.
  - Sections with meaningful purpose.
  - Nested HTML structures (only when nesting is necessary, though nesting should be avoided in general).
- Keep components small and focused — each should handle a single responsibility.
- Organize code using **kebab-case** for file and folder names.
- Maintain clean and grouped imports: third-party libraries first, then internal modules.
- Use **eslint** and **prettier** to enforce code formatting and best practices.
- Optimize images and assets. Use Astro’s `Image` component or `astro:assets` when available.
- External dependencies must be justified and relevant — avoid adding bloated libraries without good reason.
- Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard (e.g., `feat: add product card component`).
