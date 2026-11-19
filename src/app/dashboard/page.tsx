import { Metadata } from 'next';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard - ShopAltText',
  description: 'Manage your alt-text generation jobs',
};

async function getUserJobs(supabase: ReturnType<typeof createServerClient> | null) {
  if (!supabase) return [];
  const { data: jobs } = await supabase
    .from('alt_text_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return jobs || [];
}

async function getUsageStats(supabase: ReturnType<typeof createServerClient> | null) {
  if (!supabase) return [];
  const { data: events } = await supabase
    .from('usage_events')
    .select('event_type, created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
  return events || [];
}

export default async function DashboardPage() {
  const supabase = createServerClient();
  const jobs = await getUserJobs(supabase);
  const usage = await getUsageStats(supabase);

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    thisMonth: usage.filter(e => e.event_type === 'alt_text_generated').length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">ShopAltText Dashboard</h1>
            <div className="flex gap-4">
              <a href="/api/alt-text" className="text-sm text-blue-600 hover:text-blue-900">
                API Docs
              </a>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Jobs" value={stats.total} icon="📋" />
          <StatCard title="Completed" value={stats.completed} icon="✅" color="green" />
          <StatCard title="Pending" value={stats.pending} icon="⏳" color="yellow" />
          <StatCard title="Processing" value={stats.processing} icon="🔄" color="blue" />
          <StatCard title="This Month" value={stats.thisMonth} icon="📈" color="purple" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alt-Text Jobs</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Generate Alt Text
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alt Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No jobs yet. Connect your Shopify store to start generating alt text.
                    </td>
                  </tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Product #{job.shopify_product_id}
                      </td>
                      <td className="px-6 py-4">
                        <Image
                          src={job.image_url}
                          alt="Product"
                          width={48}
                          height={48}
                          className="object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {job.alt_text || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{job.model_used || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = 'gray',
}: {
  title: string;
  value: number;
  icon: string;
  color?: 'gray' | 'green' | 'yellow' | 'blue' | 'purple';
}) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${colors[color]} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
