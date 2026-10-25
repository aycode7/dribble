"use client";

import { useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const leagues = [
{ name: "Premier League", slug: "premier-league" },
{ name: "La Liga", slug: "la-liga" },
{ name: "Serie A", slug: "serie-a" },
{ name: "Bundesliga", slug: "bundesliga" },
{ name: "Ligue 1", slug: "ligue-1" },
{ name: "Champions League", slug: "champions-league" },
];

const Navbar = () => {
const [menuOpen, setMenuOpen] = useState(false);
const [openDropdown, setOpenDropdown] = useState("");

const closeMenu = () => {
setMenuOpen(false);
setOpenDropdown("");
};

const toggleDropdown = (name) => {
setOpenDropdown((current) => (current === name ? "" : name));
};

return (
<header className="navbar">
<div className="navbar-container">
<Link href="/" className="navbar-logo" onClick={closeMenu}>
DRIBBLE<span>.</span>
</Link>

    <nav
      id="mobile-navigation"
      className={`navbar-links ${menuOpen ? "active" : ""}`}
    >
      <Link href="/" onClick={closeMenu}>Home</Link>
      <Link href="/news" onClick={closeMenu}>News</Link>
      <Link href="/transfers" onClick={closeMenu}>Transfers</Link>

      <div
        className={`navbar-dropdown ${
          openDropdown === "leagues" ? "dropdown-open" : ""
        }`}
      >
        <button
          className="navbar-dropdown-toggle"
          onClick={() => toggleDropdown("leagues")}
          aria-expanded={openDropdown === "leagues"}
        >
          Leagues
        </button>

        <div className="navbar-dropdown-menu">
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/${league.slug}`}
              onClick={closeMenu}
            >
              {league.name}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={`navbar-dropdown ${
          openDropdown === "fixtures" ? "dropdown-open" : ""
        }`}
      >
        <button
          className="navbar-dropdown-toggle"
          onClick={() => toggleDropdown("fixtures")}
          aria-expanded={openDropdown === "fixtures"}
        >
          Fixtures
        </button>

        <div className="navbar-dropdown-menu">
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/fixtures/${league.slug}`}
              onClick={closeMenu}
            >
              {league.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>

    <div className="navbar-right">
      <Link href="/fixtures" className="navbar-football" aria-label="Fixtures">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm0 3.1 2.4 1.75-.92 2.83h-2.96L9.6 6.35 12 4.6ZM4.65 9.1l3.02.98 1.07 3.3-2.57 1.87-2.58-1.88a8.1 8.1 0 0 1 1.06-4.27Zm4.1 9.52 1.15-3.52h4.2l1.15 3.52A8.05 8.05 0 0 1 8.75 18.62Zm10.7-5.25-2.58 1.88-2.57-1.87 1.07-3.3 3.02-.98a8.1 8.1 0 0 1 1.06 4.27ZM17.2 6.7l-2.04-.66-1.06-1.48a8.1 8.1 0 0 1 3.1 2.14ZM9.9 4.56 8.84 6.04 6.8 6.7a8.1 8.1 0 0 1 3.1-2.14Z" />
        </svg>
      </Link>

      <button
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </div>
</header>

);
};

export default Navbar;
