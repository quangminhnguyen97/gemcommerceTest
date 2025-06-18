import CalculateUnit from "./CalculateUnit";

const App = () => {
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-[#151515] p-4 rounded-lg">
        <CalculateUnit />
      </div>
    </div>
  );
};

export default App;
