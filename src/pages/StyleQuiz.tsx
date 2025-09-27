import { useState, useEffect } from "react";
import { Palette, ArrowRight, ArrowLeft, CheckCircle, Save, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { HeroButton } from "../components/ui/hero-button";
import { Badge } from "../components/ui/badge";

interface QuizOption {
  value: string;
  label: string;
  description: string;
  color?: string;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
  category: string;
}

const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animationClass, setAnimationClass] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [styleProfile, setStyleProfile] = useState<any>(null);
  const navigate = useNavigate();

  const questions: Question[] = [
    {
      id: "lifestyle",
      title: "Comment décririez-vous votre mode de vie ?",
      subtitle: "Votre style de vie influence vos choix décoratifs",
      category: "Personnalité",
      options: [
        { value: "actif", label: "Actif et social", description: "J'aime recevoir et avoir une maison vivante", color: "bg-orange-100 text-orange-800" },
        { value: "tranquille", label: "Calme et reposant", description: "Je privilégie la détente et la sérénité", color: "bg-blue-100 text-blue-800" },
        { value: "creatif", label: "Créatif et artistique", description: "J'aime exprimer ma créativité dans mon intérieur", color: "bg-purple-100 text-purple-800" },
        { value: "pratique", label: "Pratique et fonctionnel", description: "Je privilégie l'efficacité et l'organisation", color: "bg-green-100 text-green-800" },
        { value: "luxueux", label: "Raffiné et élégant", description: "J'apprécie le luxe et les beaux matériaux", color: "bg-yellow-100 text-yellow-800" }
      ]
    },
    {
      id: "style",
      title: "Quel style vous inspire le plus ?",
      subtitle: "Choisissez le style qui résonne avec votre personnalité",
      category: "Style",
      options: [
        { value: "moderne", label: "Moderne", description: "Lignes épurées, couleurs neutres, design contemporain", color: "bg-gray-100 text-gray-800" },
        { value: "boheme", label: "Bohème", description: "Couleurs chaudes, textures naturelles, esprit libre", color: "bg-amber-100 text-amber-800" },
        { value: "classique", label: "Classique", description: "Élégance intemporelle, matériaux nobles", color: "bg-blue-100 text-blue-800" },
        { value: "industriel", label: "Industriel", description: "Métal, brique, style loft urbain", color: "bg-slate-100 text-slate-800" },
  { value: "scandinave", label: "Scandinave", description: "Minimalisme, bois clair, hygge", color: "bg-[#E6FAF7] text-[#0f766e]" }
      ]
    },
    {
      id: "colors",
      title: "Quelles couleurs vous attirent le plus ?",
      subtitle: "Les couleurs reflètent votre humeur et votre énergie",
      category: "Couleurs",
      options: [
        { value: "neutres", label: "Neutres apaisantes", description: "Blanc, beige, gris doux", color: "bg-gray-100 text-gray-800" },
        { value: "chaudes", label: "Chaudes et accueillantes", description: "Terracotta, ocre, orange", color: "bg-orange-100 text-orange-800" },
        { value: "froides", label: "Froides et sereines", description: "Bleu, vert, violet", color: "bg-blue-100 text-blue-800" },
        { value: "terre", label: "Tons de terre", description: "Marron, kaki, sable naturel", color: "bg-amber-100 text-amber-800" },
        { value: "vives", label: "Couleurs vives", description: "Rouge, jaune, fuchsia énergisant", color: "bg-red-100 text-red-800" }
      ]
    },
    {
      id: "materials",
      title: "Quels matériaux vous inspirent ?",
      subtitle: "Les matériaux apportent caractère et authenticité",
      category: "Matériaux",
      options: [
        { value: "bois", label: "Bois naturel", description: "Chaleureux, authentique et durable", color: "bg-amber-100 text-amber-800" },
        { value: "metal", label: "Métal contemporain", description: "Moderne, industriel et sophistiqué", color: "bg-slate-100 text-slate-800" },
        { value: "tissu", label: "Tissus doux", description: "Confortable, chaleureux et cosy", color: "bg-pink-100 text-pink-800" },
        { value: "pierre", label: "Pierre naturelle", description: "Authentique, robuste et intemporel", color: "bg-stone-100 text-stone-800" },
        { value: "verre", label: "Verre et transparence", description: "Léger, lumineux et moderne", color: "bg-cyan-100 text-cyan-800" }
      ]
    },
    {
      id: "ambiance",
      title: "Quelle ambiance recherchez-vous ?",
      subtitle: "L'ambiance définit l'âme de votre intérieur",
      category: "Ambiance",
      options: [
        { value: "cosy", label: "Cosy et chaleureux", description: "Un cocon douillet pour se ressourcer", color: "bg-orange-100 text-orange-800" },
        { value: "dynamique", label: "Dynamique et énergisant", description: "Un espace qui stimule et motive", color: "bg-yellow-100 text-yellow-800" },
        { value: "zen", label: "Zen et apaisant", description: "Un havre de paix pour méditer", color: "bg-green-100 text-green-800" },
        { value: "sophistique", label: "Sophistiqué et raffiné", description: "Élégance et distinction", color: "bg-purple-100 text-purple-800" },
        { value: "creative", label: "Créatif et inspirant", description: "Un espace qui stimule l'imagination", color: "bg-pink-100 text-pink-800" }
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    setAnimationClass('animate-in slide-in-from-right-8 duration-300');
    const timer = setTimeout(() => setAnimationClass(''), 300);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

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
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    // Créer un profil de style complet et indépendant
    const profile = {
      lifestyle: answers.lifestyle,
      style: answers.style,
      colors: answers.colors,
      materials: answers.materials,
      ambiance: answers.ambiance,
      
      // Génération d'une description de style personnalisée
      styleDescription: generateStyleDescription(),
      
      completedAt: new Date().toISOString(),
      score: Object.keys(answers).length / questions.length * 100
    };
    
    // Sauvegarder le profil
    localStorage.setItem('adariz_style_profile', JSON.stringify(profile));
    setStyleProfile(profile);
    setIsCompleted(true);
  };

  const generateStyleDescription = () => {
    const styleMap: Record<string, string> = {
      moderne: "Vous privilégiez les lignes épurées et le design contemporain",
      boheme: "Vous êtes attiré par l'esprit libre et les textures naturelles",
      classique: "Vous appréciez l'élégance intemporelle et les matériaux nobles",
      industriel: "Vous aimez le style urbain avec métal et brique",
      scandinave: "Vous préférez le minimalisme et l'hygge nordique"
    };

    const colorMap: Record<string, string> = {
      neutres: "avec une palette de couleurs apaisantes",
      chaudes: "dans des tons chaleureux et accueillants",
      froides: "avec des couleurs froides et sereines",
      terre: "en privilégiant les tons naturels de terre",
      vives: "avec des couleurs vives et énergisantes"
    };

    const ambianceMap: Record<string, string> = {
      cosy: "pour créer une ambiance cosy et chaleureuse",
      dynamique: "dans un esprit dynamique et énergisant",
      zen: "pour une atmosphère zen et apaisante",
      sophistique: "avec une touche sophistiquée et raffinée",
      creative: "dans un environnement créatif et inspirant"
    };

    return `${styleMap[answers.style] || ""} ${colorMap[answers.colors] || ""} ${ambianceMap[answers.ambiance] || ""}.`;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setStyleProfile(null);
  };

  const saveAndContinue = () => {
    // Rediriger vers la page d'accueil ou le dashboard
    navigate('/');
  };

  if (isCompleted && styleProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] via-white to-[#e6faf7]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-[#20B2AA]" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#20B2AA] to-[#0f766e] bg-clip-text text-transparent">
                  Votre Profil de Style
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Félicitations ! Vous avez terminé le quiz de style. Voici votre profil personnalisé.
              </p>
            </div>

            {/* Style Profile Card */}
            <Card className="mb-8 overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#20B2AA] to-[#0f766e]"></div>
              
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Votre Style Unique
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {styleProfile.styleDescription}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(answers).map(([questionId, answer]) => {
                    const question = questions.find(q => q.id === questionId);
                    const option = question?.options.find(opt => opt.value === answer);
                    if (!question || !option) return null;
                    
                    return (
                      <div key={questionId} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">{question.category}</h4>
                        <Badge className={`mb-2 ${option.color || 'bg-gray-100 text-gray-800'} border-0`}>
                          {option.label}
                        </Badge>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Score */}
                <div className="mt-8 rounded-xl border border-[#9DE8E0] bg-gradient-to-r from-[#E6FAF7] to-[#F1F5F9] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Profil complété</h3>
                      <p className="text-gray-600">Quiz terminé le {new Date(styleProfile.completedAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#0f766e]">{Math.round(styleProfile.score)}%</div>
                      <div className="text-sm text-gray-600">Complétion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
              <HeroButton
                onClick={saveAndContinue}
                size="lg"
                className="bg-gradient-warm text-white shadow-elegant"
              >
                <Save className="w-5 h-5 mr-2" />
                Sauvegarder et Continuer
              </HeroButton>

              <HeroButton
                onClick={resetQuiz}
                variant="outline"
                size="lg"
                className="border border-[#cbd5f5] text-[#1f2937] hover:bg-[#eef2ff]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Refaire le Quiz
              </HeroButton>
            </div>

            {/* Additional Info */}
            <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200">
              <p className="text-gray-600 mb-4">
                Votre profil de style a été sauvegardé et peut être utilisé pour personnaliser votre expérience sur Adariz.
              </p>
              <p className="text-sm text-gray-500">
                Vous pouvez refaire ce quiz à tout moment pour mettre à jour vos préférences.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] via-white to-[#e6faf7]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Progress */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <Palette className="h-8 w-8 text-[#20B2AA]" />
              <h1 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-[#20B2AA] via-[#138d84] to-[#0f172a] bg-clip-text">
                Quiz de Style
              </h1>
            </div>
            
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Découvrez votre style de décoration personnel en répondant à quelques questions simples.
            </p>

            {/* Progress Bar Enhanced */}
            <div className="relative mb-6">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-[#20B2AA] to-[#0f766e] transition-all duration-700 ease-out"
                   style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <Badge variant="outline" className="bg-white">
                {currentQuestionData.category}
              </Badge>
              <span className="font-medium text-gray-500">
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <Badge variant="outline" className="bg-[#E6FAF7] text-[#0f766e]">
                {Math.round(progress)}% complété
              </Badge>
            </div>
          </div>

          {/* Question Card */}
          <div className={`transition-all duration-300 ${animationClass}`}>
            <Card className="mb-8 overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#20B2AA] to-[#0f766e]"></div>
              
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {currentQuestionData.title}
                </CardTitle>
                {currentQuestionData.subtitle && (
                  <CardDescription className="text-lg text-gray-600">
                    {currentQuestionData.subtitle}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pb-8">
                <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
                  <div className="grid gap-4 md:gap-6">
                    {currentQuestionData.options.map((option, index) => (
                      <div key={option.value} 
                           className={`group relative transition-all duration-300 transform hover:scale-[1.02] ${
                             currentAnswer === option.value ? 'scale-[1.02]' : ''
                           }`}
                           style={{ animationDelay: `${index * 100}ms` }}>
                        
                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                          currentAnswer === option.value 
                            ? 'bg-gradient-to-r from-[#20B2AA] to-[#0f766e] opacity-100' 
                            : 'bg-[#20B2AA]/10 opacity-0 group-hover:opacity-60'
                        }`}></div>
                        
                        <div className={`relative flex items-start gap-4 p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          currentAnswer === option.value
                            ? 'bg-white border-transparent shadow-lg'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}>
                          
                          <RadioGroupItem 
                            value={option.value} 
                            id={option.value}
                            className="mt-1 hidden"
                          />
                          
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            currentAnswer === option.value 
                              ? 'bg-gradient-to-r from-[#20B2AA] to-[#0f4c75] text-white scale-110' 
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            <CheckCircle className={`w-6 h-6 ${currentAnswer === option.value ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          
                          <Label 
                            htmlFor={option.value} 
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                                currentAnswer === option.value ? 'text-gray-800' : 'text-gray-700'
                              }`}>
                                {option.label}
                              </h3>
                              
                              {currentAnswer === option.value && (
                                <CheckCircle className="w-6 h-6 text-[#20B2AA] animate-in zoom-in-50 duration-200" />
                              )}
                            </div>
                            
                            <p className="text-gray-600 leading-relaxed">
                              {option.description}
                            </p>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Enhanced */}
          <div className="mb-8 flex items-center justify-between">
            <HeroButton
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="min-w-32 h-12 border border-[#cbd5f5] text-[#1f2937] hover:bg-[#eef2ff] disabled:border-[#e2e8f0] disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </HeroButton>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              {questions.map((_, index) => (
                <div key={index} 
                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
                       index <= currentQuestion 
                         ? 'scale-110 bg-gradient-to-r from-[#20B2AA] to-[#0f766e]' 
                         : 'bg-gray-300'
                     }`}></div>
              ))}
            </div>

            <HeroButton
              onClick={handleNext}
              disabled={!currentAnswer}
              className="min-w-32 h-12 bg-gradient-warm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLastQuestion ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Créer mon profil
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </HeroButton>
          </div>

          {/* Current Progress */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20B2AA] font-bold text-white shadow-lg">
                  1
                </div>
                <span className="font-medium text-gray-600">Accueil</span>
              </div>
              
              <div className="w-12 h-px bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#20B2AA] to-[#0f4c75] font-bold text-white shadow-lg">
                  2
                </div>
                <span className="font-medium text-gray-800">Quiz de style</span>
              </div>
            </div>
          </div>

          {/* Answers Summary */}
          {Object.keys(answers).length > 0 && (
            <div className="mt-8 rounded-xl border border-[#9DE8E0] bg-white/70 p-6 backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                <CheckCircle className="h-5 w-5 text-[#20B2AA]" />
                Vos réponses jusqu'à présent
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([questionId, answer]) => {
                  const question = questions.find(q => q.id === questionId);
                  const option = question?.options.find(opt => opt.value === answer);
                  return (
                    <Badge key={questionId} variant="secondary" className="bg-[#E6FAF7] text-[#0f766e]">
                      {option?.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleQuiz;