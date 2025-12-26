const Navbar = () => {
  return (
    <nav className="navbar border-b border-base-content/20 mb-4 flex justify-center mx-0 px-0">
      <div className="w-2/4 flex items-center justify-center">
        {/* Left side */}
        <div className="flex-1">
          <p className="text-xl">Layera</p>
        </div>

        {/* Right side */}
        <ul className="menu menu-horizontal gap-4">
          <li>
            <a>Find your scent</a>
          </li>
          <li>
            <a>Collection</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
