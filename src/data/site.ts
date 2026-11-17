// Everything personal about the site lives here and in career.ts.

export const site = {
  name: 'Pablo Alonso',
  // Browser tab, search results and link previews. The page heading is `name`.
  title: 'Pablo Alonso · Senior Product Engineer',
  tagline: 'Senior Product Engineer - I figure out what customers need, then build it and ship it.',
  bio: [
    "For 20 years I've been shipping software, sometimes as a full-stack or frontend engineer, sometimes as the PM deciding what to build, sometimes as a one-person team.",
    'What I enjoy most is starting from a customer problem and taking it all the way to launch. These days AI helps me get there faster.',
    "Right now I'm sharpening the axe: learning, tinkering, and open to interesting opportunities, remote, full-time or contract.",
  ],
  // Shown above the contact buttons.
  cta: 'Want to chat?',
  // Used by the "Shoot me an email" button. Split so the address never
  // appears whole in the HTML; the page assembles it.
  email: { user: 'alonsogarciapablo', domain: 'gmail.com' },
  links: [
    { label: 'X', url: 'https://x.com/pabletecodes' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pabletecodes/' },
    { label: 'Substack', url: 'https://pabletecodes.substack.com' },
    { label: 'GitHub', url: 'https://github.com/pabletecodes' },
  ],
  substack: {
    // RSS feed read at build time. Point it to the new "Pablete Builds"
    // Substack once it exists; for now, the old one.
    feed: 'https://pabletecodes.substack.com/feed',
    postCount: 5,
  },
};
