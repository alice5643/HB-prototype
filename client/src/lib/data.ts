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
}

export interface MenuSection {
  id: string;
  title: string;
  description?: string;
  items: Dish[];
}

export const menuData: MenuSection[] = [
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
        isVegetarian: true
      }
    ]
  }
];
