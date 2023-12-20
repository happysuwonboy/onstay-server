import * as accVisualReopsitory from '../repository/accVisualRepository.js';

export async function getVisual(req, res) {
  const result = await accVisualReopsitory.getVisual();
  res.json(result);
}