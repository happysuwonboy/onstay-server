import * as accDetailRepository from '../repository/accDetailRepository.js';

export async function getAccInfo(req, res) {
  const accid = req.params.accid;
  const result = await accDetailRepository.getAccInfo(accid);
  res.json(result);
}

export async function getRoomInfo(req, res){
  const accid = req.params.accid;
  const result = await accDetailRepository.getRoomInfo(accid);
  res.json(result);
}

export async function getSummary(req, res){
  const accid = req.params.accid;
  const result = await accDetailRepository.getSummary(accid);
  res.json(result);
}

export async function getAccPoint(req, res){
  const accid = req.params.accid;
  const result = await accDetailRepository.getAccPoint(accid);
  res.json(result);
}

export async function getMap(req, res){
  const accid = req.params.accid;
  const result = await accDetailRepository.getMap(accid);
  res.json(result);
}

