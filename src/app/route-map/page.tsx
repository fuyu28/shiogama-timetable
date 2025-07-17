import Image from "next/image";

export default function RouteMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            名古屋市営地下鉄路線図
          </h1>
          <p className="text-gray-600">Nagoya Municipal Subway Route Map</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center">
            <Image
              src="https://www.kotsu.city.nagoya.jp/jp/pc/subway/images/subway_routemap.png"
              alt="名古屋市営地下鉄路線図"
              width={1200}
              height={800}
              className="max-w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">出典: 名古屋市交通局</p>
        </div>
      </div>
    </div>
  );
}
