export const metadata = {
  title: 'ShopAltText',
  description: 'AI-powered alt-text generation for Shopify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
