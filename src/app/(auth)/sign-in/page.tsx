"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { TypeOf } from "zod/v3";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
    })
    if(result?.error){
        console.log("Error signing in", result.error);
    }
    if(result?.url){
        router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in to Anon Message
          </h1>
          <p className="mb-4">Sign in to the anonymous chat web application</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            

             <FormField
              name="identifier"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel >Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel >Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
























// "use client"







// import {useSession, signIn, signOut} from "next-auth/react"

// export default function Component (){
//     const {data: session} = useSession();
//     if(session){
//         return(<>
//         Signed in as {session.user?.email} <br/>
//         <button onClick={() => signOut()}>Sign out</button>
//         </>)
//     }
//     return(<>
//         Signed not <br/>
//         <button className="bg-orange-500 px-3 py-2 m-4 rounded" onClick={() => signIn()}>Sign In</button>
//         </>)
// }