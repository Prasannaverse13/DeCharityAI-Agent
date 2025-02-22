import { type Charity, type InsertCharity, type Donation, type InsertDonation } from "@shared/schema";

export interface IStorage {
  getCharities(): Promise<Charity[]>;
  getCharity(id: number): Promise<Charity | undefined>;
  getDonationsByWallet(walletAddress: string): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private charities: Map<number, Charity>;
  private donations: Map<number, Donation>;
  private currentDonationId: number;

  constructor() {
    this.charities = new Map();
    this.donations = new Map();
    this.currentDonationId = 1;
    this.initMockData();
  }

  private initMockData() {
    const mockCharities: Charity[] = [
      {
        id: 1,
        name: "CyberEdu",
        description: "Empowering the next generation with neural-link enhanced learning systems in underserved communities. Our AI tutors provide personalized education paths for each student.",
        image: "/charity1.jpg",
        goal: 100000,
        raised: 45000,
        category: "Education",
        impact_metrics: "500 students equipped with neural learning aids | 87% improvement in STEM scores | 95% student retention rate | 50 AI tutors deployed",
        walletAddress: "0xB80232b4395e9cb595856F869614d49a58da8B1b",
      },
      {
        id: 2,
        name: "NeuroAid",
        description: "Providing cutting-edge neural implants to restore mobility and independence to those with disabilities. Every donation helps us advance our biotech research.",
        image: "/charity2.jpg",
        goal: 250000,
        raised: 120000,
        category: "Healthcare",
        impact_metrics: "200 successful implants | 150 mobility restorations | 90% patient satisfaction | 3 new breakthrough technologies developed",
        walletAddress: "0xB80232b4395e9cb595856F869614d49a58da8B1b",
      },
      {
        id: 3,
        name: "NetSecGuard",
        description: "Protecting vulnerable communities from cyber threats with advanced AI security systems. We provide free cybersecurity tools and education to non-profits.",
        image: "/charity3.jpg",
        goal: 150000,
        raised: 75000,
        category: "Security",
        impact_metrics: "1000+ organizations protected | 500 cyber attacks prevented | 2000 people trained in cybersecurity | 5 new security tools developed",
        walletAddress: "0xB80232b4395e9cb595856F869614d49a58da8B1b",
      },
      {
        id: 4,
        name: "GreenTechFuture",
        description: "Implementing AI-driven renewable energy solutions in urban environments. Our smart grids optimize energy distribution while reducing carbon footprint.",
        image: "/charity4.jpg",
        goal: 300000,
        raised: 180000,
        category: "Environment",
        impact_metrics: "30% reduction in urban energy consumption | 1000 homes connected to smart grid | 500 tons CO2 emissions prevented | 3 new clean energy innovations",
        walletAddress: "0xB80232b4395e9cb595856F869614d49a58da8B1b",
      },
    ];

    mockCharities.forEach(charity => {
      this.charities.set(charity.id, charity);
    });
  }

  async getCharities(): Promise<Charity[]> {
    return Array.from(this.charities.values());
  }

  async getCharity(id: number): Promise<Charity | undefined> {
    return this.charities.get(id);
  }

  async getDonationsByWallet(walletAddress: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      d => d.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const newDonation: Donation = {
      ...donation,
      id,
      timestamp: new Date(),
    };
    this.donations.set(id, newDonation);

    const charity = this.charities.get(donation.charityId);
    if (charity) {
      charity.raised += donation.amount;
      this.charities.set(charity.id, charity);
    }

    return newDonation;
  }
}

export const storage = new MemStorage();