export type ServiceKey = "portraits" | "videography";

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
  portraits: "Smartphone Portrait Photography",
  videography: "Basic Motion Video Editing",
};

export const motionDescription = "Professional basic motion video editing for clear, engaging visual communication. Depending on the project requirements, editing may include animated typography, basic motion graphics, transitions, sound effects, audio synchronisation, and final video export.";
export const motionConditions = "The listed prices apply to basic motion video editing. Advanced animation, complex visual effects, extensive editing requirements, or additional deliverables may require a custom quote. The exact editing scope and deliverables are agreed after reviewing your brief, before work begins.";
export const services = [
  { key: "portraits" as const, title: "SMARTPHONE PORTRAIT PHOTOGRAPHY", description: "Intentional smartphone portraits that reflect personality, presence and individuality." },
  { key: "videography" as const, title: "BASIC MOTION VIDEO EDITING", description: motionDescription },
];

const portraitIncludes = [
  "Creative direction before the session",
  "Guided posing and expression support",
  "Private review and careful image refinement",
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
  ...[
    ["video-60", "60 seconds or less", "₦20,000", "60 seconds or less final video"],
    ["video-90", "61–90 seconds", "₦25,000", "61–90 seconds final video"],
    ["video-120", "91–120 seconds", "₦30,000", "91–120 seconds final video"],
    ["video-180", "121–180 seconds", "₦40,000", "121–180 seconds final video"],
    ["video-240", "181–240 seconds", "₦50,000", "181–240 seconds final video"],
    ["video-custom", "Videos longer than 4 minutes", "Custom Quote", "Longer than 4 minutes"],
  ].map(([id, name, price, duration]): PackageOption => ({
    id: id ?? "video-custom", service: "videography", name: name ?? "Custom", price: price ?? "Custom Quote", duration: duration ?? "Agreed after review",
    deliverables: "Final video export; exact scope agreed after brief review",
    included: ["Creative brief and supplied footage review", "Basic motion editing within the agreed scope", "Final video export in the agreed format", motionConditions],
    preparation: "Share your footage, desired video length, reference style, intended platform and deadline. Any typography, graphics, transitions or audio work will be agreed based on your project requirements.",
  })),
];

export const portfolioItems: PortfolioItem[] = services.flatMap((service, serviceIndex) =>
  Array.from({ length: service.key === "videography" ? 6 : 24 }, (_, index) => ({
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
