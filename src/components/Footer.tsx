import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container text-center space-y-2">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aria Salon · Vesterbrogade 86, 1620 København V
      </p>
      <p className="text-xs text-muted-foreground">
        <a href="tel:+4553770037" className="hover:text-primary transition-colors">+45 53 77 00 37</a>
        {" "}·{" "}
        <Link to="/privatlivspolitik" className="hover:text-primary transition-colors">Privatlivspolitik</Link>
        {" "}·{" "}
        <Link to="/admin" className="text-muted-foreground/60 hover:text-primary transition-colors">Admin</Link>
      </p>
      <p className="text-xs text-muted-foreground/50">Frisør på Vesterbro, København</p>
      <div className="flex justify-center pt-1">
        <a
          href="https://www.facebook.com/p/Aria-salon-100063702064710/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Aria Salon på Facebook"
          className="text-muted-foreground/50 hover:text-primary transition-colors p-2"
        >
          <FacebookIcon />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
