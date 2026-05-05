export type Service = {
  name: string;
  price: string;
  duration: number; // minutes
};

export const services: Service[] = [
  { name: "Herreklip", price: "249 kr", duration: 30 },
  { name: "Pensionistklip", price: "200 kr", duration: 30 },
  { name: "Børneklip", price: "200 kr", duration: 25 },
  { name: "Dameklip (fra)", price: "300 kr", duration: 45 },
  { name: "Skægtrim", price: "130 kr", duration: 15 },
  { name: "Vask", price: "100 kr", duration: 10 },
  { name: "Maskinklip", price: "150 kr", duration: 20 },
  { name: "Hårfjerning (med snor)", price: "150 kr", duration: 10 },
];
