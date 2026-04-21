const users=[
    {
        email:'najjarmalek3@gmail.com',
        password:"aaaaaaaaaa"
    },
    {
        email:'imenomri@gmail.com',
        password:'imen123'
    }


]
export const getuserByEmail=email =>{
    const found =users.find(user=>user.email===email);
    return found;
}