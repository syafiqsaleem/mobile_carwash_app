const newSelection = [
  {
    name: "sonax snow foam wash",
    type: "exteriorwash",
    price: 10,
    image: "https://images.app.goo.gl/HYAkVChqNxkspvmRA",
    properties: {
      surface: "Clean & Shiny",
      coat: "waterwax",
      duration: "30mins",
    },
  },
  {
    name: "waterless wash",
    type: "exteriorwash",
    price: 8,
    image: "https://images.app.goo.gl/AeW68G9E79eN7SKy9",
    properties: {
      surface: "Clean & Shiny",
      coat: "waterwax",
      duration: "20mins",
    },
  },
  {
    name: "claybar treatment",
    type: "surfacetreatment",
    price: 30,
    image: "https://images.app.goo.gl/UHJXv4Cr2UobAot2A",
    properties: {
      surface: "Safe removal of contaminants",
      advantage: "Silky smooth appeal",
      duration: "45mins",
    },
  },
  {
    name: "ceremic coating",
    type: "surfacetreatment",
    price: 200,
    image: "https://images.app.goo.gl/fmT3UgsG5NmvxqGv7",
    properties: {
      surface: "Safe removal of contaminants",
      advantage: "Silky smooth appeal",
      duration: "60mins",
    },
  },
  {
    name: "rim chemical scrub & tyre shine",
    type: "wheels",
    price: 8,
    image: "https://images.app.goo.gl/Gnb1y3mxE7ZqVxcU9",
    properties: {
      surface: "Removes dirt and grime build up",
      advantage: "shiny & Clean",
      duration: "15mins",
    },
  },
  {
    name: "tyre shine",
    type: "wheels",
    price: 2,
    image: "https://images.app.goo.gl/6pMZvFFNbyWcv2DP9",
    properties: {
      surface: "Wet look",
      advantage: "Protective layer that repel dirt & grime",
      duration: "10mins",
    },
  },
  {
    name: "vacuum",
    type: "interior",
    price: 10,
    image: "https://images.app.goo.gl/kw9qJqDz1e9sr8DeA",
    properties: {
      surface: "Clean from dirt & dust",
      advantage: "dust-free",
      duration: "20mins",
    },
  },
  {
    name: "vacuum & disinfection interior wipedown",
    type: "interior",
    price: 30,
    image: "https://images.app.goo.gl/kw9qJqDz1e9sr8DeA",
    properties: {
      surface: "Clean from dirt, dust & bacteria",
      advantage: "clean & protected",
      duration: "40mins",
    },
  },
  {
    name: "leather conditioning",
    type: "leathercare",
    price: 30,
    image: "https://images.app.goo.gl/dtaC6hWatRSoajCQ7",
    properties: {
      surface: "Clean & smooth to touch",
      advantage: "Restore leather condition",
      duration: "40mins",
    },
  },
  {
    name: "leather cleaning",
    type: "leathercare",
    price: 25,
    image: "https://images.app.goo.gl/XmDAjbTnZsYSRqEr6",
    properties: {
      surface: "Clean",
      advantage: "remove dirt & dust",
      duration: "20mins",
    },
  },
  {
    name: "fumigation",
    type: "addon",
    price: 40,
    image: "https://images.app.goo.gl/YKGybsu7bhfA5cvu6",
    properties: {
      surface: "Clean",
      advantage: "pest-free",
      duration: "30mins",
    },
  },
];

newSelection = newSelection.map((item) => {
  item.slug = _.kebabCase(item.name);
  return item;
})

module.exports = newSelection;
