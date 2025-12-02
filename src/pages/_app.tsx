import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import { SectionProvider } from "@/context/SectionContext";
import { RatingsProvider } from "@/lib/contexts/RatingsContext";
import { AuthProvider } from "@/context/AuthContext";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noLayoutRoutes = ["/login", "/admin"];
  const hideNavbar = noLayoutRoutes.includes(router.pathname);

  return (
    <div className={`${poppins.variable} font-sans`}>
      <AuthProvider>
        <SectionProvider>
          <RatingsProvider>
            <Layout hideNavbar={hideNavbar}>
              <Component {...pageProps} />
            </Layout>
          </RatingsProvider>
        </SectionProvider>
      </AuthProvider>
    </div>
  );
}
