"use client"

import { AvatarIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginButton({ userData, lang }: {
  userData: any
  lang: string
}) {
  console.log("userData props = ", userData);
  const user = userData && userData.user;
  return (
    <>
      {
        !user && (
          <Link href={`/${lang ? 'zh' : lang}/login`}>
            <Button variant={"ghost"}>登录 / 注册</Button>
          </Link>
        )
      }
      {user && (
        <div className="flex flex-row gap-4 text-center align-middle justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              {(user.user_metadata &&
                user.user_metadata.avatar_url && (
                  // <Image
                  //   height={24}
                  //   width={24}
                  //   src={userData.user.user.user_metadata.avatar_url}
                  //   alt="avatar"
                  // />
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                )) || (
                <AvatarIcon height={24} width={24} className="text-primary" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="text-primary text-center overflow-hidden text-ellipsis">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action="/auth/sign-out" method="post">
                <Button
                  type="submit"
                  className="w-full text-left"
                  variant={"ghost"}
                >
                  登出
                </Button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}

