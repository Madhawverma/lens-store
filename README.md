# Lens Store

A modern eyewear e-commerce storefront built with React and Vite. Lens Store lets customers browse frames, search and filter products, save favorites, manage a cart, create an account, and track orders. It also includes a protected admin area for managing products.

## Features

- Responsive storefront for browsing eyewear products
- Product categories, shape filters, style discovery, and shop-by-need sections
- Product quick view and lens selection modal
- Search, wishlist, and cart drawer workflows
- Customer sign in, registration, and password reset through Firebase Authentication
- Admin login and product management dashboard
- Product image uploads through Firebase Storage
- Order tracking at `/track/:orderId`
- Local fallback data so the storefront can run without Firebase configuration
- Confetti feedback for successful customer actions

## Tech Stack

- React 19
- Vite
- React Router
- Firebase Authentication, Firestore, and Storage
- Lucide React icons
- Oxlint

## Visual Design

Lens Store uses a bright, modern optical-store palette designed to feel trustworthy and energetic:

### Color Palette

![Deep Navy](https://img.shields.io/badge/Deep_Navy-%23000045-000045?style=for-the-badge&labelColor=111827)
![Yellow](https://img.shields.io/badge/Yellow-%23e5a93b-e5a93b?style=for-the-badge&labelColor=111827)
![Purple](https://img.shields.io/badge/Purple-%238b5cf6-8b5cf6?style=for-the-badge&labelColor=111827)
![Blue](https://img.shields.io/badge/Blue-%230088ff-0088ff?style=for-the-badge&labelColor=111827)
![Pink](https://img.shields.io/badge/Pink-%23ff4081-ff4081?style=for-the-badge&labelColor=111827)
![Green](https://img.shields.io/badge/Green-%2300b87c-00b87c?style=for-the-badge&labelColor=111827)

- **Deep navy** (`#000045`) for the main brand, navigation, headings, and primary actions
- **Yellow / gold** (`#e5a93b`) for premium accents and promotional badges
- **Purple** (`#8b5cf6`) for creative style highlights and discovery sections
- **Blue** (`#0088ff`) for information and support states
- **Pink** (`#ff4081`) for offers, highlights, active states, and calls to action
- **Green** (`#00b87c`) for success, delivery, and confirmation states
- **Light gray** (`#f8f9fa`) for the page background and comfortable product browsing

The interface is responsive, uses rounded controls and product cards, and includes clear contrast for comfortable shopping on desktop and mobile.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

Clone the repository, enter the project directory, and install dependencies:

```bash
git clone https://github.com/<your-username>/lens-store.git
cd lens-store
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:5175`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 5175 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Firebase Configuration

Firebase is optional for local storefront browsing. Without configuration, the app uses its local product data and Firebase-backed authentication and uploads are unavailable.

To enable Firebase, create a `.env` file in the project root with the following values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_EMAIL=admin@example.com
```

In the Firebase console:

1. Create or select a Firebase project.
2. Register a web application and copy its configuration values.
3. Enable Email/Password under Authentication.
4. Create a Firestore database.
5. Enable Storage for product image uploads.
6. Create the admin user using the email configured in `VITE_ADMIN_EMAIL`.

Never commit `.env` files or private credentials. Only variables prefixed with `VITE_` are available to the browser, so Firebase security rules must protect production data.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Customer storefront |
| `/admin` | Admin login and product management |
| `/track/:orderId` | Order tracking page |

## Project Structure

```text
src/
├── components/     Reusable storefront, modal, drawer, and admin UI
├── context/        Product and order state providers
├── data/           Local product data used as the fallback catalog
├── lib/            Firebase initialization and service helpers
├── pages/          Storefront, admin, and order tracking pages
├── App.jsx         Application routes and providers
├── App.css         Application-level styles
└── index.css       Global styles
public/images/      Static product and storefront images
```

## Production Build

Build the app before deployment:

```bash
npm run build
```

Deploy the generated `dist/` directory to a static hosting provider such as Firebase Hosting, Vercel, Netlify, or GitHub Pages. Configure the host to return `index.html` for client-side routes such as `/admin` and `/track/:orderId`.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request with a clear description of the change.

## License

This project does not currently include a license. Add one before distributing the code publicly.

## Developer

Developed by **Madhaw Verma**.