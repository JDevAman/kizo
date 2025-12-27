interface FooterLink {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface FooterContentProps {
  links?: FooterLink[];
}

export function FooterContent({ links = [] }: FooterContentProps) {
  return (
    <footer className="border-t border-slate-800 bg-black px-6 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Kizo</h3>
          <p className="text-sm">
            Secure, fast, and modern financial infrastructure.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            {links.map((link, i) => (
              <li key={i}>
                {link.onClick ? (
                  <div onClick={link.onClick} className="hover:text-white">
                    {link.label}
                  </div>
                ) : (
                  <a href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm">
            © {new Date().getFullYear()} Kizo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
