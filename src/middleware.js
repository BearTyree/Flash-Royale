import { NextResponse } from "next/server";
import { authenticated } from "@/controllers/auth.js";

const protectedRoutes = ["/menu"];
const authRoutes = ["/login", "/signup"]

export async function middleware(req) {
  if (!protectedRoutes.includes(req.nextUrl.pathname) && !authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const isAuth = await authenticated(req);

  if((!isAuth && authRoutes.includes(req.nextUrl.pathname)) || (isAuth && !authRoutes.includes(req.nextUrl.pathname))){
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}
