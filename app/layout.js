import './globals.css'

export const metadata = {
  title: 'CHIVITO AI - AI Agent Empire',
  description: 'Build your AI agent empire with CHIVITO AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
