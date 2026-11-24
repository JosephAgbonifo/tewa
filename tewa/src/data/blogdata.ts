export type BlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  mainCategory: string;
  subCategories: string[];
  mainImage: string;
  supportingImages: string[];
  slide: boolean;
  slideImages?: string[];
  body: string; // the full blog content
};

// // Your category source
// const testimonials = [
//   { name: "Events" },
//   { name: "Business" },
//   { name: "Innovation" },
//   { name: "Travels" },
//   { name: "Money" },
// ];

// Mock data
export const blogData: BlogPost[] = [
  {
    id: "1",
    title: "TEWA Launches Today, Celebrated in 30 Different Countries",
    author: "Julia Morgan",
    date: "2025-12-08",
    mainCategory: "Events",
    subCategories: ["Innovation", "Business"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg"],
    slide: true,
    slideImages: ["/twhite.jpg", "/twhite.jpg", "/twhite.jpg"],
    body: `
Tewa Launches in Nigeria, India, USA, England, and 26 other countries today, creating a new era of women empowerment, a world that doesn't hate men but fights to accommodate women.
Tewa is not just a movement, it is a revolution that brings communities together, fosters leadership, and celebrates the untapped potential of women across the globe.
This initiative promises to create lasting impact through events, mentorship, and collaboration with businesses and innovators worldwide.
In the first phase, Tewa will host workshops, panels, and celebrations in major cities, bringing voices together in a spirit of progress.
It is a movement where stories, experiences, and innovation converge to reshape societies for a brighter, more inclusive future.
    `,
  },
  {
    id: "2",
    title: "Empowering Women in Business Through Innovation",
    author: "Julia Morgan",
    date: "2025-12-07",
    mainCategory: "Business",
    subCategories: ["Innovation", "Money"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg"],
    slide: false,
    body: `
The world of business is changing rapidly, and women are at the forefront of this transformation. Through Tewa, women entrepreneurs gain access to resources, mentorship, and global networks.
From funding opportunities to workshops on innovative solutions, Tewa ensures that women have the tools to thrive in competitive markets.
The program also emphasizes collaboration and cross-industry learning, connecting leaders in finance, technology, and creative industries.
By celebrating success stories and providing actionable support, Tewa fosters a generation of women business leaders ready to change the world.
    `,
  },
  {
    id: "3",
    title: "Innovation and Travel: Tewa’s Global Footprint",
    author: "Julia Morgan",
    date: "2025-12-06",
    mainCategory: "Travels",
    subCategories: ["Events", "Innovation"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg"],
    slide: true,
    slideImages: ["/twhite.jpg", "/twhite.jpg"],
    body: `
Tewa’s launch spans continents, blending innovation with cultural experiences. Women leaders, innovators, and travelers come together to exchange ideas, celebrate achievements, and plan future initiatives.
Workshops and events are held in iconic cities, allowing participants to immerse themselves in local culture while sharing global perspectives.
Travel and innovation are intertwined, creating a network of empowered women who can inspire change and foster sustainable solutions in their communities.
Through Tewa, every journey is a story of growth, collaboration, and groundbreaking initiatives that set new standards for empowerment worldwide.
    `,
  },
  {
    id: "4",
    title: "The Future of Money Management for Women",
    author: "Julia Morgan",
    date: "2025-12-05",
    mainCategory: "Money",
    subCategories: ["Business", "Innovation"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg"],
    slide: false,
    body: `
Financial independence is essential for empowerment. Tewa introduces practical programs to teach women budgeting, investing, and long-term wealth creation.
Workshops and seminars cover financial literacy, entrepreneurship funding, and investment strategies.
By connecting women with experts in finance and business, Tewa ensures they are equipped to make impactful decisions in personal and professional life.
Money management becomes a tool for confidence, creativity, and community growth.
    `,
  },
  {
    id: "5",
    title: "Events That Inspire Innovation",
    author: "Julia Morgan",
    date: "2025-12-04",
    mainCategory: "Events",
    subCategories: ["Innovation", "Travels"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg", "/twhite.jpg"],
    slide: true,
    slideImages: ["/twhite.jpg", "/twhite.jpg"],
    body: `
Tewa’s global events bring innovators and visionaries together. Every gathering is a platform for learning, networking, and sharing breakthroughs.
From keynote speeches to collaborative workshops, participants are exposed to cutting-edge ideas and practical strategies.
These events are designed to spark creativity, encourage collaboration, and cultivate leaders who can drive social change in their communities.
With every event, Tewa strengthens its network of empowered women across borders.
    `,
  },
  {
    id: "6",
    title: "Traveling with Purpose: Empowerment on the Move",
    author: "Julia Morgan",
    date: "2025-12-03",
    mainCategory: "Travels",
    subCategories: ["Money", "Events"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg"],
    slide: false,
    body: `
Travel is not just leisure; it is a journey of empowerment. Tewa organizes global trips that mix cultural immersion with learning experiences.
Participants visit innovation hubs, attend workshops, and connect with local leaders to exchange insights.
Traveling with purpose fosters confidence, resilience, and inspiration among women leaders.
Each journey contributes to a shared global vision of collaboration, progress, and empowerment.
    `,
  },
  {
    id: "7",
    title: "Business and Innovation: Strategies for Success",
    author: "Julia Morgan",
    date: "2025-12-02",
    mainCategory: "Business",
    subCategories: ["Innovation", "Events"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg"],
    slide: true,
    slideImages: ["/twhite.jpg", "/twhite.jpg", "/twhite.jpg"],
    body: `
Success in business requires vision, planning, and innovation. Tewa equips women entrepreneurs with skills to launch and scale successful ventures.
Through workshops, mentorship, and peer support, participants learn how to navigate challenges and seize opportunities.
Innovation is encouraged at every stage, ensuring businesses remain relevant and competitive in global markets.
Tewa’s holistic approach combines strategy, creativity, and empowerment to create sustainable impact.
    `,
  },
  {
    id: "8",
    title: "Innovation Labs: Where Ideas Turn into Action",
    author: "Julia Morgan",
    date: "2025-12-01",
    mainCategory: "Innovation",
    subCategories: ["Business", "Events"],
    mainImage: "/twhite.jpg",
    supportingImages: ["/twhite.jpg", "/twhite.jpg"],
    slide: false,
    body: `
Tewa’s Innovation Labs provide a platform for experimentation, collaboration, and skill development.
Participants bring ideas to life with guidance from experts and access to global resources.
Labs focus on problem-solving, creative thinking, and practical implementation strategies.
By fostering a hands-on environment, Tewa ensures women innovators gain confidence and achieve tangible outcomes that impact communities.
    `,
  },
];
