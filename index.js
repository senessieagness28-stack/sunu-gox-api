// index.js
const express = require ('express');
const { PrismaClient } = require ('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// LOOK INTO THESE
// What is a middleware in express
// What are call back functions (function into function)
// hhtp verbs
// Asynchronous function

// MIDDLEWARES
app.use(express.json());

// ROUTES
// 0. HOMEPAGE
// root '/'

app.get('/', async (req, res) => {
    res.send("Welcome To Sunu Gox API");
});


/**
 * 1. GET ALL AGENCIES
 * GET /api/agencies
 * Purpose: fetch every agency and it's ID.
 */
app.get('/api/agencies', async (req, res) => {
    try {
        const agencies = await prisma.agency.findMany();
        res.json(agencies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch agencies" });
    }
});

/**
 * 2. CREATE A NEW CIVIC REPORT / FILE A REPORT
 * POST /api/reports
 * Purpose: let a citizen submit an issue against a specific agency.
 */

app.post('/api/reports', async (req, res) => {  // THE WHOLE LINE IS CALLED A ROUTE
    const { location, description, agencyId } = req.body;

    // check before touching the database
    if (!location || !description || !agencyId) {
        return res.status(400).json({
            error: "Missing required fields: location, description, agencyId"
        });
    }
    
    try {
        const newReport = await prisma.report.create({
            data: { location, description, agencyId }
        });
        res.status(201).json(newReport);
    } catch (error) {
        // P2003 = FOREIGN KEY CONSTRAINT FAILED: THAT AGENCY DOES NOT EXIST
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: "Invalid agecyId - that agency does not exist."
            });
        }
        console.error(error);
        res.status(500).json({ error: "Failed to create report" });
    }
});

/**
 * 3. ONE AGENCY AND ALL IT'S REPORTS
 * GET /api/agencies/:id/reports
 */
app.get('/api/agencies/:id/reports', async (req, res) => {
    const { id } = req.params;

    try {
        const dashboard = await prisma.agency.findUnique({
            where: { id:id },
            include: { reports: true }  // <-- this is the JOIN
        });

        if (!dashboard) {
            return res.status(404).json({ error: "Agency not found" });
        }

        res.json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to load dashboard data" });
    }
});


// (endpoints go here) SERVER- NO CODES BELOW THIS  POINT
 app.listen(PORT, () => {
    console.log(`Sunu Gox API running on http://localhost:${PORT}`);
});