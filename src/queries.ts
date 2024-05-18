import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import ws from 'ws'

dotenv.config()
neonConfig.webSocketConstructor = ws
const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

const getPets = async (req: any, res: any) => {
  const pets = await prisma.pet.findMany();
  // for each pet, get records 
  const petsWithRecords = await Promise.all(pets.map(async (pet: any) => {
    const allergies = await prisma.allergy.findMany({
      where: {
        petId: pet.id
      }
    });
    const vaccines = await prisma.vaccine.findMany({
      where: {
        petId: pet.id
      }
    });
    return {
      ...pet,
      allergies,
      vaccines,
    };
  }));

  res.json(petsWithRecords);
};

const createPet = async (req: any, res: any) => {
  const { name, type, owner, dob } = req.body;

  if (!name || !type || !owner || !dob) {
    return res.status(400).send("all pet fields required");
  }

  try {
    const pet = await prisma.pet.create({
      data: { name, type, owner, dob },
    });
    res.json(pet);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
};

const addVaccineRecord = async (req: any, res: any) => {
  const { name, date, petId } = req.body;
  if (!name || !date || !petId) {
    return res.status(400).send("all vaccine fields required");
  }

  try {
    const record = await prisma.vaccine.create({
      data: { name, date, petId },
    });
    res.json(record);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
}

const addAllergyRecord = async (req: any, res: any) => {
  const { name, reactions, severity, petId } = req.body;
  if (!name || !reactions || !severity || !petId) {
    return res.status(400).send("all allergy fields required");
  }

  try {
    const record = await prisma.allergy.create({
      data: { name, reactions, severity, petId },
    });
    res.json(record);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
}

const getVaccinesForPet = async(req: any, res: any) => {
  const { petId } = req.query;
  if (!petId) {
    return res.status(400).send("petId required");
  }

  try {
    const record = await prisma.vaccine.findMany({
      where: {
        petId: parseInt(petId)
      }
    });
    res.json(record);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
}

const getAllergiesForPet = async(req: any, res: any) => {
  const { petId } = req.query;
  if (!petId) {
    return res.status(400).send("petId required");
  }

  try {
    const record = await prisma.allergy.findMany({
      where: {
        petId: parseInt(petId)
      }
    });
    res.json(record);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
}

module.exports = {
  getPets,
  createPet,
  addVaccineRecord,
  addAllergyRecord,
  getVaccinesForPet,
  getAllergiesForPet
};
