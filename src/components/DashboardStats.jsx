import { PhoneCall, Flame, ThermometerSun, Snowflake, Map, CalendarClock } from 'lucide-react';

export default function DashboardStats({ calls }) {
  const totalCalls = calls.length;
  const hotLeads = calls.filter(c => c.interestLevel?.toLowerCase() === 'hot').length;
  const warmLeads = calls.filter(c => c.interestLevel?.toLowerCase() === 'warm').length;
  const coldLeads = calls.filter(c => c.interestLevel?.toLowerCase() === 'cold').length;
  const siteVisits = calls.filter(c => c.siteVisitRequested).length;
  
  // Calculate calls this week (last 7 days)
  const callsThisWeek = calls.filter(c => {
    if (!c.callDate) return false;
    const callDate = new Date(c.callDate);
    const today = new Date();
    const diffTime = Math.abs(today - callDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  const stats = [
    { label: 'Total Calls', value: totalCalls, icon: PhoneCall, gradient: 'from-blue-500 to-cyan-500', iconColor: 'text-white' },
    { label: 'Hot Leads', value: hotLeads, icon: Flame, gradient: 'from-red-500 to-orange-500', iconColor: 'text-white' },
    { label: 'Warm Leads', value: warmLeads, icon: ThermometerSun, gradient: 'from-amber-400 to-yellow-500', iconColor: 'text-white' },
    { label: 'Cold Leads', value: coldLeads, icon: Snowflake, gradient: 'from-slate-400 to-slate-500', iconColor: 'text-white' },
    { label: 'Site Visits', value: siteVisits, icon: Map, gradient: 'from-emerald-400 to-teal-500', iconColor: 'text-white' },
    { label: 'This Week', value: callsThisWeek, icon: CalendarClock, gradient: 'from-purple-500 to-fuchsia-500', iconColor: 'text-white' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl shadow-lg border border-white/10 flex flex-col justify-between transform transition hover:-translate-y-1 hover:shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              <div className={`p-1.5 bg-white/20 rounded-lg backdrop-blur-sm ${stat.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
