"use client";

import { useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          DRIBBLE<span>.</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link id="center" href="/" onClick={closeMenu}>Home</Link>
          <Link id="center" href="/news" onClick={closeMenu}>News</Link>
          <Link id="center" href="/transfers" onClick={closeMenu}>Transfers</Link>
          <Link id="center" href="/premier-league" onClick={closeMenu}>Premier League</Link>
          <Link id="center" href="/fixtures" onClick={closeMenu}>Fixtures</Link>
        </nav>

        <div className="navbar-right">
          <Link href="/search" className="navbar-search" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
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

