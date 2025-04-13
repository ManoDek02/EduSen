// Backend/src/controller/professeurController.ts
import * as professeurApi from '../api/professeur';
import { Request, Response } from 'express';

export const getAllProfesseurs = async (_req: Request, res: Response) => {
  const data = await professeurApi.getProfesseurs();
  res.json(data);
};

export const getProfesseur = async (req: Request, res: Response) => {
  const data = await professeurApi.getProfesseurById(+req.params.id);
  res.json(data);
};

export const create = async (req: Request, res: Response) => {
  const data = await professeurApi.createProfesseur(req.body);
  res.status(201).json(data);
};

export const update = async (req: Request, res: Response) => {
  const data = await professeurApi.updateProfesseur(+req.params.id, req.body);
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  await professeurApi.deleteProfesseur(+req.params.id);
  res.sendStatus(204);
};

export const filter = async (req: Request, res: Response) => {
  const data = await professeurApi.filterProfesseurs(req.body);
  res.json(data);
};
