export interface InventoryItem {
  id: string;
  itemId: string;
  equipmentName: string;
  category: string;
  serialNumber: string;
  quantity: number;
  unit: string;
  status: 'Available' | 'Issued' | 'Damaged';
  location: string;
  assignedUnit: string;
  dateAcquired: string;
  condition: 'Good' | 'Repair Needed';
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrowerRank: string;
  borrowerName: string;
  dateIssued: string;
  expectedReturn: string;
  quantity: number;
  purpose: string;
  approvingOfficer: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  actualReturnDate?: string;
  returnCondition?: string;
  returnRemarks?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  rank: string;
  fullName: string;
  role: 'Admin' | 'Supply Officer' | 'Viewer';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

// 2. Map IndexedDB store names to your C# API endpoints
const getEndpoint = (storeName: string) => {
  switch(storeName) {
      case 'items': return `/api/inventory`;
      case 'issuances': return `/api/issuances`; // Note: You'll need to create this controller in C#
      case 'users': return `/api/users`;         // Note: You'll need to create this controller in C#
      case 'auditLogs': return `/api/auditlogs`; // Note: You'll need to create this controller in C#
      default: return `/api/${storeName}`;
  }
};

// 3. The Adapter (Fools React into thinking it's using IndexedDB)
export const getDB = async () => {
  return {
      getAll: async (storeName: string) => {
          try {
              const res = await fetch(getEndpoint(storeName));
              if (!res.ok) return [];
              return await res.json();
          } catch (e) {
              console.error(`Error fetching ${storeName}:`, e);
              return [];
          }
      },
      add: async (storeName: string, item: any) => {
          await fetch(getEndpoint(storeName), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
          });
      },
      put: async (storeName: string, item: any) => {
          await fetch(`${getEndpoint(storeName)}/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
          });
      },
      delete: async (storeName: string, id: string) => {
          await fetch(`${getEndpoint(storeName)}/${id}`, {
              method: 'DELETE'
          });
      }
  };
};

// Satisfy App.tsx's initialization check
export async function initDB() {
  return true; 
}