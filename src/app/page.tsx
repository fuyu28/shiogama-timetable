import { NextTrainsClient } from "./components/NextTrainsClient";

export default function Home() {
  return (
    <main>
      <h1>Shiogama Timetable</h1>
      <NextTrainsClient />
    </main>
  );
}
