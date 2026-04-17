import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/collection",
  "/search",
  "/upcoming",
  "/series",
  "/profile",
];

const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/signup"];
const ADMIN_USER_IDS: string[] = []; // Add your Supabase user ID here

export async function proxy(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(user ? "/dashboard" : "/login", request.url)
      );
    }

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    if (isProtected && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
    if (isAdmin && (!user || !ADMIN_USER_IDS.includes(user.id))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (AUTH_ROUTES.includes(pathname) && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
