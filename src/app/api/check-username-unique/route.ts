import dbClient from '@/lib/dbConnect';
import UserModel from '@/models/User';
import {success, z} from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import dbConnect from '@/lib/dbConnect';
import { ca } from 'zod/locales';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    //TODO: use this in all routes but in latest nextjs version no need of this
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success: false,
    //         message: 'Method not allowed. Only GET requests are allowed.',
    //     }, {status: 405});
    // }
    await dbConnect();

    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username'),
            
        }
        const reuslt = UsernameQuerySchema.safeParse(queryParam);
        console.log('Parsed result:', reuslt);
        if(!reuslt.success){
            const usernameErrors = reuslt.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length>0?usernameErrors.join(', '):'Invalid username.',
                errors: usernameErrors,
            }, {status: 400});
        }
        const {username} = reuslt.data;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already taken.',
            }, {status: 400});
        }

         return Response.json({
                success: true,
                message: 'Username is available.',
            }, {status: 200});

    }catch(error){
        console.error('Error checking username uniqueness:', error);
        return Response.json({
            success: false,
            message: 'Internal server error while checking username uniqueness.',
        }, {status: 500});
    }
}