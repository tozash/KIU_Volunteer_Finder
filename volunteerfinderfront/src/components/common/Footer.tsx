const Footer = () => (
  <footer className="border-t bg-neutralLight">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-6 px-4">
      <p className="text-center sm:text-left">KaiKaci © 2025</p>
      <nav className="flex gap-6 underline-offset-4">
        <a href="#" className="hover:underline hover:text-accent">
          About
        </a>
        <a href="#" className="hover:underline hover:text-accent">
          Contact
        </a>
        <a href="#" className="hover:underline hover:text-accent">
          Privacy
        </a>
      </nav>
    </div>
  </footer>
)

export default Footer
