import type { Release } from "@/components/Changelog/types";

export const releases: Release[] = [
  {
    version: "1.2.0",
    date: "2026-01-14",
    changes: [
      {
        type: "feature",
        description:
          "Admin panel with perfume approval workflow, user management, and login history",
      },
      {
        type: "feature",
        description: "Role-based access control with admin privileges",
      },
      {
        type: "feature",
        description: "Password reset functionality via email",
      },
      {
        type: "feature",
        description: "Password visibility toggle on authentication forms",
      },
      {
        type: "feature",
        description: "Delete perfumes from collection",
      },
      {
        type: "feature",
        description: "Add new brands to the database",
      },
      {
        type: "feature",
        description: "Fragrantica import for adding perfumes",
      },
      {
        type: "feature",
        description: "Unit tests for server actions",
      },
      {
        type: "improvement",
        description: "Brands normalized into separate database table",
      },
      {
        type: "improvement",
        description: "Reusable pagination component",
      },
      {
        type: "improvement",
        description: "Server actions reorganized by domain",
      },
      {
        type: "improvement",
        description: "Enhanced rate limiting for AI prompts",
      },
      {
        type: "improvement",
        description: "Session management for sign in/out events",
      },
      {
        type: "improvement",
        description:
          "Validation to prevent duplicate brand and perfume names",
      },
      {
        type: "fix",
        description: "Login history timestamp display",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-01-04",
    changes: [
      {
        type: "feature",
        description: "Changelog page to track version history and updates",
      },
      {
        type: "improvement",
        description:
          "Component-based architecture for changelog with clean separation of concerns",
      },
      {
        type: "improvement",
        description:
          "Updated favicon to orange outline on transparent background for better tab rendering",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-01-04",
    changes: [
      {
        type: "feature",
        description:
          "AI-powered fragrance chat with personalized recommendations",
      },
      {
        type: "feature",
        description: "Personal perfume collection management system",
      },
      {
        type: "feature",
        description: "Browse and discover new perfumes",
      },
      {
        type: "feature",
        description: "User authentication with demo login capability",
      },
      {
        type: "improvement",
        description: "Custom perfume bottle logo and modern navigation icons",
      },
      {
        type: "improvement",
        description: "Footer branding with Layera icon",
      },
      {
        type: "improvement",
        description: "Enhanced chat interface with collection integration",
      },
      {
        type: "fix",
        description: "Fixed navbar responsive behavior across all pages",
      },
      {
        type: "fix",
        description: "Improved pagination styling to match app theme",
      },
      {
        type: "fix",
        description: "Protected routes with authentication middleware",
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-01-03",
    changes: [
      {
        type: "feature",
        description: "Add perfumes to personal collection",
      },
      {
        type: "improvement",
        description: "Improved intro section with better routing",
      },
      {
        type: "improvement",
        description: "Renamed to 'My Collection' for better UX",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-01-01",
    changes: [
      {
        type: "feature",
        description:
          "Complete authentication system with login and registration",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2025-12-28",
    changes: [
      {
        type: "feature",
        description: "Perfume collection display with grid layout",
      },
      {
        type: "feature",
        description: "Perfume upload functionality",
      },
      {
        type: "feature",
        description: "Collection selector for browsing",
      },
      {
        type: "improvement",
        description: "Complete collection architecture restructure",
      },
      {
        type: "improvement",
        description: "Toast notifications for user feedback",
      },
      {
        type: "improvement",
        description: "Enhanced form handling",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2025-12-27",
    changes: [
      {
        type: "feature",
        description: "Footer with branding and open source links",
      },
      {
        type: "feature",
        description: "Complete navigation bar with responsive design",
      },
      {
        type: "feature",
        description: "'How it Works' section on landing page",
      },
      {
        type: "improvement",
        description: "Polished intro section design",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2025-12-26",
    changes: [
      {
        type: "feature",
        description: "Initial hero section with brand introduction",
      },
      {
        type: "feature",
        description: "Feature badge section showcasing app capabilities",
      },
      {
        type: "feature",
        description: "Project foundation and structure",
      },
    ],
  },
];
