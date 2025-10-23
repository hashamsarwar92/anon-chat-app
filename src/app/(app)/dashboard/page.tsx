import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/models/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { set } from 'mongoose';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSwitchLoading, setIsSwitchLoading] = React.useState<boolean>(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((messages) => messages.filter((msg) => msg._id !== messageId));
  }


  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false);
    }catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log("Error fetching accept message", axiosError.response?.data.message);
    }finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);


  const fetchMessages = useCallback(async(refresh: boolean = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(true);
    try{
      const response = await axios.get<ApiResponse>('/api/get-messsages');
      setMessages(response.data.messages || []);
      if(refresh){
        console.log("Messages refreshed");
      }
    }catch(error){
      console.log("Error fetching messages", error);
      const axiosError = error as AxiosError<ApiResponse>
      console.log("Error fetching accept message", axiosError.response?.data.message);
    }finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(()=>{
    if(!session || !session.user){
      return;
    }
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async()=>{
    try{
      const reponse = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
    }catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error updating accept message", axiosError.response?.data.message);
    }
  }

  const {username} = session?.user as User;
  //TODO: do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    console.log("Profile URL copied to clipboard");
  }

  if(!session|| !session.user){
    return <div>Please sign in to view your dashboard</div>
  }  
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'> 
<h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
<div className='flex items-center'>

  <input
  type="text"
  value={profileUrl}
  disabled
  className='input input-bordered w-full p-2 mr-2'
  />
  <Button onClick={copyToClipboard}>Copy</Button>

</div>
      </div>

      <div className='mb-4'>
        <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span className='ml-2'>Accept Anonymous Messages: {acceptMessages ? 'On' : 'Off'}</span>
      </div>
      <Separator/>
      <Button
      className='mt-4'
      variant="outline"
      onClick={(e)=>{
        e.preventDefault();
        fetchMessages(true);
      }}>
        {isLoading ? (<Loader2 className='h-4 w-4 animate-spin' />) : <RefreshCcw className='h-4 w-4'/>}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index)=>(<MessageCard 
            // key={message._id} 
            key={typeof message._id === "string" ? message._id : index}
            message={message} onMessageDelete={handleDeleteMessage}/>))
        ):(<p>No messages found</p>)}

      </div>
    </div>
  )
}

export default Dashboard