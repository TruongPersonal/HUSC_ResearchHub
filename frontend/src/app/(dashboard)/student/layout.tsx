import Footer from "@/components/layout/footer";
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
        <Footer />
      </body>
    </html>
  );
}
