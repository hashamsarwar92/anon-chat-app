"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SuggestedMessages = [
  "You're doing great, keep it up!",
  "Believe in yourself and all that you are.",
  "Your potential is limitless.",
];

const UserPublicPage = () => {
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(SuggestedMessages);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    // Simulate an API call
    console.log("Message submitted to user", params.username, ":", data.content);
    try{
        const response = await axios.post("/api/send-message", {
  username: params.username,
  content: data.content,
});
    console.log("Response from server:", response.data);
    }catch(err){
      console.log("Error sending message:", err);
    }finally{
      setIsSubmitting(false);
    }
  };

  const onSuggestedBtnClick = async() => {
    setIsSuggestedLoading(true);
    try{
        const response = await axios.post(`/api/suggest-messages`);
        console.log("Suggested messages fetched:", response.data);
        const messagesString: string = response.data.text;
        const messagesArray = messagesString.split("||").map((msg) => msg.trim());
        setSuggestedMessages(messagesArray);
    }catch(err){
      console.log("Error selecting suggested message:", err);
    }finally{
      setIsSuggestedLoading(false);
    }
  }

  const onSelectMsg = (msg: string) => {
    form.setValue("content", msg);
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Public Profile Page
      </h1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here..." {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait...</> : ("Send Message")
              }
            </Button>
        </form>
      </Form>

      <div className="mt-12 text-sm text-gray-500">
        <Button disabled={isSuggestedLoading} onClick={onSuggestedBtnClick}>Suggest Messages</Button>
        <p className="text-sm text-gray-600 mb-2 mt-8">Click on any message to send it.</p>
        <div className="space-y-2">
            <h1 className="text-lg font-bold mb-4 text-black">Suggested Messages:</h1>
            <div className="flex flex-col gap-2">
                {suggestedMessages.map((msg, index) => (
                    <Button key={index} variant="outline" className="text-left" onClick={()=>{onSelectMsg(msg)}}>
                        {msg}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserPublicPage;
