import '@/assets/styles/globals.css'
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
    title: 'Property App | Find the perfect rental',
    description: 'Find the perfect rental in a future rental',
    keywords: ['rental', 'find rentals', 'find property']
}

const MainLayout = ({children}) => {
    return (
            <html lang="en">
                <body>
                    <AuthProvider>
                        <NavBar />
                        <div id="app">{children}</div>
                        <Footer />
                    </AuthProvider>
                </body>
            </html>
    )
}

export default MainLayout;