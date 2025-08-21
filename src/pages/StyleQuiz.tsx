import { useState } from "react";
import { Palette, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { HeroButton } from "../components/ui/hero-button";

const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: "style",
      title: "Quel style vous inspire le plus ?",
      options: [
        { value: "moderne", label: "Moderne", description: "Lignes épurées, couleurs neutres" },
        { value: "boheme", label: "Bohème", description: "Couleurs chaudes, textures naturelles" },
        { value: "classique", label: "Classique", description: "Élégance intemporelle, matériaux nobles" },
        { value: "industriel", label: "Industriel", description: "Métal, brique, style loft" },
        { value: "scandinave", label: "Scandinave", description: "Minimalisme, bois clair, cosy" }
      ]
    },
    {
      id: "colors",
      title: "Quelles couleurs préférez-vous ?",
      options: [
        { value: "neutres", label: "Neutres", description: "Blanc, beige, gris" },
        { value: "chaudes", label: "Chaudes", description: "Terracotta, ocre, orange" },
        { value: "froides", label: "Froides", description: "Bleu, vert, violet" },
        { value: "terre", label: "Tons de terre", description: "Marron, kaki, sable" },
        { value: "vives", label: "Couleurs vives", description: "Rouge, jaune, fuchsia" }
      ]
    },
    {
      id: "materials",
      title: "Quels matériaux vous attirent ?",
      options: [
        { value: "bois", label: "Bois", description: "Chaleureux et naturel" },
        { value: "metal", label: "Métal", description: "Moderne et industriel" },
        { value: "tissu", label: "Tissus", description: "Doux et confortable" },
        { value: "pierre", label: "Pierre", description: "Authentique et robuste" },
        { value: "verre", label: "Verre", description: "Léger et transparent" }
      ]
    },
    {
      id: "ambiance",
      title: "Quelle ambiance recherchez-vous ?",
      options: [
        { value: "cosy", label: "Cosy", description: "Chaleureux et accueillant" },
        { value: "dynamique", label: "Dynamique", description: "Énergisant et stimulant" },
        { value: "zen", label: "Zen", description: "Calme et reposant" },
        { value: "sophistique", label: "Sophistiqué", description: "Élégant et raffiné" },
        { value: "creative", label: "Créatif", description: "Original et artistique" }
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Traitement final et redirection vers génération
      generatePrompt();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const generatePrompt = () => {
    // Génération du prompt pour l'IA basé sur les réponses
    const prompt = `Design d'intérieur ${answers.style} avec une palette de couleurs ${answers.colors}, 
                   utilisant principalement ${answers.materials} pour créer une ambiance ${answers.ambiance}. 
                   Style architectural moderne, éclairage naturel, rendu photoréaliste 4K.`;
    
    console.log("Prompt généré:", prompt);
    console.log("Réponses complètes:", answers);
    
    // Ici on redirigerait vers la page de génération
  };

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.id];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Quiz de style
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Aidez-nous à comprendre vos préférences pour un design sur-mesure
            </p>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Question {currentQuestion + 1} sur {questions.length}
            </p>
          </div>

          {/* Question */}
          <Card className="shadow-elegant bg-gradient-card border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {currentQuestionData.title}
              </CardTitle>
              <CardDescription>
                Choisissez l'option qui vous correspond le mieux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
                <div className="space-y-4">
                  {currentQuestionData.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label 
                        htmlFor={option.value} 
                        className="flex-1 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <HeroButton
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="min-w-32"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </HeroButton>

            <HeroButton
              onClick={handleNext}
              disabled={!currentAnswer}
              className="min-w-32"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </HeroButton>
          </div>

          {/* Steps */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  ✓
                </div>
                <span>Mesures</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  2
                </div>
                <span className="font-medium text-foreground">Quiz de style</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs">
                  3
                </div>
                <span>Génération</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleQuiz;