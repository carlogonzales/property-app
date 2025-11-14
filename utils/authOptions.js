import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectToDatabase from "@/config/database";

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
          }
        }
      })
    ],
    callbacks: {
        async signIn({profile}) {
            await connectToDatabase();
            const userExists = await User.findOne({email: profile.email});

            if(!userExists) {
                const username = profile.name.slice(0, 20);
                await User.create({
                    username,
                    email: profile.email,
                    image: profile.picture
                });
            }
            return true;
        },
        async session({session, token}) {
            const user = await User.findOne({email: session.user.email});

            session.user.id = user._id.toString();
            return session;
        }
    }
};