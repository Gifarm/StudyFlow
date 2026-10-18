import { howItWorks } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-main mb-12">
          Cara Kerja
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="text-center p-6 space-y-4">
              <div className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-text-main">{item.title}</h3>
              <p className="text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
