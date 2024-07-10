import "styles/globals.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="bg-red-800">{children}</main>
      </body>
    </html>
  );
}
