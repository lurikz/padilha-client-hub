import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { ClientForm } from "@/components/ClientForm";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clients/new")({
  component: NewClientComponent,
});

function NewClientComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await api.post("/clients", data);
      if (result.id) {
        toast.success("Cliente cadastrado com sucesso!");
        navigate({ to: "/" });
      } else {
        toast.error(result.error || "Erro ao cadastrar cliente");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-4 flex items-center border-b sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/" })} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Novo Cliente</h1>
      </header>

      <main className="p-4 max-w-xl mx-auto">
        <ClientForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          onCancel={() => navigate({ to: "/" })} 
        />
      </main>
    </div>
  );
}
