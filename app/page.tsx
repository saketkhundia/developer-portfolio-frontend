  "use client";

  import { useState } from "react";
  import axios from "axios";

  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

  import { Bar } from "react-chartjs-2";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  type Repo = {
    name: string;
    stars: number;
    forks: number;
    language: string | null;
  };

  type Analytics = {
    total_projects: number;
    total_stars: number;
    total_forks: number;
    recent_projects: number;
    most_used_language: string | null;
    language_distribution: Record<string, number>;
    skill_score: number;
  };

  export default function Home() {
    const [username, setUsername] = useState("");
    const [data, setData] = useState<{
      analytics: Analytics;
      repositories: Repo[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const analyze = async () => {
      if (!username) return;

      setLoading(true);



      try {
      const res = await axios.get(`https://developerintelligence.onrender.com/analyze/${username}?v=${Date.now()}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
        alert("Error fetching data");
      }

      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gray-950 text-white p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-8">
            Developer Intelligence Dashboard
          </h1>

          {/* Input Section */}
          <div className="flex gap-4 justify-center mb-10">
            <input
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 w-80"
              placeholder="Enter GitHub Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={analyze}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {data && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card title="Projects" value={data.analytics.total_projects} />
                <Card title="Stars" value={data.analytics.total_stars} />
                <Card title="Recent" value={data.analytics.recent_projects} />
                <Card title="Skill Score" value={data.analytics.skill_score} />
              </div>

              {/* Language Chart */}
              <div className="bg-gray-900 p-6 rounded-2xl mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                  Most Used Language:
                  <span className="text-blue-400 ml-2">
                    {data.analytics.most_used_language || "N/A"}
                  </span>
                </h2>

                <Bar
                  data={{
                    labels: Object.keys(data.analytics.language_distribution),
                    datasets: [
                      {
                        label: "Language Usage",
                        data: Object.values(
                          data.analytics.language_distribution
                        ),
                        backgroundColor: "rgba(59, 130, 246, 0.7)",
                      },
                    ],
                  }}
                />
              </div>

              {/* Repository List */}
              <div className="bg-gray-900 p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">Repositories</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {data.repositories.map((repo, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-xl hover:scale-105 transition"
                    >
                      <h3 className="font-bold text-lg">{repo.name}</h3>
                      <p className="text-sm text-gray-400">
                        ⭐ {repo.stars} | 🍴 {repo.forks}
                      </p>
                      <p className="text-sm text-blue-400">
                        {repo.language || "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function Card({ title, value }: { title: string; value: number }) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-center">
        <h3 className="text-gray-400">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-blue-400">{value}</p>
      </div>
    );
  }
