import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ClientFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ClientForm({ initialData, onSubmit, isLoading, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    cpf: initialData?.cpf || "",
    contato: initialData?.contato || "",
    endereco: initialData?.endereco || "",
    origem: initialData?.origem || "Indicação",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
          placeholder="Ex: João Silva"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          required
          placeholder="000.000.000-00"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contato">Contato (WhatsApp/Telefone)</Label>
        <Input
          id="contato"
          value={formData.contato}
          onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
          required
          placeholder="(00) 00000-0000"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço Completo</Label>
        <Textarea
          id="endereco"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          required
          placeholder="Rua, Número, Bairro, Cidade"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="origem">Origem do Cliente</Label>
        <Select
          value={formData.origem}
          onValueChange={(value) => setFormData({ ...formData, origem: value })}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Selecione a origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Indicação">Indicação</SelectItem>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="submit"
          className="h-14 text-lg font-semibold bg-black hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Cliente"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-14 text-lg font-semibold"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
