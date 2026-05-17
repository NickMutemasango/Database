import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth) {
    const [type, encoded] = auth.split(" ");
    if (type === "Basic" && encoded) {
      const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
      const validUser = process.env.ADMIN_USERNAME ?? "admin";
      const validPass = process.env.ADMIN_PASSWORD ?? "church2024";
      if (user === validUser && pass === validPass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse(null, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Church Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
