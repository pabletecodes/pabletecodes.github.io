// Career timeline: one row per company or project, grouped, drawn as bars on
// a shared year axis. An entry can hold several positions (e.g. engineer, then
// PM); each one is a segment of the bar. Clicking an entry opens a detail card.
//
// Source: LinkedIn (profile PDF, Nov 2026), synced with the update-timeline skill
// (.claude/skills/update-timeline). Edit LinkedIn, not this file, except for
// the fields LinkedIn doesn't have: context, logo, url, and `manual` entries.

export interface Group {
  id: string;
  label: string;
}

export interface Position {
  title: string;
  start: number;
  end?: number; // omit for ongoing
  location?: string;
  highlights?: string[];
  stack?: string[]; // for companies with several positions; otherwise use Entry.stack
}

export interface Entry {
  group: Group['id'];
  name: string;
  context?: string; // one line on what the company or product is
  positions: Position[];
  approx?: boolean; // dates are estimates
  manual?: boolean; // not on LinkedIn: kept as is when syncing (see the update-timeline skill)
  logo?: string; // path under public/
  url?: string;
  stack?: string[]; // single-position entries
}

// Month precision: from(2015, 3) is the start of March 2015,
// to(2017, 12) is the end of December 2017.
const from = (year: number, month: number) => year + (month - 1) / 12;
const to = (year: number, month: number) => year + month / 12;

export const groups: Group[] = [
  { id: 'corporate', label: 'Work' },
  { id: 'side', label: 'Side projects' },
  { id: 'community', label: 'Community' },
  { id: 'education', label: 'Education' },
];

export const entries: Entry[] = [
  {
    group: 'corporate',
    name: 'Telefónica I+D',
    context: 'R&D arm of Telefónica.',
    logo: '/logos/telefonica.png',
    positions: [
      {
        title: 'Internship / Software Developer',
        start: from(2006, 3),
        end: to(2006, 9),
        location: 'Madrid',
        highlights: [
          'Worked on a client-side web app that monitored telephone switchboards in real time.',
          'Java on the server; JS and Bindows, one of the first Rich Internet Application frameworks, on the front end.',
        ],
      },
    ],
    stack: ['Java', 'JavaScript', 'Bindows'],
  },
  {
    group: 'corporate',
    name: 'VASS',
    context: 'IT consultancy.',
    logo: '/logos/vass.png',
    positions: [
      {
        title: 'Software Developer',
        start: from(2006, 12),
        end: to(2007, 9),
        location: 'Madrid',
        highlights: [
          'Worked with Vignette V7 (CMS & Portal) on a large client website.',
          'Maintained a (very) legacy Java ticketing system for Telefónica at Software AG. Fun fact: my first time using AJAX.',
        ],
      },
    ],
    stack: ['Java', 'Vignette'],
  },
  {
    group: 'corporate',
    name: 'Grupo Intermark',
    logo: '/logos/intermark.png',
    positions: [
      {
        title: 'Sr. Software Developer',
        start: from(2008, 7),
        end: to(2009, 12),
        location: 'Gijón',
        highlights: [
          'Built several websites on a proprietary Java CMS, following web and accessibility standards.',
          'Improved the CMS itself.',
          'Automated releases to production with Ant (previously done by hand).',
          'Promoted design patterns and good coding practices.',
        ],
      },
    ],
    stack: ['Java', 'Ant'],
  },
  {
    group: 'corporate',
    name: 'Universidad de Oviedo',
    logo: '/logos/uniovi.png',
    positions: [
      {
        title: 'Software Developer',
        start: from(2009, 12),
        end: to(2011, 7),
        location: 'Gijón',
        highlights: [
          'Built an eBook platform, similar to Goodreads, with Ruby on Rails.',
          'Built a Firefox extension for interacting with text on the web (bookmarks, highlights, schemas) with JavaScript and XUL.',
        ],
      },
    ],
    stack: ['Ruby on Rails', 'JavaScript', 'XUL'],
  },
  {
    group: 'corporate',
    name: 'BeBanjo',
    context: 'B2B SaaS for video-on-demand professionals.',
    logo: '/logos/bebanjo.png',
    url: 'https://bebanjo.com',
    positions: [
      {
        title: 'Full-stack Web Developer',
        start: from(2011, 9),
        end: to(2012, 7),
        location: 'Remote',
        highlights: ['Shipped features across 3 monolithic Ruby on Rails products for video-on-demand professionals.'],
      },
    ],
    stack: ['Ruby', 'Ruby on Rails', 'jQuery', 'Backbone.js'],
  },
  {
    group: 'corporate',
    name: 'Google',
    context: 'Wildfire, a social media marketing suite, after its acquisition by Google.',
    logo: '/logos/google.png',
    positions: [
      {
        title: 'Web Developer / UX Engineer',
        start: from(2012, 10),
        end: to(2014, 11),
        location: 'Mountain View, California',
        highlights: [
          'Built a Google+ integration so customers could reach more people by sharing content there.',
          'Influenced the product team to focus on a specific area of the product.',
          'Migrated a huge MySQL table with zero downtime to speed up a key query.',
          'Contributed to a full front-end rewrite with Google technologies (an early Angular.js).',
        ],
      },
    ],
    stack: ['Ruby', 'Ruby on Rails', 'MySQL', 'Redis', 'Resque', 'Angular.js'],
  },
  {
    group: 'corporate',
    name: 'CARTO',
    context: 'Location intelligence platform.',
    logo: '/logos/carto.png',
    url: 'https://carto.com',
    positions: [
      {
        title: 'Senior Software Developer',
        start: from(2015, 3),
        end: to(2017, 12),
        location: 'Remote / Madrid',
        highlights: [
          "Contributed to a full rewrite of Builder, giving CARTO's users a whole new UX.",
          "Designed and led a small team building a new version of CARTO's map rendering library for developers of custom location intelligence tools.",
        ],
        stack: ['JavaScript', 'Backbone.js', 'Leaflet', 'Google Maps JavaScript API', 'Ruby', 'Ruby on Rails'],
      },
      {
        title: 'Product Manager',
        start: from(2018, 1),
        end: to(2019, 12),
        location: 'Remote',
        highlights: [
          'Managed the ongoing development of Builder, fixing UX issues and making users happy.',
          'Launched a new dashboard so users could better organize their work.',
          'Launched a pricing plan for professionals that increased qualified leads and led to enterprise deals.',
          'Launched the first BigQuery connector, so customers could easily use their BigQuery data in CARTO.',
        ],
      },
    ],
  },
  {
    group: 'corporate',
    name: 'Empathy.co',
    context: 'Search and discovery for e-commerce.',
    logo: '/logos/empathy.png',
    url: 'https://empathy.co',
    positions: [
      {
        title: 'Product Manager',
        start: from(2020, 11),
        end: to(2022, 7),
        location: 'Remote',
        highlights: [
          'Launched the first versions of Motive.co as its first PM, planting the seeds for growth to hundreds of customers.',
        ],
      },
      {
        title: 'Senior Frontend Software Engineer',
        start: from(2022, 8),
        end: to(2025, 6),
        location: 'Remote',
        highlights: [
          "Shipped features for Kroger's Playboard, letting digital merchandisers improve Kroger's search experience and grow add-to-carts.",
          'Raised codebase quality: moved business logic into a new domain layer, reorganized the project and fostered a stronger testing culture.',
          'Prototyped new search capabilities and cut customization time of a multi-tenant demo from days to hours with a small design system.',
        ],
        stack: ['JavaScript / TypeScript', 'Vue.js', 'Vuex', 'Vue Router', 'd3.js'],
      },
    ],
  },
  {
    group: 'corporate',
    name: 'Salsa',
    context: 'Embedded payroll for software platforms.',
    logo: '/logos/salsa.png',
    url: 'https://salsa.dev',
    positions: [
      {
        title: 'Senior Software Engineer',
        start: from(2025, 6),
        end: to(2026, 8),
        location: 'Remote',
        highlights: [
          'Built a keyboard-driven Spreadsheet View for the Run Payroll UI from scratch and rolled it out to all production partners.',
          'Cut payroll run load times (a key query from ~23s to ~13s for large employers): removed N+1 queries found with Honeycomb traces, split GraphQL queries (~50% smaller payloads) and added infinite scroll.',
          'Shaped, scoped and delivered payroll projects such as Code TP in W-2 Box 12 and state-required fields on payslips.',
        ],
      },
    ],
    stack: ['Kotlin', 'Spring Boot', 'React', 'TypeScript', 'GraphQL', 'Chakra UI', 'GitHub Actions', 'Honeycomb', 'Claude Code'],
  },

  {
    group: 'side',
    name: 'TrabajosRails.com',
    logo: '/logos/trabajosrails.png',
    context: 'Job board for Ruby on Rails jobs in Spain.',
    positions: [
      {
        title: 'Founder and everything else',
        start: from(2011, 8),
        end: to(2020, 6),
        highlights: ['Built, marketed, ran and monetized it for almost nine years.'],
      },
    ],
    stack: ['JavaScript', 'jQuery', 'Ruby', 'Ruby on Rails', 'PostgreSQL', 'Heroku'],
  },
  {
    group: 'side',
    name: 'We Love Code',
    context: 'TrabajosRails.com, grown into a job platform for any developer.',
    positions: [
      {
        title: 'Founder and everything else',
        start: from(2020, 6),
        end: to(2022, 8),
        highlights: ['Evolved TrabajosRails.com into a job platform for all developers to expand the addressable market.'],
      },
    ],
    stack: ['JavaScript', 'jQuery', 'Ruby', 'Ruby on Rails', 'PostgreSQL', 'Heroku'],
  },
  {
    group: 'side',
    name: 'Pablete Codes',
    manual: true,
    context: 'Blog and newsletter on clean code, refactoring and testing.',
    logo: '/logos/substack.png',
    url: 'https://pabletecodes.substack.com',
    positions: [{ title: 'Writer', start: from(2024, 6), end: to(2025, 3) }],
  },

  {
    group: 'community',
    name: 'iWeekend',
    manual: true,
    logo: '/logos/iweekend.png',
    context: 'A weekend-long event to turn ideas into startups.',
    positions: [
      {
        title: 'Event Organizer',
        start: from(2010, 2),
        end: to(2010, 5),
        location: 'Asturias',
        highlights: [
          'Organized an iWeekend event in Asturias with a great group of people: found a venue, marketed the event, found sponsors and handled all the logistics.',
        ],
      },
    ],
  },
  {
    group: 'community',
    name: 'Asturias.rb',
    manual: true,
    context: 'Community events for Ruby developers in Asturias.',
    logo: '/logos/ruby.png',
    url: 'https://groups.google.com/g/asturiasrb',
    positions: [
      {
        title: 'Event Organizer',
        start: from(2011, 6),
        end: to(2012, 6),
        location: 'Asturias',
        highlights: ['Co-created Asturias.rb and organized several talks in different venues.'],
      },
    ],
  },
  {
    group: 'community',
    name: 'Asturias Toastmasters Club',
    manual: true,
    context: 'A Toastmasters club for practicing public speaking and leadership.',
    logo: '/logos/toastmasters.png',
    positions: [
      {
        title: 'Founding member and organizer',
        start: from(2016, 3),
        end: to(2018, 5),
        location: 'Asturias',
        highlights: [
          'After being a member of a couple of Toastmasters clubs in the Bay Area, started a club in Asturias together with someone who was also interested.',
        ],
      },
    ],
  },

  {
    group: 'education',
    name: 'Universidad Pontificia de Salamanca',
    logo: '/logos/upsa.png',
    positions: [{ title: 'Ingeniero en Informática, especialidad en gestión empresarial', start: from(1999, 9), end: to(2006, 6) }],
  },
  {
    group: 'education',
    name: 'Universidad de Oviedo',
    logo: '/logos/uniovi.png',
    positions: [
      {
        title: 'Máster en Ingeniería Web',
        start: from(2007, 9),
        end: to(2009, 6),
        highlights: ['Where I discovered Ruby on Rails.'],
      },
    ],
  },
  {
    group: 'education',
    name: 'FENA Business School',
    logo: '/logos/fena.png',
    positions: [{ title: 'Programa de desarrollo comercial para tecnólogos', start: from(2010, 1), end: to(2010, 12) }],
  },
  {
    group: 'education',
    name: 'ThePowerMBA',
    logo: '/logos/thepowermba.png',
    positions: [{ title: 'Business Administration and Management', start: from(2020, 1), end: to(2020, 12) }],
  },
];
