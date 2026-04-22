'use server'

import { signIn,signOut } from "@/auth";




export async function doSignIn(formData){
    try{
        const response= await signIn('credentials',{
             email:formData.get('email'),
             password:formData.get('password'),
             redirect:false,  
        });
        return response;

    }catch(err){
        if(err.type === 'CredentialsSignin')
            return { error: "Email or Password incorrect" }
    }
}

export async function doSignUp(formData){
    

}

export async function doSignOut(){
    await signOut({redirectTo:'/'}); 
}