"use client";

import { Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoutConfirmModal } from "./LogoutConfirmModal";
import { NOTIFICATIONS, NotificationsPanel } from "./NotificationsPanel";
import { WAREHOUSE_PROFILE, ProfileModal } from "./ProfileModal";

type NavItem = { label: string; href: string | null };

const WAREHOUSE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/warehouse" },
  { label: "Orders", href: "/orders" },
  { label: "Inventory", href: "/inventory" },
  { label: "Reports", href: "/reports" },
];

function formatNotificationCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

export function DashboardNavbar() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationCount = notifications.filter(n => !n.read).length;
  const notificationsWrapperRef = useRef<HTMLDivElement>(null);

  function handleMarkAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!notificationsOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        notificationsWrapperRef.current &&
        !notificationsWrapperRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [notificationsOpen]);

  return (
    <header
      className={`sticky top-0 z-40 flex w-full items-center justify-between px-6 py-5 transition-all duration-300 sm:px-10 lg:px-16 ${
        scrolled
          ? "bg-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="flex items-center gap-4">
        <Link href="/warehouse" className="shrink-0">
          <Image
            src="/veda-bharat-logo.png"
            alt="Veda Bharath"
            width={121}
            height={58}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>
      </div>

      <nav className="hidden items-center gap-9 md:flex">
        {WAREHOUSE_NAV_ITEMS.map((item) => {
          const isActive = item.href !== null && pathname.startsWith(item.href);
          const textClassName = `cursor-pointer text-lg leading-[110%] transition-colors hover:text-[#F9A51A] ${
            isActive ? "font-medium text-[#F9A51A]" : "font-normal text-black"
          }`;

          const content = <span className={textClassName}>{item.label}</span>;

          if (item.href) {
            return (
              <Link key={item.label} href={item.href}>
                {content}
              </Link>
            );
          }

          return <span key={item.label}>{content}</span>;
        })}
      </nav>

      <div className="flex items-center gap-[13px]">
        <div className="relative" ref={notificationsWrapperRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center"
          >
            <Bell className="h-6 w-6 text-[#2C2C2C]" strokeWidth={1.5} />
            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#EF4646] px-0.5 text-[9px] font-bold leading-none text-white">
                {formatNotificationCount(notificationCount)}
              </span>
            )}
          </button>

          <NotificationsPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
          />
        </div>

        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          aria-label="View profile"
          className="flex h-[54.74px] w-[54.74px] cursor-pointer items-center justify-center rounded-full border-2 border-[#F5A623] bg-[#F9A51A]"
        >
          <span className="text-lg font-semibold text-white">{WAREHOUSE_PROFILE.initials}</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="md:hidden flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#2C2C2C] transition-colors hover:bg-[#EAEAEB]"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        variant="warehouse"
        onRequestLogout={() => {
          setProfileOpen(false);
          setLogoutConfirmOpen(true);
        }}
      />

      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
      />
    
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-6 sm:right-10 top-full mt-2 w-[220px] rounded-2xl bg-white p-5 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-4 md:hidden z-50 border border-[#F1F5F9]"
          >
            {WAREHOUSE_NAV_ITEMS.map((item) => {
              const isActive = item.href !== null && pathname.startsWith(item.href);
              const className = `cursor-pointer text-lg leading-[110%] transition-colors hover:text-[#F9A51A] ${isActive ? "font-medium text-[#F9A51A]" : "font-normal text-black"}`;
              if (item.href) {
                return (
                  <Link key={item.label} href={item.href} className={className} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <span key={item.label} className={className} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </span>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
