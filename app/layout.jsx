import '@/assets/styles/globals.css'

export const metadata = {
    title: 'Property App | Find the perfect rental',
    description: 'Find the perfect rental in a future rental',
    keywords: ['rental', 'find rentals', 'find property']
}

const MainLayout = ({children}) => {
    return (
        <html lang="en">
            <body>
                <div id="app">{children}</div>
            </body>
        </html>
    )
}

export default MainLayout;