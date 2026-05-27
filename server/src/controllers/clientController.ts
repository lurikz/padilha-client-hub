import { Request, Response } from 'express';
import * as clientService from '../services/clientService';
import { z } from 'zod';

const clientSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  contato: z.string().min(1, 'Contato é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  origem: z.string().min(1, 'Origem é obrigatória'),
});

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientService.findAll();
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await clientService.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const validatedData = clientSchema.parse(req.body);
    const newClient = await clientService.create(validatedData);
    res.status(201).json(newClient);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const validatedData = clientSchema.parse(req.body);
    const updatedClient = await clientService.update(req.params.id, validatedData);
    if (!updatedClient) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(updatedClient);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const deleted = await clientService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
