import { CheckSquare, CalendarDays, NotebookPen, TrendingUp } from "lucide-react";
import { features } from "@/lib/constants";
import { Card } from "@/components/ui/card";

const iconMap: Record<string, React.ElementType> = {
  CheckSquare,
  CalendarDays,
  NotebookPen,
  TrendingUp,
};

export function Features() {
  return (
    <section id="fitur" className="container mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
        Fitur Utama
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <Card
              key={feature.title}
              className="p-6 bg-card border-border rounded-2xl hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="size-12 bg-secondary flex items-center justify-center rounded-xl mb-4">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
