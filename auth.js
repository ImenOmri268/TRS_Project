    import NextAuth from "next-auth"
    import Credentials from "next-auth/providers/credentials"
    import { getuserByEmail } from "./data/users";

    export const {
        handlers: {GET,POST},
        auth,
        signIn,
        signUp,
        signOut,
    }= NextAuth({
        session:{
                strategy:'jwt',
        },
        providers:[
            Credentials({
                    async authorize(credentials){
                        if(credentials===null) return null;
                        
                            const user =getuserByEmail(credentials?.email);
                            if(user){
                                const ismatch= credentials?.password ===user?.password;
                                if(ismatch)
                                    return user;
  
                             }
                    }
            })
        ]
    })
