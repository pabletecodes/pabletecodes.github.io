// Everything personal about the site lives here and in career.ts.

export const site = {
  name: 'Pablo Alonso',
  // Browser tab, search results and link previews. The page heading is `name`.
  title: 'Pablo Alonso · Product Engineer',
  tagline: 'Product engineer. I make sure AI builds the right thing, right.',
  bio: [
    "I'm a software engineer grounded in clean code who brings the product judgment: AI executes, I decide what to build.",
    'I write about product engineering and building with AI in practice: what to delegate and what not, keeping quality high when code is generated, and building things solo.',
  ],
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
