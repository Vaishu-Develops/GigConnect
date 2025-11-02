import React, { useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar';

export default function NavbarDemo() {
  const navItems = [
    {
      name: "Explore",
      link: "/explore",
    },
    {
      name: "Messages",
      link: "/messages",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Sign Up</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-slate-700 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Sign Up
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Demo Content */}
      <div className="container mx-auto p-8 pt-24">
        <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">
          GigConnect Resizable Navbar
        </h1>
        <p className="mb-10 text-center text-sm text-slate-500">
          This navbar adapts its size when scrolling and features beautiful emerald theming
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { id: 1, title: "Find", width: "md:col-span-1", height: "h-60" },
            { id: 2, title: "Talented", width: "md:col-span-2", height: "h-60" },
            { id: 3, title: "Local", width: "md:col-span-1", height: "h-60" },
            { id: 4, title: "Freelancers", width: "md:col-span-3", height: "h-60" },
            { id: 5, title: "Post", width: "md:col-span-1", height: "h-60" },
            { id: 6, title: "Your", width: "md:col-span-2", height: "h-60" },
            { id: 7, title: "Perfect", width: "md:col-span-2", height: "h-60" },
            { id: 8, title: "Gig", width: "md:col-span-1", height: "h-60" },
            { id: 9, title: "Today", width: "md:col-span-2", height: "h-60" },
            { id: 10, title: "GigConnect", width: "md:col-span-1", height: "h-60" },
          ].map((box) => (
            <div
              key={box.id}
              className={`${box.width} ${box.height} bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center rounded-lg p-4 shadow-sm border border-emerald-300/30`}
            >
              <h2 className="text-xl font-medium text-emerald-800">{box.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}