import Head from 'next/head';

const schedule = [
  { day: 'Monday', shows: [
    { time: '6:00 AM', title: 'Morning Praise', host: 'DJ Dad' },
    { time: '12:00 PM', title: 'Noon Vibes', host: 'Auntie B' },
    { time: '6:00 PM', title: 'Evening Recharge', host: 'Uncle T' },
  ]},
  { day: 'Tuesday', shows: [
    { time: '7:00 AM', title: 'Sunrise Flow', host: 'DJ Flex' },
    { time: '1:00 PM', title: 'Gospel Gold', host: 'Auntie B' },
    { time: '7:00 PM', title: 'Talk Tuesday', host: 'Mr. Real' },
  ]},
  { day: 'Wednesday', shows: [
    { time: '6:00 AM', title: 'Midweek Worship', host: 'DJ Dad' },
    { time: '10:00 AM', title: 'Women’s Hour', host: 'Sister B' },
    { time: '8:00 PM', title: 'Late Night Lounge', host: 'Uncle T' },
  ]},
  // Add more days/shows as you want...
];

export default function SchedulePage() {
  return (
    <>
      <Head>
        <title>Weekly Schedule | GloriousTwin FM</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-10">
            Weekly Show Schedule
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            {schedule.map((day, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{day.day}</h2>
                <ul className="space-y-4">
                  {day.shows.map((show, i) => (
                    <li key={i} className="border-l-4 border-emerald-500 pl-4">
                      <p className="text-sm text-gray-500">{show.time}</p>
                      <p className="text-lg font-semibold text-gray-800">{show.title}</p>
                      <p className="text-sm text-gray-600">with {show.host}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
