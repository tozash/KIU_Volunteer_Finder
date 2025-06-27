const Footer = () => (
  <footer className="fixed bottom-0 left-0 w-full bg-neutralLight border-t border-grayBorder p-4 text-center">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p>KaiKaci © 2025</p>
      <nav className="flex gap-6 underline-offset-4">
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Contact
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
      </nav>
    </div>
  </footer>
)

export default Footer
