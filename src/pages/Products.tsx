import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, SlidersHorizontal, Palette, Ruler, Package } from "lucide-react";

import ProductCatalog from "../components/ProductCatalog";
import { HeroButton } from "../components/ui/hero-button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const featureHighlights = [
  {
    icon: <SlidersHorizontal className="h-4 w-4 text-[#20B2AA]" />,
    title: "Filtres précis",
    description: "Affinez par style, budget et disponibilité en un clin d'œil."
  },
  {
    icon: <Palette className="h-4 w-4 text-[#20B2AA]" />,
    title: "Mix & Match",
    description: "Combinez les matières et finitions pour un rendu harmonieux."
  },
  {
    icon: <Ruler className="h-4 w-4 text-[#20B2AA]" />,
    title: "Dimensions claires",
    description: "Chaque fiche produit inclut les mesures essentielles et le poids."
  }
];

const curatedStyles = ["Moderne", "Scandinave", "Art déco", "Minimaliste", "Extérieur", "Luxueux"];
const overviewMetrics = [
  { label: "Pièces IA prêtes", value: "+160" },
  { label: "Styles disponibles", value: "18" },
  { label: "Combinaisons testées", value: "1.2K" }
];

const Products: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <div className="container mx-auto px-4 pb-20 pt-16">
        <section className="mb-16 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm text-[#475569] shadow-soft">
              <Sparkles className="h-4 w-4 text-[#20B2AA]" />
              Sélection premium mise à jour chaque semaine
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-[#0f172a] md:text-5xl">
                Composez un intérieur qui vous ressemble
              </h1>
              <p className="max-w-2xl text-[#475569]">
                Parcourez notre bibliothèque de mobilier et d'accessoires soigneusement sélectionnés pour s'adapter à vos plans, votre palette de couleurs et votre budget. Chaque produit est compatible avec notre workflow de génération IA.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <HeroButton
                size="lg"
                className="min-w-48 bg-gradient-warm text-white shadow-elegant"
                onClick={() => navigate("/style-quiz")}
              >
                Lancer le quiz style
              </HeroButton>
              <HeroButton
                variant="outline"
                size="lg"
                className="min-w-48 border-[#20B2AA] text-[#0f172a] hover:bg-[#20B2AA]/10"
                onClick={() => navigate("/measurements")}
              >
                Importer mes mesures
              </HeroButton>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {overviewMetrics.map((metric) => (
                <Card key={metric.label} className="border border-[#e2e8f0] bg-white shadow-soft">
                  <CardContent className="space-y-1 p-5">
                    <p className="text-sm text-[#64748b]">{metric.label}</p>
                    <p className="text-2xl font-semibold text-[#0f172a]">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {curatedStyles.map((style) => (
                <Badge key={style} variant="secondary" className="border border-[#cbd5f5] bg-[#f1f5f9] text-[#0f172a]">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
          <Card className="border border-[#e2e8f0] bg-white shadow-float">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">Panier instantané</p>
                  <p className="text-2xl font-semibold text-[#0f172a]">Créez votre sélection</p>
                </div>
                <Package className="h-6 w-6 text-[#20B2AA]" />
              </div>
              <p className="text-[#475569]">
                Ajoutez vos pièces préférées à votre moodboard Adariz et retrouvez-les dans vos scénarios IA. Les disponibilités sont mises à jour en temps réel.
              </p>
              <div className="space-y-3">
                {featureHighlights.map((feature) => (
                  <div key={feature.title} className="flex gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20B2AA]/10">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f172a]">{feature.title}</p>
                      <p className="text-sm text-[#64748b]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <ProductCatalog userStyle="modern" className="w-full" />
        </section>
      </div>
    </div>
  );
};

export default Products;
