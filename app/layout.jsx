import '@/assets/styles/globals.css'
import 'photoswipe/dist/photoswipe.css'
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';

import {GlobalProvider} from "@/context/GobalContext";

export const metadata = {
    title: 'Property App | Find the perfect rental',
    description: 'Find the perfect rental in a future rental',
    keywords: ['rental', 'find rentals', 'find property']
}

const MainLayout = ({children}) => {
    return (
        <GlobalProvider>
            <AuthProvider>
                    <html lang="en">
                        <body>
                                <NavBar />
                                <div id="app">{children}</div>
                                <Footer />
                                <ToastContainer />
                        </body>
                    </html>
            </AuthProvider>
        </GlobalProvider>
    )
}

export default MainLayout;