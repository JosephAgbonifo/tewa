import { Post, AdSlot } from "@/types/post";

export const categories = [
  "Popular",
  "Beauty",
  "Wellness",
  "Lifestyle",
  "Buzz",
  "Entertainment",
] as const;

export const mockPosts: Post[] = [
  {
    id: "1",
    slug: "makeup-trends-fall-runways",
    title: "We Can't Wait to Try These Makeup Trends From the Fall Runways",
    excerpt:
      "A closer look at the beauty statements defining this season's runways, from bold liner to sculpted skin.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue. Mauris elementum accumsan leo vel tempor.",
      "Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
    image: "/images/posts/post-01.jpg",
    category: "Beauty",
    author: "John Philippe",
    date: "2026-03-20",
    featured: true,
  },
  {
    id: "2",
    slug: "influencers-reveal-women-who-inspire",
    title: "Industry Influencers Reveal the Famous Women Who Inspire Them",
    excerpt:
      "We asked the people shaping the industry who they look up to — the answers might surprise you.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
    image: "/images/posts/post-02.jpg",
    category: "Lifestyle",
    author: "John Philippe",
    date: "2026-03-22",
  },
  {
    id: "3",
    slug: "blogger-rumi-neely-california",
    title: "Blogger Rumi Neely: Where to Eat, Drink and Shop in California",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-03.jpg",
    category: "Buzz",
    author: "John Philippe",
    date: "2026-03-18",
  },
  {
    id: "4",
    slug: "editors-fashion-week-fall",
    title: "Spotted! What the Editors Wore to Fashion Week",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-04.jpg",
    category: "Entertainment",
    author: "John Philippe",
    date: "2026-03-17",
  },
  {
    id: "5",
    slug: "spring-pieces-start-wearing-now",
    title: "11 Spring Pieces You Can Start Wearing Now (Seriously)",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-05.jpg",
    category: "Wellness",
    author: "John Philippe",
    date: "2026-03-15",
    trending: true,
  },
  {
    id: "6",
    slug: "colors-dominate-fashion-week",
    title: "These Are the Colors Set to Dominate This Fashion Week",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-06.jpg",
    category: "Popular",
    author: "John Philippe",
    date: "2026-03-14",
  },
  {
    id: "7",
    slug: "hoover-dam-bridge-image",
    title: "Magnificent Image of the New Hoover Dam Bridge Taking Shape",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-07.jpg",
    category: "Buzz",
    author: "John Philippe",
    date: "2026-03-12",
  },
  {
    id: "8",
    slug: "street-style-haute-couture-paris",
    title:
      "High-End Street Style Shines at Haute Couture Fashion Week in Paris",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
    image: "/images/posts/post-08.jpg",
    category: "Entertainment",
    author: "John Philippe",
    date: "2026-03-10",
  },
  {
    id: "9",
    slug: "post-holiday-detox-recipes",
    title:
      "3 Delicious Post-Holiday Detox Recipes, Courtesy of a Personal Chef",
    excerpt:
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-09.jpg",
    category: "Wellness",
    author: "John Philippe",
    date: "2026-03-24",
  },
  {
    id: "10",
    slug: "21-questions-fashion-photographer",
    title: "21 Questions With… Fashion Photographer Emma Summerton",
    excerpt:
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-10.jpg",
    category: "Buzz",
    author: "John Philippe",
    date: "2026-03-24",
  },
  {
    id: "11",
    slug: "runway-scorecard-in-demand-models",
    title: "Runway Scorecard: The 10 Most In-Demand Models of Fashion Month",
    excerpt:
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-11.jpg",
    category: "Popular",
    author: "John Philippe",
    date: "2026-03-24",
  },
  {
    id: "12",
    slug: "kookai-spring-runway-arrivals",
    title: "Kookaï's Spring Runway Arrivals Talk Trends and Local Labels",
    excerpt:
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur.",
    content: [
      "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
      "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
    image: "/images/posts/post-12.jpg",
    category: "Lifestyle",
    author: "John Philippe",
    date: "2026-03-23",
  },
];

export const mockAds: AdSlot[] = [
  {
    id: "leaderboard",
    image: "/images/ads/ad-leaderboard.jpg",
    href: "#",
    label: "728x90 Ads",
  },
  {
    id: "square",
    image: "/images/ads/ad-square.jpg",
    href: "#",
    label: "300x250 Ads",
  },
];

export const getFeaturedPost = () =>
  mockPosts.find((p) => p.featured) ?? mockPosts[0];

export const getTrendingPost = () =>
  mockPosts.find((p) => p.trending) ?? mockPosts[1];

export const getPopularPosts = (limit = 3) => mockPosts.slice(0, limit);

export const getPostsByCategory = (category: string, limit = 3) =>
  (category === "Popular"
    ? mockPosts
    : mockPosts.filter((p) => p.category === category)
  ).slice(0, limit);

export const getPostBySlug = (slug: string) =>
  mockPosts.find((p) => p.slug === slug);

const genericContent = [
  "Lorem ipsum dosectetur adipisicing elit, sed do. Lorem ipsum dolor sit amet, consectetur. Nulla fringilla purus at leo dignissim congue.",
  "Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
];

export const getPostContent = (post: Post) => post.content ?? genericContent;

export const getRelatedPosts = (post: Post, limit = 3) =>
  mockPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, limit);
