// Housing listings for NestFinder, as structured data so the results page can
// render, search, and filter them. Fields:
//   id       - unique identifier
//   title    - listing headline (searched by keyword)
//   image    - path to the listing photo
//   beds     - number of bedrooms
//   baths    - number of bathrooms
//   price    - rent per month, in dollars (number)
//   distance - distance from UBC, in km (number)
//   type     - "apartment" | "house" | "room" (also searched by keyword)

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
  },
];
