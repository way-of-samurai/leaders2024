import { NextResponse } from "next/server"

export function middleware(request) {
  const url = request.nextUrl.clone()
  const requestHeaders = new Headers(request.headers)
  if (url.pathname.startsWith("/images/")) {
    url.protocol = "http"
    url.hostname = process.env.IMAGE_PROXY_HOST
    url.port = process.env.IMAGE_PROXY_PORT
    url.pathname = url.pathname.replace(/^\/images/, "/_/plain/s3://images")
    requestHeaders.set("host", process.env.IMAGE_PROXY_HOST)
  }

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  })
}

export const config = {
  matcher: "/images/:path*",
}
