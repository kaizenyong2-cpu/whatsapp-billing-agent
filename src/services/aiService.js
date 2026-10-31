import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Parses incoming WhatsApp text to determine intent and handle database queries/updates.
 * @param {string} text - Raw message text from WhatsApp
 * @param {string} senderPhone - Phone number of the sender
 */
export async function processIncomingMessage(text, senderPhone) {
  const trimmedText = text.trim();

  // Check for Customer
  const customer = await prisma.customer.findUnique({
    where: { phone: senderPhone },
    include: { invoices: true }
  });

  if (!customer) {
    return `Hello! Your phone number (${senderPhone}) is not registered in our billing system. Please contact support.`;
  }

  // Check Intent 1: Query specific invoice or all invoices
  if (/invoice|bill|status|check/i.test(trimmedText)) {
    if (customer.invoices.length === 0) {
      return `Hi ${customer.name}, you currently have no invoices on file.`;
    }

    const invoiceList = customer.invoices
      .map(inv => `• Invoice #${inv.invoiceNumber}: $${inv.amount.toFixed(2)} [Status: ${inv.status}]`)
      .join('\n');

    return `Hi ${customer.name}, here are your current invoices:\n\n${invoiceList}`;
  }

  // Default Help Response
  return `Hi ${customer.name}! I am your automated billing assistant.\n\nReply with "invoice" or "status" to check your pending bills.`;
}
