import pool from '../config/database';

export const findAll = async () => {
  const result = await pool.query('SELECT * FROM public.clients ORDER BY created_at DESC');
  return result.rows;
};

export const findById = async (id: string) => {
  const result = await pool.query('SELECT * FROM public.clients WHERE id = $1', [id]);
  return result.rows[0];
};

export const create = async (data: any) => {
  const { nome, cpf, contato, endereco, origem } = data;
  const result = await pool.query(
    'INSERT INTO public.clients (nome, cpf, contato, endereco, origem) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cpf, contato, endereco, origem]
  );
  return result.rows[0];
};

export const update = async (id: string, data: any) => {
  const { nome, cpf, contato, endereco, origem } = data;
  const result = await pool.query(
    'UPDATE public.clients SET nome = $1, cpf = $2, contato = $3, endereco = $4, origem = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
    [nome, cpf, contato, endereco, origem, id]
  );
  return result.rows[0];
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM public.clients WHERE id = $1 RETURNING id', [id]);
  return result.rowCount ? result.rowCount > 0 : false;
};
