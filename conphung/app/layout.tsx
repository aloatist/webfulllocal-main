import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Main } from "@/components/craft";
import StickyNotification from '@/components/StickyNotification';
import { mainMenu } from "@/menu.config";
import { Section, Container } from "@/components/craft";
import StickyNotificationbutom from '@/components/StickyNotificationbutom';
import Logo from "@/public/logo.webp";
import { Chatbot } from '@/components/Chatbot';
import HideOnAdmin from '@/components/HideOnAdmin';
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { teamMembers } from '../components/teamMembers';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SessionProviderWrapper } from "@/components/providers/session-provider";
import { getDefaultMenuItems } from "@/lib/navigation/server";
import type { NavigationMenuItem } from "@/lib/navigation/types";
import { PWARegister } from "@/components/pwa/pwa-register";
import { MobileBottomNav } from "@/components/mobile/bottom-nav";
import { DefaultChatProvider } from "@/components/chat/chat-provider";
import { FooterWrapper } from "@/components/footer/footer-wrapper";




const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
	title: "KHU DU LỊCH CỒN PHỤNG CHÍNH CHỦ | QUẢN LÝ TRỰC TIẾP CÔNG TRÌNH KIẾN TRÚC ĐẠO DỪA",
	description:
		"Nhiều công ty trung gian cung cấp dịch vụ đi Cồn Phụng. Vậy đâu là chính chủ? Tìm hiểu ngay thương hiệu, hotline, logo chính chủ để tránh nhầm lẫn!",
	metadataBase: new URL("https://conphungtourist.com"),
	alternates: {
	canonical: "https://conphungtourist.com",
	languages: {
	"vi-VN": "/",
	},
	},
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cồn Phụng",
  },
  applicationName: "Cồn Phụng",
	openGraph: {
		title: "ĐẶT TOUR NGAY CHO DU LỊCH CỒN PHỤNG BẾN TRE – NHẬN ƯU ĐÃI CỰC SỐC",
		description: "Nhiều công ty trung gian cung cấp dịch vụ đi Cồn Phụng. Vậy đâu là chính chủ? Tìm hiểu ngay thương hiệu, hotline, logo chính chủ để tránh nhầm lẫn!",
		url: "https://conphungtourist.com",
		type: "website",
		locale: "vi_VN",
		siteName: "Khu du lịch Cồn Phụng Bến Tre",
		images: [
			{
				url: "https://conphungtourist.com/wp-content/uploads/2024/10/bener-nho.jpg",
				alt: "Bạn muốn khám phá Khu Du Lịch Cồn Phụng và Công Trình Kiến Trúc Đạo Dừa? Trải nghiệm thiên nhiên và văn hóa độc đáo của miền Tây cùng những gói tour ưu đãi và thực đơn hấp dẫn chỉ có tại trang web chính thức của Khu du lịch Cồn Phụng chúng tôi!",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Khu du lịch Cồn Phụng chính chủ",
		description:
			"Đặt tour chính chủ tại KDL Cồn Phụng, ưu đãi hấp dẫn cho gia đình và doanh nghiệp cùng trải nghiệm văn hoá Đạo Dừa độc đáo.",
		images: ["https://conphungtourist.com/wp-content/uploads/2024/10/bener-nho.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
			"max-video-preview": -1,
		},
	},
};




// Revalidate content every hour
export const revalidate = 3600;

const fallbackMenuItems: NavigationMenuItem[] = Object.entries(mainMenu).map(
  ([label, href], order) => ({
    id: `static-${order}`,
    label: label.charAt(0).toUpperCase() + label.slice(1),
    href,
    icon: null,
    target: null,
    order,
    isActive: true,
    roles: [],
    parentId: null,
    children: [],
  })
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dynamicItems = await getDefaultMenuItems();
  const navigationItems = dynamicItems && dynamicItems.length > 0 ? dynamicItems : fallbackMenuItems;

  return (
    <html lang="vi" suppressHydrationWarning>
      <head />
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HideOnAdmin>
              <Nav items={navigationItems} />
              <StickyNotification />
            </HideOnAdmin>
            <Main className="pb-20 md:pb-0">{children}</Main>
            <HideOnAdmin>
              <FooterWrapper />
              <StickyNotification/>
              <StickyNotificationbutom/>
              <Chatbot/>
              <PWARegister />
              <MobileBottomNav />
              <DefaultChatProvider />
            </HideOnAdmin>

         </ThemeProvider>
        </SessionProviderWrapper>
        
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        /> 
      </body>
    </html>
  );
}

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  items: NavigationMenuItem[];
}

const Nav = ({ className, children, id, items }: NavProps) => {
  return (
    <nav
    className={cn(
      "sticky z-50 top-0 bg-background",
      "border-b",
      "fade-in",
      className,
    )}
    id={id}
  >
    <div
      id="nav-container"
      className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
    >
      <ThemeToggle />

      <Link
        className="hover:opacity-75 transition-all flex gap-2 items-center"
        href="/"
      >

        <span  className="sr-only">Du Lịch Cồn Phụng Bến Tre</span>
        <Image
          src={Logo}
          alt=" Logo du lịch Cồn Phụng Bến Tre"
          className="dark:note rounded-md"
          width={140}
          height={40}
        />
      </Link>
      {children}
      <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {items.map((item) => (
              <Button key={item.id} asChild variant="ghost" size="sm">
                <Link href={item.href} target={item.target ?? undefined}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        <Link className="mx-2 hidden md:flex" href={"https://cocoisland.vn"}>
     Đặt phòng Coco Island
     </Link>
 
        <Button asChild className="hidden sm:flex">
          <Link href="tel:+84917645039">Đặt tour ngay</Link>
        </Button>
    
        <MobileNav items={items} />
       
      </div>
    </div>
  </nav>
  
    
  );
};

// Old Footer component removed - now using ModernFooter
