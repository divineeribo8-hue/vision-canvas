export type ServiceKey =
  | "portraits"
  | "personal-branding"
  | "product-photography"
  | "creative-concepts"
  | "events-captured-cinematically"
  | "videography";

export type PackageOption = {
  id: string;
  service: ServiceKey;
  name: string;
  price: string;
  duration: string;
  deliverables: string;
  included: string[];
  preparation: string;
};

export type PortfolioItem = {
  id: string;
  section: ServiceKey;
  title: string;
  type: "image" | "video";
  orientation: "portrait" | "landscape" | "square";
};

export const serviceLabels: Record<ServiceKey, string> = {
  portraits: "Portraits",
  "personal-branding": "Personal Branding",
  "product-photography": "Product Photography",
  "creative-concepts": "Creative Concepts",
  "events-captured-cinematically": "Events Captured Cinematically",
  videography: "Videography",
};

export const services = [
  {
    key: "portraits" as const,
    title: "PORTRAITS",
    description: "Visual representation of personality, presence and individuality.",
  },
  {
    key: "personal-branding" as const,
    title: "PERSONAL BRANDING",
    description: "Visuals that communicate identity, profession and personal story.",
  },
  {
    key: "product-photography" as const,
    title: "PRODUCT PHOTOGRAPHY",
    description: "Intentional imagery designed to communicate products clearly and beautifully.",
  },
  {
    key: "creative-concepts" as const,
    title: "CREATIVE CONCEPTS",
    description: "Visual storytelling built around imagination, concepts and unique ideas.",
  },
  {
    key: "events-captured-cinematically" as const,
    title: "EVENTS CAPTURED CINEMATICALLY",
    description: "Authentic documentation of atmosphere, emotion and meaningful moments.",
  },
  {
    key: "videography" as const,
    title: "VIDEOGRAPHY",
    description: "Moving images that extend stories beyond a single frame.",
  },
];

const portraitIncludes = [
  "Creative direction before the session",
  "Guided posing and expression support",
  "Private review and careful image refinement",
];

const editorialIncludes = [
  "Concept planning and visual direction",
  "Editorial-style shooting approach",
  "Careful final image selection and refinement",
];

export const packages: PackageOption[] = [
  {
    id: "portrait-essential",
    service: "portraits",
    name: "Essential",
    price: "₦15,000",
    duration: "20–30 minutes",
    deliverables: "3 edited images",
    included: portraitIncludes,
    preparation: "Arrive with one clear outfit direction and a simple idea of how you want to be seen.",
  },
  {
    id: "portrait-standard",
    service: "portraits",
    name: "Standard",
    price: "₦20,000",
    duration: "30–45 minutes",
    deliverables: "5 edited images",
    included: portraitIncludes,
    preparation: "Bring one to two looks and references for expression, mood or styling.",
  },
  {
    id: "portrait-plus",
    service: "portraits",
    name: "Plus",
    price: "₦25,000",
    duration: "45–60 minutes",
    deliverables: "7 edited images",
    included: portraitIncludes,
    preparation: "Prepare a stronger mood direction, outfit options and any meaningful details you want captured.",
  },
  {
    id: "portrait-premium",
    service: "portraits",
    name: "Premium",
    price: "₦30,000",
    duration: "Up to 2 hours",
    deliverables: "10 edited images",
    included: portraitIncludes,
    preparation: "Bring multiple looks, visual references and enough time to explore a fuller story.",
  },
  {
    id: "editorial-essential",
    service: "creative-concepts",
    name: "Editorial Essential",
    price: "₦20,000",
    duration: "Editorial session",
    deliverables: "3 edited images",
    included: editorialIncludes,
    preparation: "Share your concept, mood and styling direction before the session.",
  },
  {
    id: "editorial-standard",
    service: "creative-concepts",
    name: "Editorial Standard",
    price: "₦30,000",
    duration: "Editorial session",
    deliverables: "5 edited images",
    included: editorialIncludes,
    preparation: "Bring references, styling notes and a clear idea of the story or feeling.",
  },
  {
    id: "editorial-plus",
    service: "creative-concepts",
    name: "Editorial Plus",
    price: "₦35,000",
    duration: "Editorial session",
    deliverables: "7 edited images",
    included: editorialIncludes,
    preparation: "Prepare a detailed creative brief with wardrobe, setting and mood references.",
  },
  {
    id: "editorial-premium",
    service: "creative-concepts",
    name: "Editorial Premium",
    price: "₦45,000",
    duration: "Editorial session",
    deliverables: "10 edited images",
    included: editorialIncludes,
    preparation: "Ideal for fuller concepts with multiple visual directions and refined storytelling.",
  },
  {
    id: "video-45-60",
    service: "videography",
    name: "45–60 Seconds",
    price: "₦10,000",
    duration: "45–60 seconds final video",
    deliverables: "1 edited video",
    included: ["Video edit", "Pacing and story structure", "Export ready for sharing"],
    preparation: "Share the purpose, reference style and where the video will be used.",
  },
  {
    id: "video-61-100",
    service: "videography",
    name: "61–100 Seconds",
    price: "₦15,000",
    duration: "61–100 seconds final video",
    deliverables: "1 edited video",
    included: ["Video edit", "Pacing and story structure", "Export ready for sharing"],
    preparation: "Share the purpose, reference style and where the video will be used.",
  },
  {
    id: "video-101-150",
    service: "videography",
    name: "101–150 Seconds",
    price: "₦20,000",
    duration: "101–150 seconds final video",
    deliverables: "1 edited video",
    included: ["Video edit", "Pacing and story structure", "Export ready for sharing"],
    preparation: "Share the purpose, reference style and where the video will be used.",
  },
  {
    id: "video-151-200",
    service: "videography",
    name: "151–200 Seconds",
    price: "₦25,000",
    duration: "151–200 seconds final video",
    deliverables: "1 edited video",
    included: ["Video edit", "Pacing and story structure", "Export ready for sharing"],
    preparation: "Share the purpose, reference style and where the video will be used.",
  },
  {
    id: "video-custom",
    service: "videography",
    name: "Longer or Multiple Videos",
    price: "Custom quote",
    duration: "Scoped after review",
    deliverables: "Custom video deliverables",
    included: ["Creative brief review", "Custom scope", "Personal confirmation before work begins"],
    preparation: "Share the full video idea, length needs, platform and deadline.",
  },
];

export const futurePricingServices = [
  "Personal Branding",
  "Product Photography",
  "Events Captured Cinematically",
];

export const portfolioItems: PortfolioItem[] = services.flatMap((service, serviceIndex) =>
  Array.from({ length: service.key === "videography" ? 3 : 4 }, (_, index) => ({
    id: `${service.key}-${index + 1}`,
    section: service.key,
    title: `${service.title} ${index + 1}`,
    type: service.key === "videography" ? "video" : "image",
    orientation: (index + serviceIndex) % 3 === 0 ? "landscape" : (index + serviceIndex) % 3 === 1 ? "portrait" : "square",
  })),
);

export const selectedWork = portfolioItems.slice(0, 9);

export const availabilitySlots = [
  { date: "2026-10-03", times: ["10:00 AM", "1:00 PM", "4:00 PM"] },
  { date: "2026-10-04", times: ["12:00 PM", "3:00 PM"] },
  { date: "2026-10-08", times: ["9:00 AM", "2:00 PM", "5:00 PM"] },
  { date: "2026-10-11", times: ["11:00 AM", "3:30 PM"] },
  { date: "2026-10-15", times: ["10:30 AM", "1:30 PM", "4:30 PM"] },
  { date: "2026-10-18", times: ["9:30 AM", "12:30 PM"] },
];

export function findPackage(packageId: string | null | undefined) {
  return packages.find((item) => item.id === packageId);
}

export function getPackagesForService(service: ServiceKey) {
  return packages.filter((item) => item.service === service);
}
