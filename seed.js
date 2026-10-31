const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
console.log("Seeding database with Gambian agencies...");

const nawec = await prisma.agency.upsert({
where: { name: 'NAWEC (Water & Electricity)' },
update: {},
create: { name: 'NAWEC (Water & Electricity)' },
});

const kmc = await prisma.agency.upsert({
where: { name: 'Kanifing Municipal Council (KMC)' },
update: {},
create: { name: 'Kanifing Municipal Council (KMC)' },
});

const bac = await prisma.agency.upsert({
where: { name: 'Brikama Area Council (BAC)' },
update: {},
create: { name: 'Brikama Area Council (BAC)' },
});

console.log("Seeding complete.\n");
console.log("Copy these IDs — you need them to test your API:");
console.log(`${nawec.name}\n ${nawec.id}`);
console.log(`${kmc.name}\n ${kmc.id}`);
console.log(`${bac.name}\n ${bac.id}`);
}

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});