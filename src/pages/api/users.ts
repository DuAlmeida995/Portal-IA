import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        } 
        if (req.method == "GET") {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        }
        if (req.method == "POST") {
            const {name, email} = req.body;
            if (!email) return res.status(400).json({ error: "email is required" });

            const newUser = await prisma.user.create({
                data: { name: name || null, email },
            });
            res.status(201).json(newUser);
        } 
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        }
}

    
