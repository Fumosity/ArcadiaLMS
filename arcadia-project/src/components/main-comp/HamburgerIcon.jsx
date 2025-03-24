const HamburgerIcon = ({ isOpen, toggle }) => {
  return (
    <button className={`hamburger-icon ${isOpen ? "open" : ""}`} onClick={toggle} aria-label="Toggle menu">
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  )
}

export default HamburgerIcon

