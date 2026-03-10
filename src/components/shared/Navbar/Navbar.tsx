"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Container from "../Container/Container";
import { getImageUrl } from "@/utils/baseUrl";
import Avatar from '@mui/material/Avatar';
import getStringToAvater from "@/utils/getStringToAvater";
import Cookies from "js-cookie";

import { toast } from "sonner";
import useSocket from "@/hooks/useSocket";


export function Navbar({ profile }: { profile?: any }) {

  const pathname = usePathname();
  const router = useRouter()
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
  ];

    const socket = useSocket();

  // ✅ FIX 2: Proper socket listener with cleanup
  useEffect(() => {
    if (!profile?._id || !socket) return;

    console.log("socket conneted", socket);
    

    const eventName = `notification::${profile?._id}`;

        const handleNewMessage = async () => {
      toast.success("Socket connnected")
    }
 
    socket.on(eventName, handleNewMessage);
    return () => {
      socket.off(eventName, handleNewMessage);
    }
  }, [profile?._id, socket])

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router?.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-primary/10">
      <Container>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3`}>
            <Link href="/user-dashboard">
              <Image
                height={150}
                width={150}
                src="/logo.png"
                alt="Investors Hub"
                className="h-20 object-cover overflow-visible"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors ${pathname === link.path
                  ? "text-primary"
                  : "text-gray-300 hover:text-primary"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {profile ?
              <>
                {profile?.image ? <Link href="user-dashboard"><Image height={100} width={100} className="h-12 w-12 rounded-full border-2 border-gray-400/30" src={getImageUrl() + profile?.image} alt="Profile" /></Link>
                  : <Link href="user-dashboard"><Avatar  {...getStringToAvater(profile?.name, { height: 50, width: 50 })} /> </Link>
                }
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleLogout()}
                  className="text-primary! bg-black! cursor-pointer"
                >
                  Logout
                </Button>

              </> :
              <>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="link"
                    className="text-white cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  {" "}
                  <Button>Get Started</Button>
                </Link>
              </>
            }
          </div>
        </div>
      </Container>
    </nav>
  );
}
