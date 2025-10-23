import Shell from "@/components/layout/shell";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="vi">
      <body className={`antialiased`}>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
