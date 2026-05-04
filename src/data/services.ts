export type Service = {
  name: string;
  price: string;
  duration: number; // minutes
};

export const services: Service[] = [
  { name: "Herreklip", price: "240 kr", duration: 30 },
  { name: "Hår + skæg", price: "380 kr", duration: 45 },
  { name: "Børneklip (op til 11 år)", price: "200 kr", duration: 25 },
  { name: "Børneklip etager (0–1 år)", price: "220 kr", duration: 25 },
  { name: "Pensionistklip herre", price: "200 kr", duration: 30 },
  { name: "Maskinklip", price: "150 kr", duration: 20 },
  { name: "Skinfade (barbermaskine / kniv)", price: "250 kr", duration: 45 },
  { name: "Trim af skæg", price: "160 kr", duration: 15 },
  { name: "Trim af skæg + kanter med kniv", price: "180 kr", duration: 20 },
  { name: "Kun skæg", price: "200 kr", duration: 20 },
  { name: "Snor", price: "120 kr", duration: 10 },
  { name: "Næsehår (voks)", price: "100 kr", duration: 10 },
  { name: "Vask af hår", price: "80 kr", duration: 10 },
];
