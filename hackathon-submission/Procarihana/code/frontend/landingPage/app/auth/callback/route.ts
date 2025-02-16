import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { isAuthApiError } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const isLocalEnv = process.env.NODE_ENV === 'development'
    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const supabase = await createClient()
    // const supabase = createRouteHandlerClient<Database>({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("[login] [session] [500] Error exchanging code for session: ", error)
    }
    // if (!error) {
    //   if (isLocalEnv) {
    //     // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    //     return NextResponse.redirect(`${origin}${next}`)
    //   } else if (forwardedHost) {
    //     return NextResponse.redirect(`https://${forwardedHost}${next}`)
    //   } else {
    //     return NextResponse.redirect(`${origin}${next}`)
    //   }
    // }

    try {
      // ater exchanging the code, we should check if the user has a feature-flag row and a credits now, if not, we should create one

      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log("callback user", user);

      if (userError || !user) {
        console.error(
          "[login] [session] [500] Error getting user: ",
          userError
        );
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (error) {
      if (isAuthApiError(error)) {
        console.error(
          "[login] [session] [500] Error exchanging code for session: ",
          error
        );
        return NextResponse.redirect(
          `${origin}/login/failed?err=AuthApiError`
        );
      } else {
        console.error("[login] [session] [500] Something wrong: ", error);
        return NextResponse.redirect(
          `${origin}/login/failed?err=500`
        );
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}