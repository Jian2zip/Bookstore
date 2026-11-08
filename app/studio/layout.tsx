/** The Studio takes over the whole viewport; none of the site chrome applies. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 bg-white text-black">{children}</div>;
}
