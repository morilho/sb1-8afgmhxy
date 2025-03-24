import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Calendar, MapPin, Users, Send, PlusCircle, Sparkles } from "lucide-react";

export default function App() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [acompanhantes, setAcompanhantes] = useState<Array<{ nome: string; idade: string }>>([]);
  const [enviado, setEnviado] = useState(false);
  const [erros, setErros] = useState({ nome: false, idade: false, acompanhantes: [] as Array<{ nome: boolean; idade: boolean }> });

  const handleChangeAcompanhante = (index: number, field: "nome" | "idade", value: string) => {
    const novosAcompanhantes = [...acompanhantes];
    novosAcompanhantes[index][field] = value;
    setAcompanhantes(novosAcompanhantes);
  };

  const adicionarAcompanhante = () => {
    setAcompanhantes([...acompanhantes, { nome: "", idade: "" }]);
    setErros((prev) => ({ ...prev, acompanhantes: [...prev.acompanhantes, { nome: false, idade: false }] }));
  };

  const handleConfirmar = async () => {
    let temErro = false;
    const novosErros = { nome: false, idade: false, acompanhantes: [] as Array<{ nome: boolean; idade: boolean }> };

    if (!nome.trim()) {
      novosErros.nome = true;
      temErro = true;
    }

    if (!idade.trim()) {
      novosErros.idade = true;
      temErro = true;
    }

    acompanhantes.forEach((a, i) => {
      const nomeInvalido = !a.nome.trim();
      const idadeInvalida = !a.idade.trim();
      if (nomeInvalido || idadeInvalida) temErro = true;
      novosErros.acompanhantes[i] = {
        nome: nomeInvalido,
        idade: idadeInvalida
      };
    });

    setErros(novosErros);
    if (temErro) return;

    const response = await fetch("https://formspree.io/f/mpwprkry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        idade,
        mensagem,
        ...Object.fromEntries(
          acompanhantes.flatMap((p, i) => [
            [`acompanhante_${i + 1}_nome`, p.nome],
            [`acompanhante_${i + 1}_idade`, p.idade],
          ])
        )
      })
    });

    if (response.ok) setEnviado(true);
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background container with fixed aspect ratio */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/frozen-background.jpg')`,
          backgroundPosition: 'center 20%'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]" />
      </div>

      {/* Content container */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Snowflake className="w-8 h-8 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Festa Frozen</h1>
            <Snowflake className="w-8 h-8 text-blue-200" />
          </div>
          <p className="text-lg md:text-xl text-blue-100">Você está convidado para uma aventura mágica!</p>
        </motion.div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400" />
          
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <p>20 de Abril de 2025 • 14:00</p>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <p>Buffet Mundo Mágico, Rua das Flores, 123</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!enviado ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={`w-full ${erros.nome ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  
                  <select
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border bg-white text-gray-900 ${
                      erros.idade ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Sua idade</option>
                    <option value="0 a 5 anos">0 a 5 anos</option>
                    <option value="5 a 10 anos">5 a 10 anos</option>
                    <option value="> 10 anos">maior que 10 anos</option>
                  </select>

                  {acompanhantes.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Users className="w-5 h-5" />
                        <p className="font-medium">Acompanhantes</p>
                      </div>
                      
                      {acompanhantes.map((pessoa, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2 p-4 bg-blue-50 rounded-lg"
                        >
                          <Input
                            placeholder="Nome do acompanhante"
                            value={pessoa.nome}
                            onChange={(e) => handleChangeAcompanhante(index, "nome", e.target.value)}
                            className={erros.acompanhantes[index]?.nome ? "border-red-500" : ""}
                          />
                          <select
                            value={pessoa.idade}
                            onChange={(e) => handleChangeAcompanhante(index, "idade", e.target.value)}
                            className={`w-full px-3 py-2 rounded-md border bg-white text-gray-900 ${
                              erros.acompanhantes[index]?.idade ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="">Idade</option>
                            <option value="0 a 5 anos">0 a 5 anos</option>
                            <option value="5 a 10 anos">5 a 10 anos</option>
                            <option value="> 10 anos">maior que 10 anos</option>
                          </select>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-blue-400 text-blue-600 hover:bg-blue-50"
                    onClick={adicionarAcompanhante}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Acompanhante
                  </Button>

                  <Textarea
                    placeholder="Deixe uma mensagem especial para a aniversariante ✨"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full min-h-[100px]"
                  />

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleConfirmar}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Confirmar Presença
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-green-700">
                      Presença confirmada!
                    </h3>
                    <p className="text-green-600">
                      Obrigado por confirmar, {nome}! 💖
                    </p>
                    <p className="text-blue-800">Idade: {idade}</p>
                    
                    {acompanhantes.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="font-medium text-blue-800">Acompanhantes:</p>
                        {acompanhantes.map((pessoa, index) => (
                          <p key={index} className="text-blue-700">
                            {pessoa.nome} ({pessoa.idade})
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {mensagem && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="italic text-blue-800">{mensagem}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}