import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { ClientForm } from "@/components/ClientForm";
import { toast } from "sonner";
import { ChevronLeft, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/clients/$clientId")({
  component: ClientDetailsComponent,
});

function ClientDetailsComponent() {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const [client, setClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const data = await api.get(`/clients/${clientId}`);
      if (data.id) {
        setClient(data);
      } else {
        toast.error("Cliente não encontrado");
        navigate({ to: "/" });
      }
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await api.put(`/clients/${clientId}`, data);
      if (result.id) {
        setClient(result);
        setIsEditing(false);
        toast.success("Dados atualizados com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/clients/${clientId}`);
      toast.success("Cliente excluído com sucesso");
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Erro ao excluir cliente");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => isEditing ? setIsEditing(false) : navigate({ to: "/" })} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold truncate max-w-[200px]">
            {isEditing ? "Editar Cliente" : client.nome}
          </h1>
        </div>
        {!isEditing && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-5 w-5 text-gray-600" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {client.nome}? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col gap-2 mt-4 sm:flex-row">
                  <AlertDialogCancel className="h-12 rounded-xl">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="h-12 rounded-xl bg-red-500 hover:bg-red-600">
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </header>

      <main className="p-4 max-w-xl mx-auto">
        {isEditing ? (
          <ClientForm 
            initialData={client} 
            onSubmit={handleUpdate} 
            isLoading={isSaving} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">CPF</p>
                <p className="text-lg font-medium text-gray-900">{client.cpf}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">Contato</p>
                <p className="text-lg font-medium text-gray-900">{client.contato}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">Origem</p>
                <p className="text-lg font-medium text-gray-900">{client.origem}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">Endereço</p>
                <p className="text-lg font-medium text-gray-900 leading-relaxed">{client.endereco}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">Cadastrado em</p>
                <p className="text-sm text-gray-600">
                  {new Date(client.created_at).toLocaleDateString('pt-BR')} às {new Date(client.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800 rounded-xl"
              onClick={() => setIsEditing(true)}
            >
              Editar Informações
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
