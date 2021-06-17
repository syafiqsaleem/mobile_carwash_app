const newSelection = [
  {
    name: "bronze",
    image: "../public/img/bronze.jpg",
    price: "80",
    services: [
      {
        name: "waterless wash",
        type: "exterior",
      },
      {
        name: "vacuum",
        type: "interior",
      },
      {
        name: "wash & tyre shine",
        type: "wheels",
      },
    ],
  },
  {
    name: "silver",
    services: [
      {
        name: "sonax wash",
        type: "exteriorwash",
      },
      {
        name: "vacuum & leather care",
        type: "interior",
      },
      {
        name: "chemical wash & tyre shine",
        type: "wheels",
      },
      {
        name: "water wax",
        type: "protective coating",
      },
    ],
    image: "../public/img/silver.jpg",
    price: "150",
  },
  {
    name: "gold",
    services: [
      {
        name: "sonax snow foam wash",
        type: "exteriorwash",
      },
      {
        name: "vacuum, leather care & dashboard protector",
        type: "interior",
      },
      {
        name: "chemical wash & tyre shine",
        type: "wheels",
      },
      {
        name: "ceramic coating",
        type: "protective coating",
      },
      {
        name: "claybar treatment",
        type: "exterior",
      },
    ],
    image: "../public/img/gold.jpg",
    price: "300",
  },
];

module.exports = newSelection;
