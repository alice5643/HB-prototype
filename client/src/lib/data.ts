export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  tags: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  pairingSuggestion?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  description?: string;
  items: Dish[];
}

export const aLaCarteMenuData: MenuSection[] = [
  {
    id: "starters",
    title: "To Begin",
    description: "Small plates designed to awaken the palate.",
    items: [
      {
        id: "1",
        name: "Heirloom Tomato Tart",
        description: "Whipped ricotta, basil oil, pine nuts, aged balsamic.",
        price: 14,
        category: "starters",
        image: "/images/dish1.jpg",
        tags: ["Light", "Vegetarian"],
        allergens: ["Dairy", "Nuts", "Gluten"],
        isVegetarian: true
      },
      {
        id: "2",
        name: "Cured Hamachi",
        description: "Yuzu kosho, radish, cucumber, shiso leaf.",
        price: 18,
        category: "starters",
        image: "/images/dish2.jpg",
        tags: ["Fresh", "Raw"],
        allergens: ["Fish"],
        isGlutenFree: true
      },
      {
        id: "3",
        name: "Roasted Beetroot",
        description: "Goat cheese mousse, candied walnuts, dill.",
        price: 12,
        category: "starters",
        image: "/images/dish3.jpg",
        tags: ["Earthy", "Vegetarian"],
        allergens: ["Dairy", "Nuts"],
        isVegetarian: true,
        isGlutenFree: true
      }
    ]
  },
  {
    id: "sides",
    title: "Sides",
    description: "Perfect additions to your meal.",
    items: [
      {
        id: "s1",
        name: "Truffle Fries",
        description: "Parmesan, truffle oil, chives.",
        price: 8,
        category: "sides",
        image: "/images/dish3.jpg",
        tags: ["Crispy", "Vegetarian"],
        allergens: ["Dairy"],
        isVegetarian: true,
        isGlutenFree: true
      },
      {
        id: "s2",
        name: "Charred Broccolini",
        description: "Chili, garlic, lemon.",
        price: 9,
        category: "sides",
        image: "/images/dish2.jpg",
        tags: ["Spicy", "Vegan"],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true
      }
    ]
  },
  {
    id: "mains",
    title: "Main Courses",
    description: "Substantial dishes, perfect for sharing or enjoying solo.",
    items: [
      {
        id: "4",
        name: "Pan-Seared Scallops",
        description: "Cauliflower purée, caper raisin vinaigrette, crispy pancetta.",
        price: 32,
        category: "mains",
        image: "/images/dish4.jpg",
        tags: ["Rich", "Seafood"],
        allergens: ["Shellfish", "Dairy"],
        isGlutenFree: true
      },
      {
        id: "5",
        name: "Wild Mushroom Risotto",
        description: "Arborio rice, porcini, truffle oil, parmesan crisp.",
        price: 26,
        category: "mains",
        image: "/images/dish1.jpg", // Reusing for demo
        tags: ["Comforting", "Vegetarian"],
        allergens: ["Dairy"],
        isVegetarian: true,
        isGlutenFree: true
      },
      {
        id: "6",
        name: "Duck Breast",
        description: "Parsnip purée, blackberry jus, roasted chicory.",
        price: 34,
        category: "mains",
        image: "/images/dish2.jpg", // Reusing for demo
        tags: ["Rich", "Meat"],
        allergens: [],
        isGlutenFree: true
      }
    ]
  },
  {
    id: "desserts",
    title: "Sweet Endings",
    description: "A delicate finish to your meal.",
    items: [
      {
        id: "7",
        name: "Dark Chocolate Ganache",
        description: "Sea salt, olive oil, sourdough crumble.",
        price: 12,
        category: "desserts",
        image: "/images/dish3.jpg", // Reusing for demo
        tags: ["Rich", "Sweet"],
        allergens: ["Dairy", "Gluten"],
        isVegetarian: true
      },
      {
        id: "8",
        name: "Lemon Posset",
        description: "Shortbread, raspberry coulis, mint.",
        price: 10,
        category: "desserts",
        image: "/images/dish4.jpg", // Reusing for demo
        tags: ["Light", "Citrus"],
        allergens: ["Dairy", "Gluten"],
        isVegetarian: true,
        pairingSuggestion: "Often paired with a crisp Sauvignon Blanc."
      }
    ]
  }
];

export const drinksMenuData: MenuSection[] = [
  {
    id: "cocktails",
    title: "Signature Cocktails",
    description: "Hand-crafted libations inspired by the seasons.",
    items: [
      {
        id: "d1",
        name: "Yuzu Highball",
        description: "Japanese whisky, fresh yuzu, soda, shiso leaf.",
        price: 14,
        category: "cocktails",
        tags: ["Refreshing", "Citrus"],
        pairingSuggestion: "Perfect with the Cured Hamachi."
      },
      {
        id: "d2",
        name: "Smoked Old Fashioned",
        description: "Bourbon, maple syrup, angostura bitters, hickory smoke.",
        price: 16,
        category: "cocktails",
        tags: ["Strong", "Smoky"],
        pairingSuggestion: "Pairs well with the Duck Breast."
      }
    ]
  },
  {
    id: "wines",
    title: "Wines by the Glass",
    description: "Curated selection from sustainable vineyards.",
    items: [
      {
        id: "d3",
        name: "Sancerre, Domaine Vacheron",
        description: "Loire Valley, France. Crisp, mineral, citrus notes.",
        price: 15,
        category: "wine",
        tags: ["White", "Dry"],
        pairingSuggestion: "Excellent with the Pan-Seared Scallops."
      },
      {
        id: "d4",
        name: "Pinot Noir, Felton Road",
        description: "Central Otago, NZ. Red cherry, spice, earthy.",
        price: 18,
        category: "wine",
        tags: ["Red", "Light"],
        pairingSuggestion: "Try this with the Roasted Beetroot."
      }
    ]
  },
  {
    id: "soft",
    title: "Soft Drinks",
    description: "Refreshing non-alcoholic options.",
    items: [
      {
        id: "d5",
        name: "Homemade Lemonade",
        description: "Fresh lemon, mint, soda.",
        price: 6,
        category: "drinks",
        tags: ["Non-Alcoholic"],
      },
      {
        id: "d6",
        name: "Sparkling Water",
        description: "750ml bottle.",
        price: 5,
        category: "drinks",
        tags: ["Non-Alcoholic"],
      }
    ]
  }
];

export const menus = [
  { id: "alacarte", title: "A la Carte", data: aLaCarteMenuData },
  { id: "drinks", title: "Drinks Menu", data: drinksMenuData },
  { id: "tasting", title: "Tasting Menu", description: "Coming soon", disabled: true },
  { id: "promenn", title: "Promenn Menu", description: "Coming soon", disabled: true },
];
