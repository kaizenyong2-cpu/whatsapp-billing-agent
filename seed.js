import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.upsert({
    where: { phone: '817089415237' },
    update: {},
    create: {
      phone: '817089415237',
      name: 'Enzo',
      invoices: {
        create: [
          {
            invoiceNumber: 'INV-2026-001',
            amount: 150.00,
            status: 'PENDING',
            dueDate: new Date('2026-11-15'),
          }
        ]
      }
    }
  });

  console.log('Database seeded successfully for customer:', customer.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  