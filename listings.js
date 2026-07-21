// Housing listings for NestFinder, as structured data so the results page can
// render, search, and filter them, and the house page can show one in detail.
// Fields:
//   id          - unique identifier (used in housepage.html?id=...)
//   title       - listing headline (searched by keyword)
//   image       - path to the listing photo (used for both card and detail)
//   beds        - number of bedrooms
//   baths       - number of bathrooms
//   price       - rent per month, in dollars (number)
//   distance    - distance from UBC, in km (number)
//   type        - "apartment" | "house" | "room" (also searched by keyword)
//   description - detail-page blurb
//   link        - external listing URL (opened from the detail page)

window.LISTINGS = [
  {
    id: 1,
    title: "1 Bed 1 Bath - Apartment Round",
    image: "images/result-img-1.png",
    beds: 1,
    baths: 1,
    price: 2600,
    distance: 1.3,
    type: "apartment",
    description:
      "Gastown loft available. 1 bed + 1 bath, 1 underground parking spot. " +
      "Comes with TV, sofa, and bed — can be unfurnished at the same price. " +
      "Storage locker included. Available Feb 15, 2025. One year minimum. Pets allowed.",
    link: "https://www.facebook.com/share/196dEAFhPW/",
  },
  {
    id: 2,
    title: "2 Bed/2 Bath Apartment",
    image: "images/result-img-2.png",
    beds: 2,
    baths: 2,
    price: 4100,
    distance: 1.5,
    type: "apartment",
    description:
      "Spacious 2 bedroom, 2 bathroom apartment with floor-to-ceiling windows and " +
      "a bright open living area. In-suite laundry and a fitness centre in the building. " +
      "Perfect for roommates sharing near UBC.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=apartment",
  },
  {
    id: 3,
    title: "1 Bed 1 Bath - Apartment",
    image: "images/result-img-3.png",
    beds: 1,
    baths: 1,
    price: 2200,
    distance: 0.5,
    type: "apartment",
    description:
      "Cozy 1 bedroom apartment just a short walk from campus. Recently renovated " +
      "kitchen, plenty of natural light, and a quiet building. Ideal for a single " +
      "student or couple.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=apartment",
  },
  {
    id: 4,
    title: "2 Beds 2 Baths House",
    image: "images/result-img-4.jpeg",
    beds: 2,
    baths: 2,
    price: 3200,
    distance: 0.5,
    type: "house",
    description:
      "Charming 2 bedroom house with a private backyard and driveway parking. " +
      "Full kitchen, living room, and dining area. Only half a kilometre from UBC — " +
      "great for a small group of students.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=house",
  },
  {
    id: 5,
    title: "1 Bed 1 Bath - House",
    image: "images/result-img-5.jpeg",
    beds: 1,
    baths: 1,
    price: 750,
    distance: 1.2,
    type: "house",
    description:
      "Affordable 1 bedroom in a shared house. Utilities included, furnished common " +
      "areas, and a friendly household of students. A budget-friendly option close to " +
      "campus.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=house",
  },
  {
    id: 6,
    title: "2 Bed 2 Bath Apartment",
    image: "images/result-img-6.jpeg",
    beds: 2,
    baths: 2,
    price: 3400,
    distance: 1.4,
    type: "apartment",
    description:
      "Modern 2 bedroom, 2 bathroom apartment with a balcony and mountain views. " +
      "Stainless steel appliances, in-suite laundry, and secure entry. Steps from " +
      "transit to UBC.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=apartment",
  },
  {
    id: 7,
    title: "Fully Furnished 2 Bedroom Upper Level Suite with Balconies",
    image: "images/result-img-7.jpeg",
    beds: 2,
    baths: 1,
    price: 5995,
    distance: 1.5,
    type: "apartment",
    description:
      "Fully furnished upper-level suite with two private balconies and generous living " +
      "space. Everything included — just bring your suitcase. High-end finishes " +
      "throughout, perfect for a premium stay near campus.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=suite",
  },
  {
    id: 8,
    title: "1 Bedroom Suite with City Views and Hotel Amenities",
    image: "images/result-img-8.jpeg",
    beds: 1,
    baths: 1,
    price: 3195,
    distance: 0.7,
    type: "apartment",
    description:
      "Bright 1 bedroom suite with sweeping city views and access to hotel-style " +
      "amenities including a concierge, gym, and rooftop lounge. Walking distance to " +
      "UBC and shops.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=suite",
  },
  {
    id: 9,
    title: "Private Room for Rent",
    image: "images/result-img-9.jpeg",
    beds: 1,
    baths: 1,
    price: 750,
    distance: 0.3,
    type: "room",
    description:
      "Private furnished room in a shared home, closest to campus on this list. " +
      "Shared kitchen and bathroom, all utilities and Wi-Fi included. Move-in ready — " +
      "ideal for a student who wants to be minutes from UBC.",
    link: "https://www.facebook.com/marketplace/vancouver/search/?query=room",
  },
];
