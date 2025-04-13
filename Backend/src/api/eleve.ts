import { Request, Response } from 'express';
import {
  getAllEleves,
  getEleveById,
  createEleve,
  updateEleve,
  deleteEleve,
  filterEleves
} from '../controllers/eleveController';

export const getEleves = async (req: Request, res: Response) => {
  try {
    const eleves = await getAllEleves();
    res.json(eleves);
  } catch (error) {
    console.error('Erreur dans getEleves :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des élèves' });
  }
};

export const getEleve = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const eleve = await getEleveById(id);
    if (eleve) {
      res.json(eleve);
    } else {
      res.status(404).json({ error: 'Élève non trouvé' });
    }
  } catch (error) {
    console.error('Erreur dans getEleve :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'élève' });
  }
};

export const postEleve = async (req: Request, res: Response) => {
  try {
    const newEleve = req.body;
    const createdEleve = await createEleve(newEleve);
    res.status(201).json(createdEleve);
  } catch (error) {
    console.error('Erreur dans postEleve :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'élève' });
  }
};

export const putEleve = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedEleve = await updateEleve(id, req.body);
    res.json(updatedEleve);
  } catch (error) {
    console.error('Erreur dans putEleve :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'élève' });
  }
};

export const removeEleve = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteEleve(id);
    res.status(204).end();
  } catch (error) {
    console.error('Erreur dans removeEleve :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'élève' });
  }
};

export const postFilterEleves = async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const results = await filterEleves(filters);
    res.json(results);
  } catch (error) {
    console.error('Erreur dans postFilterEleves :', error);
    res.status(500).json({ message: 'Erreur serveur lors du filtrage des élèves' });
  }
};
