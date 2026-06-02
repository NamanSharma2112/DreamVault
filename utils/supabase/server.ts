import { createServerClient } from "@supabase/ssr";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "db.json");

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ items: [], goals: [], expenses: [], users: [{ id: "mock-user-id", monthlyIncome: 100000, monthlySavings: 30000, monthlyExpenses: 50000, currency: "INR" }] }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

class MockQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private updateData: any = null;
  private insertData: any = null;
  private deleteFlag = false;
  private isSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string) {
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push((item) => item[col] === val);
    return this;
  }

  neq(col: string, val: any) {
    this.filters.push((item) => item[col] !== val);
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data: any) {
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.updateData = data;
    return this;
  }

  delete() {
    this.deleteFlag = true;
    return this;
  }

  order(col: string, { ascending = true } = {}) {
    return this;
  }

  async then(resolve: any, reject: any) {
    try {
      const db = readDb();
      let tableData = db[this.table] || [];

      // Apply filters
      for (const filter of this.filters) {
        tableData = tableData.filter(filter);
      }

      if (this.insertData) {
        const records = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
        const newRecords = records.map((r) => ({
          id: r.id || Math.random().toString(36).substring(2, 9),
          userId: "mock-user-id",
          createdAt: new Date().toISOString(),
          ...r,
        }));
        db[this.table] = [...(db[this.table] || []), ...newRecords];
        writeDb(db);
        return resolve({ data: Array.isArray(this.insertData) ? newRecords : newRecords[0], error: null });
      }

      if (this.updateData) {
        db[this.table] = (db[this.table] || []).map((item: any) => {
          const matches = this.filters.every((f) => f(item));
          if (matches) {
            return { ...item, ...this.updateData };
          }
          return item;
        });
        writeDb(db);
        const updated = db[this.table].filter((item: any) => this.filters.every((f) => f(item)));
        return resolve({ data: this.isSingle ? updated[0] : updated, error: null });
      }

      if (this.deleteFlag) {
        db[this.table] = (db[this.table] || []).filter((item: any) => {
          const matches = this.filters.every((f) => f(item));
          return !matches;
        });
        writeDb(db);
        return resolve({ data: null, error: null });
      }

      let dataResult = tableData;

      if (this.table === "goals") {
        dataResult = tableData.map((goal: any) => {
          const items = db.items.filter((item: any) => item.goalId === goal.id);
          return { ...goal, items };
        });
      }

      if (this.table === "items") {
        dataResult = tableData.map((item: any) => {
          const goal = db.goals.find((g: any) => g.id === item.goalId);
          return {
            ...item,
            goal: goal ? { id: goal.id, title: goal.title } : null,
          };
        });
      }

      if (this.isSingle) {
        return resolve({ data: dataResult[0] || null, error: null });
      }

      return resolve({ data: dataResult, error: null });
    } catch (e: any) {
      return resolve({ data: null, error: e });
    }
  }
}

export const createClient = (cookieStore?: any) => {
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jrwbduvxnfklsufzmrvw.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_UDfHYQTgwOH1nLWURH_tLg_Co79u2FU",
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  // Override auth.getUser
  client.auth.getUser = async () => {
    return {
      data: {
        user: {
          id: "mock-user-id",
          email: "naman@dreamvault.com",
          user_metadata: { name: "Naman" },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as any,
      },
      error: null,
    };
  };

  // Override from
  client.from = (table: string) => {
    return new MockQueryBuilder(table) as any;
  };

  return client;
};
