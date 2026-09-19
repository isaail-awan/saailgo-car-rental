const details = {
  1: {
    engine: "1.6L Petrol",
    transmission: "Automatic",
    idealFor: "City and business trips",
    description: "A comfortable and fuel-efficient sedan that suits daily commutes, business meetings and family outings alike. Smooth ride, spacious cabin and reliable performance.",
    features: ["Air conditioning", "Bluetooth audio", "Reverse camera", "Power windows", "ABS with airbags"],
  },
  2: {
    engine: "1.5L Turbo",
    transmission: "Automatic",
    idealFor: "Long drives and highways",
    description: "A sporty sedan with a punchy turbo engine and a premium interior. Great for motorway trips when you want comfort and a bit of excitement.",
    features: ["Dual-zone climate control", "Touchscreen infotainment", "Cruise control", "Push-button start", "Sunroof"],
  },
  3: {
    engine: "660cc Petrol",
    transmission: "Manual",
    idealFor: "Budget city driving",
    description: "Small, easy to park and very light on fuel. The perfect pick for narrow streets, daily errands and anyone who wants the lowest rental price.",
    features: ["Air conditioning", "Power steering", "Central locking", "Music system", "Excellent fuel economy"],
  },
  4: {
    engine: "2.8L Diesel",
    transmission: "Automatic",
    idealFor: "Family trips and rough roads",
    description: "A powerful seven-seater SUV with high ground clearance and a commanding view of the road. Built for family trips, northern areas and rough terrain.",
    features: ["4WD capability", "Leather seats", "Rear AC vents", "Cruise control", "7 airbags"],
  },
  5: {
    engine: "2.0L Petrol",
    transmission: "Automatic",
    idealFor: "Comfortable family travel",
    description: "A modern crossover with a stylish design, a quiet cabin and plenty of tech. Comfortable for city driving and long family journeys.",
    features: ["Panoramic sunroof", "Touchscreen with Apple CarPlay", "Reverse camera", "Keyless entry", "Lane assist"],
  },
  6: {
    engine: "3.0L Diesel",
    transmission: "Manual",
    idealFor: "Groups and events",
    description: "A roomy van that seats up to 12 passengers with space for luggage. Ideal for group tours, weddings, corporate trips and airport transfers.",
    features: ["12 seats", "Powerful rear AC", "Large luggage space", "Sliding door", "Comfortable high roof"],
  },
  7: {
    engine: "1.0L Petrol",
    transmission: "Manual",
    idealFor: "Everyday city use",
    description: "A practical hatchback that is easy to drive, cheap to run and comfortable enough for four to five people on short trips.",
    features: ["Air conditioning", "Power windows", "Central locking", "Bluetooth audio", "Good fuel economy"],
  },
  8: {
    engine: "2.0L Petrol",
    transmission: "Automatic",
    idealFor: "Stylish city and highway travel",
    description: "A sharp-looking SUV with a refined interior, smooth automatic drive and generous boot space. A great all-rounder for work and weekends.",
    features: ["Touchscreen infotainment", "Reverse camera", "Automatic climate control", "Alloy wheels", "Cruise control"],
  },
};

export function getCarDetails(car) {
  return (
    details[car.id] || {
      engine: "N/A",
      transmission: "N/A",
      idealFor: car.category + " rental",
      description: car.name + " is regularly serviced and ready to rent.",
      features: ["Air conditioning", "Clean and sanitized", "Regularly serviced"],
    }
  );
}