import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all consultations
    const consultations = await db.consultation.findMany();

    // 2. Compute Metric Cards
    const totalRequests = consultations.length;
    
    // Total Unique Clients (by WhatsApp number)
    const uniqueClients = new Set(consultations.map(c => c.clientWhatsapp)).size;

    // Active Projects (status in REVIEW, NEGOTIATION, APPROVED)
    const activeProjects = consultations.filter(c => 
      ['REVIEW', 'NEGOTIATION', 'APPROVED'].includes(c.status)
    ).length;

    // Total Omzet (Sum of negotiatedPrice for APPROVED and COMPLETED projects)
    const totalOmzet = consultations
      .filter(c => ['APPROVED', 'COMPLETED'].includes(c.status))
      .reduce((sum, c) => sum + (c.negotiatedPrice || c.estimatedPriceMin || 0), 0);

    // 3. Compute Monthly Revenue (Last 6 Months: Jan - Jun 2026 or dynamic)
    // We will group by month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDataMap: Record<string, number> = {};
    
    // Initialize current year months
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      monthlyDataMap[`${months[i]}`] = 0;
    }

    consultations.forEach(c => {
      if (['APPROVED', 'COMPLETED'].includes(c.status)) {
        const date = new Date(c.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthName = months[date.getMonth()];
          const value = c.negotiatedPrice || c.estimatedPriceMin || 0;
          monthlyDataMap[monthName] += value;
        }
      }
    });

    const monthlyRevenue = Object.entries(monthlyDataMap).map(([name, omzet]) => ({
      name,
      omzet,
    }));

    // 4. Compute Service Distribution (Layanan Terpopuler)
    const serviceCounts: Record<string, { count: number; value: number }> = {
      'Film Production': { count: 0, value: 0 },
      'Animation': { count: 0, value: 0 },
      'Motion Graphic': { count: 0, value: 0 },
      'Creative Visual': { count: 0, value: 0 },
    };

    consultations.forEach(c => {
      const type = c.serviceType;
      const val = c.negotiatedPrice || c.estimatedPriceMin || 0;
      if (serviceCounts[type]) {
        serviceCounts[type].count += 1;
        serviceCounts[type].value += val;
      } else {
        serviceCounts[type] = { count: 1, value: val };
      }
    });

    const popularServices = Object.entries(serviceCounts).map(([name, data]) => ({
      name,
      value: data.count,
      revenue: data.value,
    }));

    // 5. Compute Project Status Breakdown
    const statusCounts: Record<string, number> = {
      'PENDING': 0,
      'REVIEW': 0,
      'NEGOTIATION': 0,
      'APPROVED': 0,
      'COMPLETED': 0,
    };

    consultations.forEach(c => {
      const status = c.status;
      if (statusCounts[status] !== undefined) {
        statusCounts[status] += 1;
      }
    });

    const statusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Return all data
    return NextResponse.json({
      metrics: {
        totalClients: uniqueClients,
        totalProjects: totalRequests,
        activeProjects,
        totalOmzet,
      },
      charts: {
        monthlyRevenue,
        popularServices,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to calculate analytics data' }, { status: 500 });
  }
}
