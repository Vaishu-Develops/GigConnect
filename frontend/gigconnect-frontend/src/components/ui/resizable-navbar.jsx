"use client";
import { cn } from "../../lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import React, { useRef, useState } from "react";

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(16, 185, 129, 0.15), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1), 0 0 4px rgba(16, 185, 129, 0.08), 0 16px 68px rgba(5, 150, 105, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "70%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "900px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-6 py-3 lg:flex",
        visible && "bg-white/90 backdrop-blur-md border border-emerald-100/50",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.props && child.props.items
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, visible }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-1 lg:space-x-2 font-medium text-slate-700 transition duration-200 hover:text-emerald-700 lg:flex whitespace-nowrap",
        visible ? "text-xs" : "text-sm",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative py-2 text-slate-700 hover:text-emerald-700 transition-colors duration-200 whitespace-nowrap",
            visible ? "px-1" : "px-1 lg:px-3"
          )}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-emerald-50/80"
            />
          )}
          <span className="relative z-20 font-medium">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(16, 185, 129, 0.15), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1), 0 0 4px rgba(16, 185, 129, 0.08), 0 16px 68px rgba(5, 150, 105, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "95%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "12px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden",
        visible && "bg-white/90 backdrop-blur-md border border-emerald-100/50",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn("flex w-full flex-row items-center justify-between", className)}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-xl bg-white/95 backdrop-blur-md px-6 py-8 shadow-xl border border-emerald-100/50",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
    >
      {isOpen ? (
        <IconX className="w-6 h-6 text-slate-700" />
      ) : (
        <IconMenu2 className="w-6 h-6 text-slate-700" />
      )}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">G</span>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
        GigConnect
      </span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700",
    secondary: 
      "bg-transparent text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80",
    dark: 
      "bg-slate-900 text-white shadow-lg hover:bg-slate-800",
    gradient:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};