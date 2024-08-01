// services/server/server.js
'use server'

import { NextRequest } from "next/server"
import { headers } from "next/headers"

export async function getPathFromReferer() {
    try {
    const headersList = headers()
    const referer = headersList.get("referer")
    if (!referer) return null;
    let pathname;
    if (referer) {
      const request = new NextRequest(referer)
      pathname = request.nextUrl.pathname
    }  
    return pathname;
    } catch (e) {
      console.error('Invalid referer URL:', e);
      return null;
    }
  }
  