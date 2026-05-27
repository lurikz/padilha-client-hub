import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Plus, Search, User, LogOut, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ClientForm } from "@/components/ClientForm";

export const Route = createFileRoute("/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    fetchClients();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const data = await api.get("/clients");
      if (Array.isArray(data)) {
        setClients(data);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await api.post("/clients", data);
      if (result.id) {
        toast.success("Cliente cadastrado com sucesso!");
        setIsDialogOpen(false);
        fetchClients();
      } else {
        toast.error(result.error || "Erro ao cadastrar cliente");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate({ to: "/login" });
  };

  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Padilha Tech</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9 h-12 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="h-12 w-12 p-0 rounded-full shadow-lg bg-black hover:bg-gray-800"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Carregando...</div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Link
                key={client.id}
                to="/clients/$clientId"
                params={{ clientId: client.id }}
                className="block"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{client.nome}</h3>
                      <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                        <Phone className="h-3 w-3" />
                        {client.contato}
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase font-medium">
                      {client.origem}
                    </span>
                  </div>
                  <div className="mt-2 text-gray-500 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{client.endereco}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Add Button for Mobile (Alternative) */}
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-black hover:bg-gray-800 p-0 flex items-center justify-center"
      >
        <Plus className="h-8 w-8 text-white" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-4">
          <DialogHeader className="mb-4">
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para cadastrar um novo cliente.
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleCreateClient} 
            isLoading={isSaving} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
